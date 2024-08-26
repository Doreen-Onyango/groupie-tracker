package routers

import (
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker/internals/handlers"
)

func RegisterRoutes() {
	http.HandleFunc("/", handlers.HomeHandler)
}
