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

// RegisterRoutes registers the routes for the application.
func (r *Routes) RegisterRoutes(mux *http.ServeMux) *http.ServeMux {
	staticDir := r.app.TemplateData.GetProjectRoute("views/static")
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))

	mux.HandleFunc("/", r.repo.HomeHandler)

	return mux
}
