package models

import (
	"encoding/json"
	"net/http"
)

type MainApi struct {
	artists   string
	locations string
	dates     string
	relations string
}

func NewMainApi() *MainApi {
	return &MainApi{
		"https://groupietrackers.herokuapp.com/api/artists",
		"https://groupietrackers.herokuapp.com/api/locations",
		"https://groupietrackers.herokuapp.com/api/dates",
		"https://groupietrackers.herokuapp.com/api/relation",
	}
}

func FetchData(urlpath string) (interface{}, error) {
	res, err := http.Get(urlpath)
	if err != nil {
		return nil, err
	}

	resbody, _ := json.Marshal(res)
	return resbody, nil
}
