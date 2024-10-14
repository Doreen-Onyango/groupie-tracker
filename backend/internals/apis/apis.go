package apis

import (
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/middlewares"
)

type Apis struct {
	repo *handlers.Repo
}

func NewApis(repo *handlers.Repo) *Apis {
	return &Apis{repo}
}

func (m *Apis) ApiRoutes() http.Handler {
	if m.repo == nil {
		return http.HandlerFunc(defaultHandler)
	}
	mux := http.NewServeMux()

	mux.HandleFunc("/api/getallartists", m.repo.GetAllArtists)
	mux.HandleFunc("/api/getartistbyid", m.repo.GetArtistById)
	mux.HandleFunc("/api/getcoordinates", m.repo.GetConcertLocation)

	return middlewares.CORSMiddleware(mux)
}
func defaultHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Default handler response"))
}
