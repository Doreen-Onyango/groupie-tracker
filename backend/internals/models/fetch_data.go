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

func handleError(err error, firstErr *error) {
	if *firstErr == nil {
		*firstErr = err
		instance.Err = err
	}
}

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
	defer r.mu.Unlock()

	for _, artist := range artists {
		r.Artists[artist.ID] = artist
	}

	go r.SetData(api)
	allArtists <- struct{}{}
	return nil
}

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

// Function to geocode a location using the Google Maps API
func (r *ResponseData) GeocodeLocation(location string) (float64, float64, error) {
	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	url := fmt.Sprintf("https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s", location, apiKey)

	resp, err := http.Get(url)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, 0, err
	}

	var geocodeResponse GeocodeResponse
	err = json.Unmarshal(body, &geocodeResponse)
	if err != nil {
		return 0, 0, err
	}

	if geocodeResponse.Status != "OK" {
		return 0, 0, fmt.Errorf("geocoding failed: %s", geocodeResponse.Status)
	}

	lat := geocodeResponse.Results[0].Geometry.Location.Lat
	lng := geocodeResponse.Results[0].Geometry.Location.Lng
	return lat, lng, nil
}
