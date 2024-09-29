package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/responses"
)

type Repo struct {
	app *models.App
	res *responses.JSONRes
}

func NewRepo(app *models.App) *Repo {
	return &Repo{app, responses.NewJSONRes()}
}

func (m *Repo) GetAllArtists(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Request string `json:"request"`
	}

	err := m.res.ReadJSON(w, r, &requestData)
	if err != nil {
		m.res.ErrJSON(w, err, http.StatusBadRequest)
		return
	}

	artistData, err := m.app.Res.GetAllArtist()
	if err != nil || len(artistData) == 0 {
		m.res.Err = true
		m.res.Message = "oops something went wrong, network error"
		m.res.ErrJSON(w, err, http.StatusInternalServerError)
		return
	}

	artistsJSON, _ := json.Marshal(artistData)
	m.res.Err = false
	m.res.Message = "success"
	m.res.Data = json.RawMessage(artistsJSON)

	if err := m.res.WriteJSON(w, *m.res, http.StatusOK); err != nil {
		m.res.ErrJSON(w, err, http.StatusInternalServerError)
	}
}

func (m *Repo) GetArtistById(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Request string `json:"artist_id"`
	}

	err := m.res.ReadJSON(w, r, &requestData)
	if err != nil {
		m.res.ErrJSON(w, err, http.StatusBadRequest)
		return
	}

	artistData, err := m.app.Res.GetArtistById(requestData.Request)
	if err != nil || len(artistData) == 0 {
		m.res.Err = true
		m.res.Message = err.Error()
		m.res.ErrJSON(w, err, http.StatusNotFound)
		return
	}

	artistsJSON, _ := json.Marshal(artistData)
	m.res.Err = false
	m.res.Message = "success"
	m.res.Data = json.RawMessage(artistsJSON)

	if err := m.res.WriteJSON(w, *m.res, http.StatusOK); err != nil {
		m.res.ErrJSON(w, err, http.StatusInternalServerError)
	}
}

// API handler to get artist concert locations with geocoding
func (m *Repo) GetConcertLocations(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Request string `json:"artist_id"`
	}

	err := m.res.ReadJSON(w, r, &requestData)
	if err != nil {
		m.res.ErrJSON(w, err, http.StatusBadRequest)
		return
	}

	artistData, err := m.app.Res.GetArtistById(requestData.Request)
	if err != nil || len(artistData) == 0 {
		m.res.Err = true
		m.res.Message = err.Error()
		m.res.ErrJSON(w, err, http.StatusNotFound)
		return
	}

	// Geocode concert locations
	for i, concert := range artistData["locations"] {
		lat, lng, err := GeocodeLocation(concert.Location)
		if err != nil {
			http.Error(w, "Failed to geocode location", http.StatusInternalServerError)
			return
		}
		artistData[i].Latitude = lat
		artistData[i].Longitude = lng
	}

	// Return the artist's concert data with geolocation
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artist)
}
