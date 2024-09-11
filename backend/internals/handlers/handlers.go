package handlers

import (
	"encoding/json"
	"fmt"
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

	fmt.Println(artistData)

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
		Request string `json:"request"`
	}

	err := m.res.ReadJSON(w, r, &requestData)
	if err != nil {
		m.res.ErrJSON(w, err, http.StatusBadRequest)
		return
	}

	artistData, err := m.app.Res.GetArtistById(requestData.Request)
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
