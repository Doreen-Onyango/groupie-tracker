package handlers

import (
	"net/http"
)

// HomeHandler handles requests to the home page
func (h *Repo) HomeHandler(w http.ResponseWriter, r *http.Request) {
	h.res.RenderTemplate("home.page.html", http.StatusOK, w)
}

// AoutHandler handles requests to the about page
func (h *Repo) AboutHandler(w http.ResponseWriter, r *http.Request) {
	h.res.RenderTemplate("about.page.html", http.StatusOK, w)
}

// NotFoundHandler handles requests to the 404 page
func (h *Repo) NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	h.res.RenderTemplate("404.page.html", http.StatusNotFound, w)
}

// BadRequestHandler handles requests to the 404 page
func (h *Repo) ForbiddenHandler(w http.ResponseWriter, r *http.Request) {
	h.res.RenderTemplate("403.page.html", http.StatusForbidden, w)
}
