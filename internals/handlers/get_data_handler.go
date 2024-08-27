package handlers

import (
	"html/template"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker/pkg/helpers"
)

func GetData(w http.ResponseWriter, r *http.Request) {
	models.NewMainApi()
	data, _ := models.FetchData("https://groupietrackers.herokuapp.com/api/artists")
	// fmt.Println(data)

	tmplPath := helpers.Getprojectroute("static/data.html")

	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Opps! Something went wrong", http.StatusInternalServerError)
		return
	}

	tmpl.Execute(w, data)
}
