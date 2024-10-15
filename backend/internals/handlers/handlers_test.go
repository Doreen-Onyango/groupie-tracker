package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/responses"
	"github.com/stretchr/testify/assert"
)

func TestGetAllArtists_Success(t *testing.T) {
	mockResponse := &models.MockResponseData{
		Artists: []models.Artist{
			{ID: "1", Name: "Artist 1"},
		},
		Error: false, // Ensure no error is set
	}

	app := &models.App{
		ResTest: mockResponse, // Set the mock response for tests
	}

	repo := handlers.NewRepo(app)

	reqBody := `{"request": "all"}`
	req := httptest.NewRequest("POST", "/artists", bytes.NewBuffer([]byte(reqBody)))
	req.Header.Set("Content-Type", "application/json") // Set the content type

	w := httptest.NewRecorder()

	repo.GetAllArtists(w, req)

	res := w.Result()
	assert.Equal(t, http.StatusOK, res.StatusCode)

	var jsonResponse responses.JSONRes
	err := json.NewDecoder(res.Body).Decode(&jsonResponse)
	if err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	assert.False(t, jsonResponse.Err)
	assert.Equal(t, "success", jsonResponse.Message)
	assert.NotNil(t, jsonResponse.Data)
}
