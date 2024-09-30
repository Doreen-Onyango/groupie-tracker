package handlers

import (
	"encoding/json"
	"net/http"

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
func (m *Repo) GetConcertLocation(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Request string `json:"location"`
	}

	err := m.res.ReadJSON(w, r, &requestData)
	if err != nil {
		m.res.ErrJSON(w, err, http.StatusBadRequest)
		return
	}

	loc, err := m.app.Res.GetCoordinates(requestData.Request)
	if err != nil {
		m.res.Err = true
		m.res.Message = err.Error()
		m.res.ErrJSON(w, err, http.StatusNotFound)
		return
	}

	locJSON, _ := json.Marshal(loc)
	m.res.Err = false
	m.res.Message = "success"
	m.res.Data = json.RawMessage(locJSON)

	if err := m.res.WriteJSON(w, *m.res, http.StatusOK); err != nil {
		m.res.ErrJSON(w, err, http.StatusInternalServerError)
	}
}
