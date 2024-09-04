package handlers

import (
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/renders"
)

type Repo struct {
	app *models.App
	res *renders.Renders
}

func NewRepo(app *models.App, res *renders.Renders) *Repo {
	return &Repo{app: app, res: res}
}
