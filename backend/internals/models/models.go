package models

import (
	"encoding/json"
	"fmt"
	"sync"
)

type MainApi struct {
	baseUrl string
}

func NewMainApi() *MainApi {
	return &MainApi{"https://groupietrackers.herokuapp.com/api/"}
}

type Concerts struct {
	ID           string   `json:"id"`
	ConcertDates []string `json:"dates"`
}

// handle various types for the ID and process concert dates, allowing for flexible and robust data handling
func (c *Concerts) UnmarshalJSON(data []byte) error {
	var aux struct {
		ID           interface{} `json:"id"`
		ConcertDates []string    `json:"dates"`
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	switch id := aux.ID.(type) {
	case float64:
		c.ID = fmt.Sprintf("%.0f", id)
	case string:
		c.ID = id
	default:
		return fmt.Errorf("unexpected type %v", aux.ID)
	}

	c.ConcertDates = make([]string, len(aux.ConcertDates))
	for i, date := range aux.ConcertDates {
		if len(date) > 0 && date[0] == '*' {
			c.ConcertDates[i] = date[1:]
		} else {
			c.ConcertDates[i] = date
		}
	}

	return nil
}

type Relation struct {
	ID             int                 `json:"id"`
	DatesLocations map[string][]string `json:"datesLocations"`
}

// handle various types for the ID and process relations, allowing for flexible and robust data handling
func (r *Relation) UnmarshalJSON(data []byte) error {
	var aux struct {
		ID             interface{}         `json:"id"`
		DatesLocations map[string][]string `json:"datesLocations"`
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	switch id := aux.ID.(type) {
	case float64:
		r.ID = int(id)
	case int:
		r.ID = id
	default:
		return fmt.Errorf("unexpected type for id: %T", aux.ID)
	}

	r.DatesLocations = aux.DatesLocations

	return nil
}

type Locations struct {
	ID        string   `json:"id"`
	Locations []string `json:"locations"`
	Dates     string   `json:"dates"`
}

// handle various types for the ID and process locations allowing for flexible and robust data handling
func (l *Locations) UnmarshalJSON(data []byte) error {
	var aux struct {
		ID        interface{} `json:"id"`
		Locations []string    `json:"locations"`
		Dates     string      `json:"dates"`
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	switch id := aux.ID.(type) {
	case float64:
		l.ID = fmt.Sprintf("%.0f", id)
	case string:
		l.ID = id
	default:
		return fmt.Errorf("unexpected type  %v", aux.ID)
	}

	l.Locations = aux.Locations
	l.Dates = aux.Dates

	return nil
}

type Artist struct {
	ID           string   `json:"id"`
	Image        string   `json:"image"`
	Name         string   `json:"name"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	Locations    string   `json:"locations"`
	ConcertDates string   `json:"concertDates"`
	Relations    string   `json:"relations"`
}

// It allows flexible handling of the "ID" field, which can be either a string or a number.
func (a *Artist) UnmarshalJSON(data []byte) error {
	var aux struct {
		ID           interface{} `json:"id"`
		Image        string      `json:"image"`
		Name         string      `json:"name"`
		Members      []string    `json:"members"`
		CreationDate int         `json:"creationDate"`
		FirstAlbum   string      `json:"firstAlbum"`
		Locations    string      `json:"locations"`
		ConcertDates string      `json:"concertDates"`
		Relations    string      `json:"relations"`
	}

	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}

	switch id := aux.ID.(type) {
	case float64:
		a.ID = fmt.Sprintf("%.0f", id)
	case string:
		a.ID = id
	default:
		return fmt.Errorf("unexpected type %v", aux.ID)
	}

	a.Image = aux.Image
	a.Name = aux.Name
	a.Members = aux.Members
	a.CreationDate = aux.CreationDate
	a.FirstAlbum = aux.FirstAlbum
	a.Locations = aux.Locations
	a.ConcertDates = aux.ConcertDates
	a.Relations = aux.Relations

	return nil
}

type ResponseData struct {
	Artists   map[string]Artist
	Locations map[string]Locations `json:"locations"`
	Concerts  map[string]Concerts  `json:"concertDates"`
	Relations map[string]Relation  `json:"relations"`
	mu        sync.RWMutex
}

// efficient data storage and retrieval for an application that likely deals with artists
func NewResponseData() *ResponseData {
	return &ResponseData{
		Artists:   make(map[string]Artist),
		Locations: make(map[string]Locations),
		Concerts:  make(map[string]Concerts),
		Relations: make(map[string]Relation),
	}
}
