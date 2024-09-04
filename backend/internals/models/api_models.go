package models

import (
	"io"
	"net/http"
)

type MainApi struct {
	apiMap map[string]string
}

func NewMainApi() *MainApi {
	apiMap := map[string]string{
		"artists":   "https://groupietrackers.herokuapp.com/api/artists",
		"locations": "https://groupietrackers.herokuapp.com/api/locations",
		"dates":     "https://groupietrackers.herokuapp.com/api/dates",
		"relation":  "https://groupietrackers.herokuapp.com/api/relation",
	}
	return &MainApi{apiMap}
}

func (a *MainApi) FetchData(apitype string) ([]byte, error) {
	res, err := http.Get(a.apiMap[apitype])
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)
	return body, nil
}
