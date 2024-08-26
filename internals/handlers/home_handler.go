package handlers

import (
	"html/template"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker/pkg/helpers"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	tmplPath := helpers.Getprojectroute("static/index.html")

	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Opps! Something went wrong", http.StatusInternalServerError)
		return
	}

	tmpl.Execute(w, nil)
}
