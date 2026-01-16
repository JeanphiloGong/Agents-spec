package logging

import (
	"log/slog"
	"os"
	"strings"
)

type Config struct {
	Service string
	Env     string
	Level   slog.Level
}

func New(cfg Config) *slog.Logger {
	opts := &slog.HandlerOptions{Level: cfg.Level}
	h := slog.NewJSONHandler(os.Stdout, opts)
	return slog.New(h).With(
		"service", cfg.Service,
		"env", cfg.Env,
	)
}

func ParseLevel(raw string, fallback slog.Level) slog.Level {
	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "debug":
		return slog.LevelDebug
	case "warn", "warning":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return fallback
	}
}
