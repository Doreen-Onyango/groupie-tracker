package routers

import (
	"net/http"
	"strings"

	"github.com/Doreen-Onyango/groupie-tracker-client/internals/handlers"
	"github.com/Doreen-Onyango/groupie-tracker-client/internals/models"
)

// initialize the rooutes struct
type Routes struct {
	app  *models.App
	repo *handlers.Repo
}

// NewRoutes creates a new Routes instance with the given handlers.
func NewRoutes(repo *handlers.Repo) *Routes {
	return &Routes{
		repo: repo,
		app:  models.GetApp(),
	}
}

// RegisterRoutes registers the routes for the application.
func (r *Routes) RegisterRoutes(mux *http.ServeMux) *http.ServeMux {
	staticDir := r.app.TemplateData.GetProjectRoute("views/static")
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))

	mux.HandleFunc("/", r.repo.HomeHandler)
	mux.HandleFunc("/about", r.repo.AboutHandler)

	return mux
}

// Allowed routes
var allowedRoutes = map[string]bool{
	"/":      true,
	"/about": true,
}

// RouteChecker is a middleware that checks allowed routes
func (r *Routes) RouteChecker(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
        if strings.HasPrefix(req.URL.Path, "/static/") {
            referer := req.Header.Get("Referer")

            if !isValidReferer(referer) {
				r.repo.ForbiddenHandler(w, req)
                return
            }
            next.ServeHTTP(w, req)
            return
        }


        if _, ok := allowedRoutes[req.URL.Path]; !ok {
            r.repo.NotFoundHandler(w, req)
            return
        }

        next.ServeHTTP(w, req)
    })
}

// Check if the referer is from your own site
func isValidReferer(referer string) bool {
    if referer == "" {
        return false
    }
    return strings.Contains(referer, "localhost:8080")
}
