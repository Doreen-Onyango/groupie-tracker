package models

import (
	"io"
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

func FetchData(urlpath string) ([]byte, error) {
	res, err := http.Get(urlpath)
	if err != nil {
		return nil, err
	}

	body, _ := io.ReadAll(res.Body)
	return body, nil
}
