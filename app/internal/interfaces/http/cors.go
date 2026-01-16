package httpapi

import "net/http"

type CORSConfig struct {
	AllowOrigin  string
	AllowMethods string
	AllowHeaders string
}

func WithCORS(next http.Handler, cfg CORSConfig) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", cfg.AllowOrigin)
		w.Header().Set("Access-Control-Allow-Methods", cfg.AllowMethods)
		w.Header().Set("Access-Control-Allow-Headers", cfg.AllowHeaders)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
