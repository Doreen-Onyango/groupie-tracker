package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-client/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/renders"
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/routers"
)

const webPort = ":8080"

type Config struct {
	appState *models.App
	repo     *handlers.Repo
	routes   *routers.Routes
}

func NewConfig() *Config {
	appState := models.GetApp()
	renders := renders.NewRenders(appState)
	repo := handlers.NewRepo(appState, renders)

	return &Config{
		appState: appState,
		repo:     repo,
		routes:   routers.NewRoutes(repo),
	}
}

func runServer() (*http.Server, error) {
	cfg := NewConfig()
	mux := http.NewServeMux()

	cfg.routes.RegisterRoutes(mux)

	server := &http.Server{
		Addr:    webPort,
		Handler: mux,
	}

	return server, nil
}

func main() {
	server, err := runServer()
	if err != nil {
		fmt.Println("Something went wrong... the port is possibly in use.")
		return
	}

	log.Printf("Starting client server...@http://localhost%s", webPort)
	server.ListenAndServe()
}
