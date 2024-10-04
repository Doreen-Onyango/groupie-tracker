package models

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"
)

// retrieve data from URL
func (a *MainApi) fetchData(apitype string) ([]byte, error) {
	baseUrl := a.baseUrl
	if apitype != "artists" {
		baseUrl = apitype
	} else {
		baseUrl = fmt.Sprintf("%s%s", baseUrl, apitype)
	}

	res, err := http.Get(baseUrl)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}

// store first error encountered, propergated to other parts of the system
func handleError(err error, firstErr *error) {
	if *firstErr == nil {
		*firstErr = err
		instance.Err = err
	}
}

// unmarshal  data and checks for errors during the process.

func (r *ResponseData) processLocations(id string, data []byte, firstErr *error) error {
	var temLocations Locations

	if err := json.Unmarshal(data, &temLocations); err != nil {
		handleError(err, firstErr)
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.Locations[id] = temLocations

	return nil
}

func (r *ResponseData) processConcerts(id string, data []byte, firstErr *error) error {
	var tempConcerts Concerts

	if err := json.Unmarshal(data, &tempConcerts); err != nil {
		handleError(err, firstErr)
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.Concerts[id] = tempConcerts

	return nil
}

func (r *ResponseData) processRelations(id string, data []byte, firstErr *error) error {
	var tempRelation Relation

	if err := json.Unmarshal(data, &tempRelation); err != nil {
		fmt.Println("Error unmarshalling relation:", err)
		handleError(err, firstErr)
		return err
	}

	for location, dates := range tempRelation.DatesLocations {
		tempRelation.DatesLocations[location] = dates
	}

	r.mu.Lock()
	defer r.mu.Unlock()
	r.Relations[id] = tempRelation
	return nil
}

// retrieve artist data from API, handle potential errors and unmarshals the data
func (r *ResponseData) AddArtist(api *MainApi) error {
	data, err := api.fetchData("artists")
	if err != nil {
		instance.Err = err
		return fmt.Errorf("no internet connection %v", err)
	}

	var artists []Artist
	if err := json.Unmarshal(data, &artists); err != nil {
		return fmt.Errorf("oops! connection problem")
	}

	r.mu.Lock()
	for _, artist := range artists {
		r.Artists[artist.ID] = artist
	}
	r.mu.Unlock()

	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		r.SetData(api)
	}()

	go func() {
		wg.Wait()
		r.AddCoordinates()
	}()
	allArtists <- struct{}{}

	return nil
}

// process all artists in a concurrently using goroutines and
// tracking their completion with a WaitGroup.
func (r *ResponseData) SetData(api *MainApi) error {
	var wg sync.WaitGroup
	var firstErr error

	for _, artist := range r.Artists {
		r.processArtist(artist.ID, &wg, api, artist, &firstErr)
	}
	wg.Wait()

	if firstErr != nil {
		return fmt.Errorf("network error %w", firstErr)
	}
	return nil
}

func (r *ResponseData) processArtist(id string, wg *sync.WaitGroup, api *MainApi, artist Artist, firstErr *error) {
	r.processUrl(id, artist.Locations, wg, api, firstErr)
	r.processUrl(id, artist.ConcertDates, wg, api, firstErr)
	r.processUrl(id, artist.Relations, wg, api, firstErr)
}

// categorizes the fetched data based on the URL content and processes it accordingly
func (r *ResponseData) processUrl(id, url string, wg *sync.WaitGroup, api *MainApi, firstErr *error) {
	wg.Add(1)
	go func() {
		defer wg.Done()
		data, err := api.fetchData(url)
		if err != nil {
			handleError(err, firstErr)
			return
		}

		switch {
		case strings.Contains(url, "locations"):
			r.processLocations(id, data, firstErr)
		case strings.Contains(url, "dates"):
			r.processConcerts(id, data, firstErr)
		case strings.Contains(url, "relation"):
			r.processRelations(id, data, firstErr)
		}
	}()
}

// retrieve all artists data and related information.
func (r *ResponseData) GetAllArtist() ([]Artist, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if instance.Err != nil {
		err := instance.Err
		instance.Err = nil
		r.AddArtist(instance.Api)
		return nil, err
	}

	artists := make([]Artist, 0, len(r.Artists))
	for _, artist := range r.Artists {
		artists = append(artists, artist)
	}

	return artists, nil
}

// retrieve artist data and related information based on a given id
func (r *ResponseData) GetArtistById(id string) (map[string]interface{}, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	res := make(map[string]interface{})
	if artist, ok := r.Artists[id]; ok {
		res["artist"] = artist
	}

	if location, ok := r.Locations[id]; ok {
		res["locations"] = location
	}

	if concert, ok := r.Concerts[id]; ok {
		res["concertDates"] = concert
	}

	if relations, ok := r.Relations[id]; ok {
		res["relations"] = relations
	}

	if len(res) == 0 {
		return nil, fmt.Errorf("404 data not found %s", id)
	}
	return res, nil
}

// Function to AddCoordinates using the Google Maps API
func (r *ResponseData) AddCoordinates() error {
	var wg sync.WaitGroup
	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	errCh := make(chan error, 1)

	for key, artist := range r.Locations {
		for _, location := range artist.Locations {
			wg.Add(1)

			go func(loc, artistID string) {
				defer wg.Done()

				url := fmt.Sprintf("https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s", loc, apiKey)
				resp, err := http.Get(url)
				if err != nil {
					errCh <- err
					return
				}
				defer resp.Body.Close()

				body, err := io.ReadAll(resp.Body)
				if err != nil {
					errCh <- err
					return
				}

				var geocodeResponse GeocodeResponse
				err = json.Unmarshal(body, &geocodeResponse)
				if err != nil {
					errCh <- err
					return
				}

				if geocodeResponse.Status != "OK" {
					errCh <- fmt.Errorf("geocoding failed: %s", geocodeResponse.Status)
					return
				}

				geoLocation := GeoLocation{
					ArtistID:  artistID,
					Location:  loc,
					Latitude:  geocodeResponse.Results[0].Geometry.Location.Lat,
					Longitude: geocodeResponse.Results[0].Geometry.Location.Lng,
				}

				r.mu.Lock()
				r.GeoLocations[artistID] = append(r.GeoLocations[artistID], geoLocation)
				r.mu.Unlock()

			}(location, key)
		}
	}

	wg.Wait()
	close(errCh)

	if len(errCh) > 0 {
		return <-errCh
	}

	return nil
}

// Method to get the coordinates of a specific location
func (r *ResponseData) GetCoordinates(location string) ([]GeoLocation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	geoLocation, exists := r.GeoLocations[location]
	if !exists {
		return []GeoLocation{}, fmt.Errorf("location not found")
	}

	return geoLocation, nil
}
