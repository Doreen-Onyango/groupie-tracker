package handlers

import (
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker/pkg/helpers"
)

func GetData(w http.ResponseWriter, r *http.Request) {
	models.NewMainApi()
	res, _ := models.FetchData("https://groupietrackers.herokuapp.com/api/artists")

	var dataInfo interface{}
	_ = json.Unmarshal(res, &dataInfo)

	tmplPath := helpers.Getprojectroute("static/data.html")

	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		http.Error(w, "Opps! Something went wrong", http.StatusInternalServerError)
		return
	}

	data := struct {
		Title   string
		Artists interface{}
	}{
		Title:   "artists",
		Artists: dataInfo,
	}

	tmpl.Execute(w, data)
}
