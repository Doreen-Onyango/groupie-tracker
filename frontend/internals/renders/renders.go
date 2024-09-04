package renders

import (
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/models"
)

type Renders struct {
	app *models.App
}

func NewRenders(app *models.App) *Renders {
	return &Renders{app: app}
}
