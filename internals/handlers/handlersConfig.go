package handlers

import "github.com/Doreen-Onyango/groupie-tracker/internals/models"

type Repo struct {
	api *models.MainApi
}

func NewRepo(apis *models.MainApi) *Repo {
	return &Repo{apis}
}
