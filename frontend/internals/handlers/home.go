package handlers

import (
	"net/http"
)

func (h *Repo) HomeHandler(w http.ResponseWriter, r *http.Request) {
	h.res.RenderTemplate("home.page.html", http.StatusOK, w)
}

func (h *Repo) AboutHandler(w http.ResponseWriter, r *http.Request) {
	h.res.RenderTemplate("about.page.html", http.StatusOK, w)
}
