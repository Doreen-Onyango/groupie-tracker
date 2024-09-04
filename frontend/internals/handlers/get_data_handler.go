package handlers

import (
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker/pkg/helpers"
)

func (h *Repo) GetData(w http.ResponseWriter, r *http.Request) {
	res, _ := h.api.FetchData("artists")

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
