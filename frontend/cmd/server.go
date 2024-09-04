package main

import (
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
