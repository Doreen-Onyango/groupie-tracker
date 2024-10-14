package apis

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
)

func TestApis_ApiRoutes(t *testing.T) {
	type fields struct {
		repo *handlers.Repo
	}
	tests := []struct {
		name   string
		fields fields
		want   string
	}{
		{
			name: "Nil repo should return default handler",
			fields: fields{
				repo: nil,
			},
			want: "Default handler response",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := &Apis{
				repo: tt.fields.repo,
			}

			handler := m.ApiRoutes()

			// Simulate a request
			req := httptest.NewRequest("POST", "/", nil)
			rr := httptest.NewRecorder()

			// Serve the request using the handler
			handler.ServeHTTP(rr, req)

			// Check if the response body matches the expected body
			if rr.Body.String() != tt.want {
				t.Errorf("Apis.ApiRoutes() response body = %v, want %v", rr.Body.String(), tt.want)
			}

			// Check if the status code is 200 OK (assuming that for defaultHandler it's 200)
			if rr.Code != http.StatusOK {
				t.Errorf("Apis.ApiRoutes() status code = %v, want %v", rr.Code, http.StatusOK)
			}
		})
	}
}
