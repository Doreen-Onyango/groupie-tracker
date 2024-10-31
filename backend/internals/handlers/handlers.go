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

// handles HTTP requests to fetch all artists.
func (m *Repo) GetAllArtists(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Request string `json:"request"`
	}

	err := m.res.ReadJSON(w, r, &requestData)
	if err != nil {
		m.res.ErrJSON(w, err, http.StatusBadRequest)
		return
	}

	var artistData []models.Artist
	if m.app.ResTest != nil { 
		artistData, err = m.app.ResTest.GetAllArtist()
	} else {
		artistData, err = m.app.Res.GetAllArtist()
	}

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

// handles requests to fetch an artist by their ID
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
