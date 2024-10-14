package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"strings"

	"github.com/Doreen-Onyango/groupie-tracker-api/internals/models"
	"github.com/Doreen-Onyango/groupie-tracker-api/internals/responses"
)

func TestRepo_GetAllArtists(t *testing.T) {
	type fields struct {
		app *models.App
		res *responses.JSONRes
	}
	type args struct {
		w http.ResponseWriter
		r *http.Request
	}
	tests := []struct {
		name       string
		fields     fields
		args       args
		wantStatus int
		wantBody   string
	}{
		{
			name: "Invalid method",
			fields: fields{
				app: &models.App{},
				res: &responses.JSONRes{},
			},
			args: args{
				w: httptest.NewRecorder(),
				r: httptest.NewRequest("POST", "/artists", nil),
			},
			wantStatus: http.StatusMethodNotAllowed,
			wantBody:   `{"error":"Method not allowed"}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := &Repo{
				app: tt.fields.app,
				res: tt.fields.res,
			}

			// Call the handler
			m.GetAllArtists(tt.args.w, tt.args.r)

			// Get the response recorder
			rr := tt.args.w.(*httptest.ResponseRecorder)

			// Check the status code
			if status := rr.Code; status != tt.wantStatus {
				t.Errorf("GetAllArtists() status code = %v, want %v", status, tt.wantStatus)
			}

			// Check the response body by trimming whitespaces
			if strings.TrimSpace(rr.Body.String()) != strings.TrimSpace(tt.wantBody) {
				t.Errorf("GetAllArtists() body = %v, want %v", rr.Body.String(), tt.wantBody)
			}
		})
	}
}
