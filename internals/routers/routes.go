package routers

import (
	"net/http"
	"path/filepath"

	"github.com/Doreen-Onyango/groupie-tracker/internals/handlers"
)

func RegisterRoutes() {
	http.HandleFunc("/", handlers.HomeHandler)
	http.HandleFunc("/data", handlers.GetData)

	staticDir := http.Dir(filepath.Join("../../static"))
	staticHandler := http.StripPrefix("/static/", http.FileServer(staticDir))

	http.Handle("/static/", staticHandler)
}
