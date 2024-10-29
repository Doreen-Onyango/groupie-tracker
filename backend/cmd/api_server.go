package main

import (
	"log"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/apis"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/models"
)

// Initialize port
const webPort = ":4000"

// Declare global variables for the application state, repository, and API setup.
var (
	app  = models.AppState()
	repo = handlers.NewRepo(app)
	api  = apis.NewApis(repo)
)

// initialize server configuration
type Config struct {
	apiRoutes http.Handler
}

// initialize the API routes
func NewConfig() *Config {
	return &Config{apiRoutes: api.ApiRoutes()}
}

// Starting point of application
func main() {
	app := NewConfig()

	log.Printf("Starting api server... @http//localhost: %s", webPort)
	server := &http.Server{
		Addr:    webPort,
		Handler: app.apiRoutes,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
		return
	}
}
