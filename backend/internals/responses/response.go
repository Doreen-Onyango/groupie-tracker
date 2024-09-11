package responses

import (
	"encoding/json"
	"errors"
	"net/http"
)

type JSONRes struct {
	Err     bool            `json:"error"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data,omitempty"` // allows use of raw json data message directly and omit
}

func NewJSONRes() *JSONRes {
	return &JSONRes{}
}

func (m *JSONRes) ErrJSON(w http.ResponseWriter, err error, status ...int) error {
	statuscode := http.StatusBadRequest
	if len(status) > 0 {
		statuscode = status[0]
	}

	m.Err = true
	m.Data = nil
	if err != nil {
		m.Message = err.Error()
	}

	return m.WriteJSON(w, *m, statuscode)
}

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

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if _, err = w.Write(out); err != nil {
		return err
	}

	return err
}
