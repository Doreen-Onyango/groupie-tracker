package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Welcome to the gropie-tracker")

	server := &http.Server{
		Addr: ":8080",
	}

	fmt.Println("Server running @http://localhost:8080")
	server.ListenAndServe()
}
