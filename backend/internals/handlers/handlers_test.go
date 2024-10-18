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
)

func TestGetAllArtists_Success(t *testing.T) {
	mockResponse := &models.MockResponseData{
		Artists: []models.Artist{
			{ID: "1", Name: "Artist 1"},
		},
		Error: false,
	}

	app := &models.App{
		ResTest: mockResponse,
	}

	repo := handlers.NewRepo(app)

	reqBody := `{"request": "all"}`
	req := httptest.NewRequest("POST", "/artists", bytes.NewBuffer([]byte(reqBody)))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()

	repo.GetAllArtists(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("Expected status code %d, got %d", http.StatusOK, res.StatusCode)
	}

	var jsonResponse responses.JSONRes
	err := json.NewDecoder(res.Body).Decode(&jsonResponse)
	if err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if jsonResponse.Err {
		t.Fatal("Expected no error in response, got one")
	}
	if jsonResponse.Message != "success" {
		t.Fatalf("Expected message 'success', got '%s'", jsonResponse.Message)
	}
	if jsonResponse.Data == nil {
		t.Fatal("Expected data to be non-nil")
	}
}
