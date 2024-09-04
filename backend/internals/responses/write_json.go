package responses

import (
	"encoding/json"
	"net/http"
)

func (m *JSONRes) WriteJSON(w http.ResponseWriter, payload JSONRes, status int, headers ...http.Header) error {
	out, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	if len(headers) > 0 {
		for key, val := range headers[0] {
			w.Header()[key] = val
		}
	}

	if _, err = w.Write(out); err != nil {
		return err
	}

	return err
}
