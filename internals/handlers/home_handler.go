package handlers

import (
	"html/template"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("../../static/index.html")
	if err != nil {
		http.Error(w, "Opps! Something went wrong", http.StatusInternalServerError)
		return
	}

	tmpl.Execute(w, nil)
}
