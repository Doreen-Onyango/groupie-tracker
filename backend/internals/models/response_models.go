package models

import (
	"encoding/json"
	"fmt"
	"sync"
)

type ResponseData struct {
	Artists   map[int]Artist
	Locations map[int]Locations `json:"locations"`
	Concerts  map[int]Concerts  `json:"concertDates"`
	Relations map[int]Relations `json:"relations"`
	mu        sync.RWMutex
}

func NewResponseData() *ResponseData {
	return &ResponseData{
		res:  make(map[string]string),
		keys: []string{"artists", "locations", "dates", "relation"},
	}
}

func (r *ResponseData) GetData(key string) (string, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	val, ok := r.res[key]
	if !ok {
		return "", fmt.Errorf("wrong response key")
	}

	return val, nil
}

func (r *ResponseData) SetData(api *MainApi) error {
	var wg sync.WaitGroup
	var errMu sync.Mutex
	var err error

	done := make(chan struct{})

	for _, k := range r.keys {
		wg.Add(1)

		// goroutine
		go func(key string) {
			defer wg.Done()

			val, er := api.FetchData(key)
			if er != nil {
				errMu.Lock()
				if err == nil {
					err = er
				}
				errMu.Unlock()
				return
			}

			r.mu.Lock()
			r.res[key] = string(val)
			r.mu.Unlock()
		}(k)
	}

	go func() {
		wg.Wait()
		close(done)
	}()

	<-done

	if err != nil {
		instance.Err = err
		return fmt.Errorf("oops something went wrong: %v", err)
	}
	return nil
}

func (r *ResponseData) GetArtistData(api *MainApi) error {
	data, err := api.fetchData("artists")
	if err != nil {
		return fmt.Errorf("failed to fetch data: %w", err)
	}

	var artists []Artist

	if err := json.Unmarshal(data, &artists); err != nil {
		return fmt.Errorf("failed to unmarshal: %w", err)
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for _, arts := range artists {
		r.Artist[arts.ID] = arts
	}

	go r.SetData(api)
	allArtists <- struct{}{}
	return nil
}
