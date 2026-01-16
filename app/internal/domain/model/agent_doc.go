package model

import "time"

type AgentDoc struct {
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
