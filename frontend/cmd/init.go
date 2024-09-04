package main

import (
	"github.com/Doreen-Onyango/groupie-tracker/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker/internals/routers"
)

func init() {
	apis := models.NewMainApi()
	repo := handlers.NewRepo(apis)
	routers.RegisterRoutes(repo)
}
