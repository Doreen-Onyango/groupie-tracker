package apis

import (
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/middlewares"
)

type Apis struct {
	repo *handlers.Repo
}

// initialize and return a new Apis instance
func NewApis(repo *handlers.Repo) *Apis {
	return &Apis{repo}
}

//	sets up the HTTP routes for the API.
//
// creates and registers routes for the API endpoints if a repo is initialized
func (m *Apis) ApiRoutes() http.Handler {
	if m.repo == nil {
		return http.HandlerFunc(defaultHandler)
	}
	mux := http.NewServeMux()

	mux.HandleFunc("/api/getallartists", m.repo.GetAllArtists)
	mux.HandleFunc("/api/getartistbyid", m.repo.GetArtistById)

	routes := middlewares.RouteChecker(mux)

	return middlewares.CORSMiddleware(routes)
}

func defaultHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Default handler response"))
}
