package middlewares

import (
	"net/http"
)

// Setting access controls for the project.
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

var allowedRoutes = map[string]bool{
	"/api/getallartists":  true,
	"/api/getartistbyid":  true,
	"/api/getcoordinates": true,
}

// RouteChecker is a middleware that checks allowed routes
func RouteChecker(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if _, ok := allowedRoutes[req.URL.Path]; !ok {
			http.Redirect(w, req, "http://localhost:8080/not-allowed", http.StatusFound)
			return
		}

		next.ServeHTTP(w, req)
	})
}
