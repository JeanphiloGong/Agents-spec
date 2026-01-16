package model

import "time"

type AgentDoc struct {
	// ID is a stable hash of the file path used for lookup and downloads.
	ID        string
	Title     string
	Path      string
	Dept      string
	Role      string
	Type      string
	Tags      []string
	UpdatedAt time.Time
	Excerpt   string
	Content   string
}
