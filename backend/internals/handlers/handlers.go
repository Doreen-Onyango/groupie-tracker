package handlers

import (
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/responses"
)

type Repo struct {
	app *models.App
	res *responses.JSONRes
}

func NewRepo(app *models.App, res *responses.JSONRes) *Repo {
	return &Repo{app, res}
}
