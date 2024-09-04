package models

import (
	"fmt"
	"sync"
)

type ResponseData struct {
	res  map[string]string
	keys []string
	mu   sync.RWMutex
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
