package fs

import (
	"bufio"
	"context"
	"crypto/sha1"
	"encoding/hex"
	"errors"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"agents-app/internal/app/ports"
	"agents-app/internal/domain/model"
	"gopkg.in/yaml.v3"
)

type Indexer struct {
	RootPath   string
	ScanGlob   string
	ExcerptLen int
	MaxResults int
	Logger     *slog.Logger
}

// errMaxResults stops traversal without treating it as a fatal error.
var errMaxResults = errors.New("max results reached")

type FrontMatter struct {
	Title string   `yaml:"title"`
	Dept  string   `yaml:"dept"`
	Role  string   `yaml:"role"`
	Type  string   `yaml:"type"`
	Tags  []string `yaml:"tags"`
}

func (i *Indexer) BuildIndex(ctx context.Context) (ports.IndexSnapshot, error) {
	docs := make([]model.AgentDoc, 0)
	byID := make(map[string]model.AgentDoc)
	byDept := make(map[string][]string)
	byRole := make(map[string][]string)
	byType := make(map[string][]string)
	byTag := make(map[string][]string)
	updatedAt := make(map[string]string)

	err := filepath.Walk(i.RootPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}
		if info.IsDir() {
			if shouldSkipDir(info.Name()) {
				// Skip heavy or generated directories to avoid slow scans.
				return filepath.SkipDir
			}
			return nil
		}
		if info.Name() != i.ScanGlob {
			return nil
		}

		doc, parseErr := parseFile(path, info, i)
		if parseErr != nil {
			// Skip unreadable or malformed docs; indexer remains best-effort.
			if i.Logger != nil {
				i.Logger.Warn("doc parse failed", "error", parseErr, "path", path)
			}
			return nil
		}
		docs = append(docs, doc)
		byID[doc.ID] = doc
		byDept[doc.Dept] = append(byDept[doc.Dept], doc.ID)
		byRole[doc.Role] = append(byRole[doc.Role], doc.ID)
		byType[doc.Type] = append(byType[doc.Type], doc.ID)
		for _, t := range doc.Tags {
			byTag[t] = append(byTag[t], doc.ID)
		}
		updatedAt[doc.ID] = doc.UpdatedAt.Format(time.RFC3339)
		if i.MaxResults > 0 && len(docs) >= i.MaxResults {
			return errMaxResults
		}
		return nil
	})
	if err != nil {
		if !errors.Is(err, filepath.SkipAll) && !errors.Is(err, errMaxResults) {
			if i.Logger != nil {
				i.Logger.Error("index walk failed", "error", err)
			}
			return ports.IndexSnapshot{}, err
		}
	}

	sort.Slice(docs, func(i, j int) bool {
		return docs[i].UpdatedAt.After(docs[j].UpdatedAt)
	})

	return ports.IndexSnapshot{
		Docs:      docs,
		ByID:      byID,
		ByDept:    byDept,
		ByRole:    byRole,
		ByType:    byType,
		ByTag:     byTag,
		UpdatedAt: updatedAt,
	}, nil
}

func shouldSkipDir(name string) bool {
	switch name {
	case ".git", "node_modules", ".svelte-kit", ".next", ".cache", "dist", "build", "vendor":
		return true
	default:
		return false
	}
}

func parseFile(path string, info os.FileInfo, cfg *Indexer) (model.AgentDoc, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return model.AgentDoc{}, err
	}
	front, body := parseFrontMatter(string(content))

	dept, role, docType := inferFromPath(path)
	if front.Dept != "" {
		dept = front.Dept
	}
	if front.Role != "" {
		role = front.Role
	}
	if front.Type != "" {
		docType = front.Type
	}
	if front.Title == "" {
		front.Title = deriveTitle(body, path)
	}

	id := buildID(path)
	excerpt := buildExcerpt(body, cfg.ExcerptLen)

	tags := front.Tags
	if len(tags) == 0 {
		tags = inferTagsFromPath(path)
	}

	return model.AgentDoc{
		ID:        id,
		Title:     front.Title,
		Path:      path,
		Dept:      dept,
		Role:      role,
		Type:      docType,
		Tags:      tags,
		UpdatedAt: info.ModTime(),
		Excerpt:   excerpt,
		Content:   body,
	}, nil
}

func parseFrontMatter(content string) (FrontMatter, string) {
	content = strings.TrimSpace(content)
	if !strings.HasPrefix(content, "---") {
		return FrontMatter{}, content
	}
	parts := strings.SplitN(content, "---", 3)
	if len(parts) < 3 {
		return FrontMatter{}, content
	}
	frontRaw := strings.TrimSpace(parts[1])
	body := strings.TrimSpace(parts[2])

	front := FrontMatter{}
	if err := yaml.Unmarshal([]byte(frontRaw), &front); err != nil {
		// Fall back to path-derived metadata if YAML is invalid.
		return FrontMatter{}, content
	}
	return front, body
}

func deriveTitle(body string, path string) string {
	scanner := bufio.NewScanner(strings.NewReader(body))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if strings.HasPrefix(line, "#") {
			return strings.TrimSpace(strings.TrimPrefix(line, "#"))
		}
	}
	return filepath.Base(filepath.Dir(path))
}

func buildExcerpt(body string, limit int) string {
	trimmed := strings.TrimSpace(body)
	if limit <= 0 || len(trimmed) <= limit {
		return trimmed
	}
	runes := []rune(trimmed)
	if len(runes) <= limit {
		return trimmed
	}
	return string(runes[:limit]) + "..."
}

func inferFromPath(path string) (string, string, string) {
	parts := strings.Split(filepath.ToSlash(path), "/")
	dept := "unknown"
	role := "unknown"
	docType := "spec"
	for idx, p := range parts {
		if p == "agent-specs" && idx+1 < len(parts) {
			dept = parts[idx+1]
			if idx+2 < len(parts) {
				role = parts[idx+2]
			}
		}
		if p == "tutorial" {
			docType = "tutorial"
		}
	}
	if strings.Contains(path, "template") {
		docType = "template"
	}
	return dept, role, docType
}

func inferTagsFromPath(path string) []string {
	parts := strings.Split(filepath.ToSlash(path), "/")
	tags := make([]string, 0, 6)
	for _, p := range parts {
		if p == "" || p == "agent-specs" || p == "AGENTS.md" {
			continue
		}
		if strings.HasSuffix(p, ".md") {
			continue
		}
		tags = append(tags, p)
	}
	return uniqueLower(tags)
}

func uniqueLower(items []string) []string {
	set := make(map[string]struct{}, len(items))
	result := make([]string, 0, len(items))
	for _, item := range items {
		v := strings.ToLower(item)
		if _, ok := set[v]; ok {
			continue
		}
		set[v] = struct{}{}
		result = append(result, v)
	}
	return result
}

func buildID(path string) string {
	// Path-based hash keeps IDs stable across content edits.
	h := sha1.Sum([]byte(path))
	return hex.EncodeToString(h[:])
}
