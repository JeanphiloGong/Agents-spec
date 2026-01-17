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

func (s *Service) Tags(ctx context.Context) (map[string]int, error) {
	snapshot, err := s.indexer.BuildIndex(ctx)
	if err != nil {
		return nil, err
	}
	counts := make(map[string]int, len(snapshot.ByTag))
	for tag, ids := range snapshot.ByTag {
		counts[tag] = len(ids)
	}
	return counts, nil
}

func (s *Service) Suggestions(ctx context.Context, raw string, limit int) ([]string, []string, error) {
	q := strings.TrimSpace(raw)
	if q == "" {
		return []string{}, []string{}, nil
	}
	snapshot, err := s.indexer.BuildIndex(ctx)
	if err != nil {
		return nil, nil, err
	}
	needle := strings.ToLower(q)
	titleSet := map[string]struct{}{}
	tagSet := map[string]struct{}{}
	for _, doc := range snapshot.Docs {
		if strings.Contains(strings.ToLower(doc.Title), needle) {
			titleSet[doc.Title] = struct{}{}
		}
		for _, tag := range doc.Tags {
			if strings.Contains(strings.ToLower(tag), needle) {
				tagSet[tag] = struct{}{}
			}
		}
	}
	titles := setToSortedSlice(titleSet, limit)
	tags := setToSortedSlice(tagSet, limit)
	return titles, tags, nil
}

func (s *Service) Related(ctx context.Context, id string, limit int) ([]model.AgentDoc, error) {
	snapshot, err := s.indexer.BuildIndex(ctx)
	if err != nil {
		return nil, err
	}
	doc, ok := snapshot.ByID[id]
	if !ok {
		return nil, ports.ErrNotFound
	}
	tagSet := make(map[string]struct{}, len(doc.Tags))
	for _, t := range doc.Tags {
		tagSet[t] = struct{}{}
	}
	related := make([]model.AgentDoc, 0, limit)
	seen := map[string]struct{}{doc.ID: {}}
	for _, candidate := range snapshot.Docs {
		if _, ok := seen[candidate.ID]; ok {
			continue
		}
		if candidate.Dept == doc.Dept || shareTag(candidate.Tags, tagSet) {
			seen[candidate.ID] = struct{}{}
			related = append(related, candidate)
		}
		if limit > 0 && len(related) >= limit {
			break
		}
	}
	return related, nil
}

func (s *Service) Stats(ctx context.Context, limit int) (int, []model.AgentDoc, error) {
	snapshot, err := s.indexer.BuildIndex(ctx)
	if err != nil {
		return 0, nil, err
	}
	total := len(snapshot.Docs)
	recent := snapshot.Docs
	if limit > 0 && len(recent) > limit {
		recent = recent[:limit]
	}
	out := make([]model.AgentDoc, len(recent))
	copy(out, recent)
	return total, out, nil
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

func setToSortedSlice(items map[string]struct{}, limit int) []string {
	out := make([]string, 0, len(items))
	for v := range items {
		out = append(out, v)
	}
	sort.Strings(out)
	if limit > 0 && len(out) > limit {
		out = out[:limit]
	}
	return out
}

func shareTag(tags []string, target map[string]struct{}) bool {
	for _, t := range tags {
		if _, ok := target[t]; ok {
			return true
		}
	}
	return false
}
