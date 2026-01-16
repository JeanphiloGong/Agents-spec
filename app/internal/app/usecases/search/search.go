package search

import (
	"context"
	"sort"
	"strings"

	"agents-app/internal/app/ports"
	"agents-app/internal/domain/model"
)

type Query struct {
	Text  string
	Dept  string
	Role  string
	Type  string
	Tags  []string
	Sort  string
	Page  int
	Size  int
	Limit int
}

type Result struct {
	Total int
	Items []model.AgentDoc
}

type Service struct {
	indexer ports.Indexer
}

// New keeps the use case independent from any concrete indexer.
func New(indexer ports.Indexer) *Service {
	return &Service{indexer: indexer}
}

func (s *Service) Search(ctx context.Context, q Query) (Result, error) {
	snapshot, err := s.indexer.BuildIndex(ctx)
	if err != nil {
		return Result{}, err
	}
	if q.Size <= 0 {
		q.Size = 20
	}
	if q.Page <= 0 {
		q.Page = 1
	}
	if q.Limit <= 0 {
		q.Limit = len(snapshot.Docs)
	}

	matches := make([]model.AgentDoc, 0, len(snapshot.Docs))
	for _, doc := range snapshot.Docs {
		// Filter first to keep text checks cheap.
		if !matchFilters(doc, q) {
			continue
		}
		if q.Text == "" || containsText(doc, q.Text) {
			matches = append(matches, doc)
		}
	}

	sortDocs(matches, q.Sort)

	start := (q.Page - 1) * q.Size
	if start > len(matches) {
		return Result{Total: len(matches), Items: []model.AgentDoc{}}, nil
	}
	end := start + q.Size
	if end > len(matches) {
		end = len(matches)
	}

	if q.Limit < end {
		end = q.Limit
		if start > end {
			return Result{Total: len(matches), Items: []model.AgentDoc{}}, nil
		}
	}

	return Result{Total: len(matches), Items: matches[start:end]}, nil
}

func (s *Service) GetByID(ctx context.Context, id string) (model.AgentDoc, error) {
	snapshot, err := s.indexer.BuildIndex(ctx)
	if err != nil {
		return model.AgentDoc{}, err
	}
	doc, ok := snapshot.ByID[id]
	if !ok {
		return model.AgentDoc{}, ports.ErrNotFound
	}
	return doc, nil
}

func matchFilters(doc model.AgentDoc, q Query) bool {
	if q.Dept != "" && doc.Dept != q.Dept {
		return false
	}
	if q.Role != "" && doc.Role != q.Role {
		return false
	}
	if q.Type != "" && doc.Type != q.Type {
		return false
	}
	if len(q.Tags) > 0 {
		tagSet := make(map[string]struct{}, len(doc.Tags))
		for _, t := range doc.Tags {
			tagSet[strings.ToLower(t)] = struct{}{}
		}
		for _, t := range q.Tags {
			if _, ok := tagSet[strings.ToLower(t)]; !ok {
				return false
			}
		}
	}
	return true
}

func containsText(doc model.AgentDoc, text string) bool {
	needle := strings.ToLower(text)
	if strings.Contains(strings.ToLower(doc.Title), needle) {
		return true
	}
	if strings.Contains(strings.ToLower(doc.Excerpt), needle) {
		return true
	}
	if strings.Contains(strings.ToLower(doc.Content), needle) {
		return true
	}
	for _, t := range doc.Tags {
		if strings.Contains(strings.ToLower(t), needle) {
			return true
		}
	}
	return false
}

func sortDocs(docs []model.AgentDoc, sortKey string) {
	switch sortKey {
	case "name":
		sort.Slice(docs, func(i, j int) bool {
			return strings.ToLower(docs[i].Title) < strings.ToLower(docs[j].Title)
		})
	default:
		sort.Slice(docs, func(i, j int) bool {
			return docs[i].UpdatedAt.After(docs[j].UpdatedAt)
		})
	}
}
