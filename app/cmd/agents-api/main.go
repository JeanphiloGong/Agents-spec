package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"agents-app/internal/app/adapters/fs"
	"agents-app/internal/app/usecases/search"
	"agents-app/internal/infra/config"
	"agents-app/internal/infra/logging"
	httpapi "agents-app/internal/interfaces/http"
)

func main() {
	if err := run(); err != nil {
		os.Exit(1)
	}
}

func run() error {
	fallback := slog.New(slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{Level: slog.LevelError}))
	configPath := os.Getenv("AGENTS_CONFIG")
	if configPath == "" {
		// Default to repo-local config for dev runs; override in prod via env.
		configPath = "configs/config.yaml"
	}
	cfg, err := config.Load(configPath)
	if err != nil {
		fallback.Error("config error", "error", err, "error.type", fmt.Sprintf("%T", err), "error.msg", err.Error())
		return fmt.Errorf("load config: %w", err)
	}

	logger := logging.New(logging.Config{
		Service: cfg.Log.Service,
		Env:     cfg.Log.Env,
		Level:   logging.ParseLevel(cfg.Log.Level, slog.LevelInfo),
	})

	indexer := &fs.Indexer{
		RootPath:   cfg.Index.RootPath,
		ScanGlob:   cfg.Index.ScanGlob,
		ExcerptLen: cfg.Index.ExcerptLen,
		MaxResults: cfg.Index.MaxResults,
		Logger:     logger,
	}
	// Cache reduces repeated disk walks for hot endpoints.
	cached := search.NewCachedIndexer(indexer, time.Duration(cfg.Index.CacheTTL)*time.Second)
	searchSvc := search.New(cached)

	handler := httpapi.NewHandler(searchSvc, cfg.Index.RootPath, cfg.Index.MaxResults, logger)
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

	errCh := make(chan error, 1)
	go func() {
		logger.Info("server listening", "addr", cfg.Server.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	defer signal.Stop(stop)

	select {
	case <-stop:
	case err := <-errCh:
		logger.Error("server error", "error", err, "error.type", fmt.Sprintf("%T", err), "error.msg", err.Error())
		return fmt.Errorf("server error: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// Graceful shutdown to finish in-flight requests.
	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("shutdown error", "error", err, "error.type", fmt.Sprintf("%T", err), "error.msg", err.Error())
	}
	return nil
}
