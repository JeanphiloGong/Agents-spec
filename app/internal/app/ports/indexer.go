package ports

import (
	"context"

	"agents-app/internal/domain/model"
)

type Indexer interface {
	BuildIndex(ctx context.Context) (IndexSnapshot, error)
}

type IndexSnapshot struct {
	Docs      []model.AgentDoc
	ByID      map[string]model.AgentDoc
	ByDept    map[string][]string
	ByRole    map[string][]string
	ByType    map[string][]string
	ByTag     map[string][]string
	UpdatedAt map[string]string
}
