package main

import (
	"fmt"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker/internals/routers"
)

func main() {
	routers.RegisterRoutes()

	server := &http.Server{
		Addr: ":8080",
	}

	fmt.Println("Server running @http://localhost:8080")
	server.ListenAndServe()
}
