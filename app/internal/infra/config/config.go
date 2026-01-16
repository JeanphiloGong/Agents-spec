package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server ServerConfig `yaml:"server"`
	Log    LogConfig    `yaml:"log"`
	Index  IndexConfig  `yaml:"index"`
}

type ServerConfig struct {
	Addr string `yaml:"addr"`
}

type LogConfig struct {
	Service string `yaml:"service"`
	Env     string `yaml:"env"`
	Level   string `yaml:"level"`
}

type IndexConfig struct {
	RootPath   string `yaml:"root_path"`
	ScanGlob   string `yaml:"scan_glob"`
	ExcerptLen int    `yaml:"excerpt_len"`
	MaxResults int    `yaml:"max_results"`
	CacheTTL   int    `yaml:"cache_ttl_seconds"`
}

// Load reads YAML config from disk; callers decide on defaults and env overrides.
func Load(path string) (Config, error) {
	var cfg Config
	data, err := os.ReadFile(path)
	if err != nil {
		return cfg, fmt.Errorf("read config: %w", err)
	}
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return cfg, fmt.Errorf("parse config: %w", err)
	}
	return cfg, nil
}
