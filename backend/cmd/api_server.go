package main

import (
	"log"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/apis"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/models"
)

const webPort = ":4000"

var (
	app  = models.AppState()
	repo = handlers.NewRepo(app)
	api  = apis.NewApis(repo)
)

type Config struct {
	apiRoutes http.Handler
}

func NewConfig() *Config {
	return &Config{apiRoutes: api.ApiRoutes()}
}

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
