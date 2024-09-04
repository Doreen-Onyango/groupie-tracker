package responses

import "net/http"

func (m *JSONRes) ErrJSON(w http.ResponseWriter, err error, status ...int) error {
	statuscode := http.StatusBadRequest
	if len(status) > 0 {
		statuscode = status[0]
	}

	m.Err = true
	m.Message = err.Error()
	m.Data = nil

	return m.WriteJSON(w, *m, statuscode)
}
