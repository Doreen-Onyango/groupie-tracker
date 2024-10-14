package apis

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/handlers"
)

// func TestApis_ApiRoutes(t *testing.T) {
// 	type fields struct {
// 		repo *handlers.Repo
// 	}
// 	tests := []struct {
// 		name   string
// 		fields fields
// 		want   http.Handler
// 	}{
// 		{
// 			name: "Nil repo should return default handler",
// 			fields: fields{
// 				repo: nil,
// 			},
// 			want: defaultHandler(),
// 		}, // TODO: Add test cases.
// 	}
// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			m := &Apis{
// 				repo: tt.fields.repo,
// 			}
// 			if got := m.ApiRoutes(); !reflect.DeepEqual(got, tt.want) {
// 				t.Errorf("Apis.ApiRoutes() = %v, want %v", got, tt.want)
// 			}
// 		})
// 	}
// }

func TestApis_ApiRoutes(t *testing.T) {
	type fields struct {
		repo *handlers.Repo
	}
	tests := []struct {
		name   string
		fields fields
		want   string // Expect a specific response body, not the handler itself
	}{
		{
			name: "Nil repo should return default handler",
			fields: fields{
				repo: nil, // Simulate repo being nil
			},
			want: "Default handler response", // Expect the response from defaultHandler
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := &Apis{
				repo: tt.fields.repo,
			}

			// Get the handler from ApiRoutes
			handler := m.ApiRoutes()

			// Simulate a request
			req := httptest.NewRequest("GET", "/", nil)
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
