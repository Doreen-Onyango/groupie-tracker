package responses

import (
	"encoding/json"
	"errors"
	"net/http"
)

func (m *JSONRes) ReadJSON(w http.ResponseWriter, r *http.Request, data any) error {
	if r.Header.Get("Content-Type") != "application/json" {
		return errors.New("wrong request format")
	}

	maxBytes := 1048576 // 1024mb
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))
	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(data); err != nil {
		return errors.New("wrong request format")
	}

	if err := dec.Decode(&struct{}{}); err != nil {
		return errors.New("wrong request format")
	}
	return nil
}
