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
	mux := http.NewServeMux()

	mux.HandleFunc("/api/getallartists", m.repo.GetAllArtists)
	mux.HandleFunc("/api/getartistbyid", m.repo.GetArtistById)

	return middlewares.CORSMiddleware(mux)
}
