package routers

import (
	"net/http"
	"path/filepath"

	"github.com/Doreen-Onyango/groupie-tracker/internals/handlers"
)

func RegisterRoutes(repo *handlers.Repo) {
	http.HandleFunc("/", repo.HomeHandler)
	http.HandleFunc("/data", repo.GetData)

	staticDir := http.Dir(filepath.Join("../../static"))
	staticHandler := http.StripPrefix("/static/", http.FileServer(staticDir))

	http.Handle("/static/", staticHandler)
}
