package responses

import "encoding/json"

type JSONRes struct {
	Err     bool            `json:"error"`
	Message string          `json:"message"`
	Data    json.RawMessage `json:"data,omitempty"`
}

func NewJSONRes() *JSONRes {
	return &JSONRes{}
}

