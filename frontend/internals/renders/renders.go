package renders

import (
	"fmt"
	"net/http"

	"github.com/Doreen-Onyango/groupie-tracker-client/internals/models"
)

type Renders struct {
	app *models.App
}

func NewRenders(app *models.App) *Renders {
	return &Renders{app: app}
}

// RenderTemplate renders the HTML template specified by `page`
func (r *Renders) RenderTemplate(page string, status int, w http.ResponseWriter) error {
	tmpl, err := r.app.TemplateData.GetTemplate(page)
	if err != nil {
		return fmt.Errorf("error parsing project template: %w", err)
	}

	w.WriteHeader(status)
	err = tmpl.Execute(w, nil)
	if err != nil {
		return fmt.Errorf("error executing template: %w", err)
	}

	return nil
}
