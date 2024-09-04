package routers

import (
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-client/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/models"
)

type Routes struct {
	app  *models.App
	repo *handlers.Repo
}

// NewRoutes creates a new Routes instance with the given handlers.
func NewRoutes(repo *handlers.Repo) *Routes {
	return &Routes{
		repo: repo,
		app:  models.GetApp(),
	}
}
