package main

import (
	"fmt"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the gropie-tracker")
}

func main() {
	http.HandleFunc("/", HomeHandler)

	server := &http.Server{
		Addr: ":8080",
	}

	fmt.Println("Server running @http://localhost:8080")
	server.ListenAndServe()
}
