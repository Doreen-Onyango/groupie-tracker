package handlers

import (
	"github.com/Doreen-Onyango/groupie-tracker-client-client/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-client-client/internals/renders"
)

type Repo struct {
	app *models.ModelState
	res *renders.Renders
}

func NewRepo(app *models.ModelState, res *renders.Renders) *Repo {
	return &Repo{app: app, res: res}
}
