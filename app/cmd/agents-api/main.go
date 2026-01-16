package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"agents-app/internal/app/adapters/fs"
	"agents-app/internal/app/usecases/search"
	"agents-app/internal/infra/config"
	httpapi "agents-app/internal/interfaces/http"
)

func main() {
	configPath := os.Getenv("AGENTS_CONFIG")
	if configPath == "" {
		// Default to repo-local config for dev runs; override in prod via env.
		configPath = "configs/config.yaml"
	}
	cfg, err := config.Load(configPath)
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	indexer := &fs.Indexer{
		RootPath:   cfg.Index.RootPath,
		ScanGlob:   cfg.Index.ScanGlob,
		ExcerptLen: cfg.Index.ExcerptLen,
		MaxResults: cfg.Index.MaxResults,
	}
	// Cache reduces repeated disk walks for hot endpoints.
	cached := search.NewCachedIndexer(indexer, time.Duration(cfg.Index.CacheTTL)*time.Second)
	searchSvc := search.New(cached)

	handler := httpapi.NewHandler(searchSvc, cached, cfg.Index.RootPath)
	router := handler.Router()

	cors := httpapi.CORSConfig{
		AllowOrigin:  "*",
		AllowMethods: "GET,OPTIONS",
		AllowHeaders: "Content-Type,Authorization",
	}

	srv := &http.Server{
		Addr:              cfg.Server.Addr,
		Handler:           httpapi.WithCORS(router, cors),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      20 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Printf("listening on %s", cfg.Server.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// Graceful shutdown to finish in-flight requests.
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("shutdown error: %v", err)
	}
}
