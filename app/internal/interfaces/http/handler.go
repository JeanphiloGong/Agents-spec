package httpapi

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"agents-app/internal/app/ports"
	"agents-app/internal/app/usecases/search"
	"agents-app/internal/domain/model"
	"github.com/go-chi/chi/v5"
	"sort"
)

type Handler struct {
	search   *search.Service
	indexer  ports.Indexer
	rootPath string
	logger   *slog.Logger
}

// NewHandler wires HTTP endpoints to use cases and index ports.
func NewHandler(searchSvc *search.Service, indexer ports.Indexer, rootPath string, logger *slog.Logger) *Handler {
	return &Handler{search: searchSvc, indexer: indexer, rootPath: rootPath, logger: logger}
}

// Router returns the HTTP routes; adapters stay outside the use case layer.
func (h *Handler) Router() http.Handler {
	r := chi.NewRouter()
	r.Use(h.requestLogger)
	r.Get("/api/health", h.handleHealth)
	r.Get("/api/docs", h.handleDocs)
	r.Get("/api/docs/{id}", h.handleDocByID)
	r.Get("/api/docs/{id}/download", h.handleDownload)
	r.Get("/api/suggestions", h.handleSuggestions)
	r.Get("/api/related", h.handleRelated)
	r.Get("/api/tags", h.handleTags)
	r.Get("/api/stats", h.handleStats)
	return r
}

func (h *Handler) requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		ctx := r.Context()
		requestID := r.Header.Get("X-Request-Id")
		if requestID != "" {
			ctx = withRequestID(ctx, requestID)
		}
		rw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rw, r.WithContext(ctx))
		h.logger.Info(
			"request completed",
			"method", r.Method,
			"path", r.URL.Path,
			"status", rw.status,
			"duration_ms", time.Since(start).Milliseconds(),
			"request_id", requestID,
		)
	})
}

func (h *Handler) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) handleDocs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	query := search.Query{
		Text:  q.Get("q"),
		Dept:  q.Get("dept"),
		Role:  q.Get("role"),
		Type:  q.Get("type"),
		Sort:  q.Get("sort"),
		Page:  parseInt(q.Get("page"), 1),
		Size:  parseInt(q.Get("size"), 20),
		Limit: parseInt(q.Get("limit"), 0),
	}
	if tagsRaw := q.Get("tags"); tagsRaw != "" {
		query.Tags = splitTags(tagsRaw)
	}

	result, err := h.search.Search(r.Context(), query)
	if err != nil {
		h.logger.Error("search failed", "error", err, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	items := make([]docItem, 0, len(result.Items))
	for _, doc := range result.Items {
		items = append(items, toDocItem(doc, query.Text))
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"total": result.Total,
		"items": items,
	})
}

func (h *Handler) handleDocByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}
	doc, err := h.search.GetByID(r.Context(), id)
	if err != nil {
		if err == ports.ErrNotFound {
			writeError(w, http.StatusNotFound, "not found")
			return
		}
		h.logger.Error("doc lookup failed", "error", err, "doc_id", id, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"doc": doc,
		"toc": buildTOC(doc.Content),
	})
}

func (h *Handler) handleDownload(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}
	doc, err := h.search.GetByID(r.Context(), id)
	if err != nil {
		if err == ports.ErrNotFound {
			writeError(w, http.StatusNotFound, "not found")
			return
		}
		h.logger.Error("download lookup failed", "error", err, "doc_id", id, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	absRoot, err := filepath.Abs(h.rootPath)
	if err != nil {
		h.logger.Error("root path resolution failed", "error", err, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, "root path error")
		return
	}
	absPath, err := filepath.Abs(doc.Path)
	if err != nil {
		h.logger.Error("file path resolution failed", "error", err, "path", doc.Path, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, "file path error")
		return
	}
	if !strings.HasPrefix(absPath, absRoot) {
		// Prevent path traversal outside the configured root.
		h.logger.Warn("download path rejected", "path", absPath, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusForbidden, "invalid path")
		return
	}
	if _, err := os.Stat(absPath); err != nil {
		h.logger.Error("download file missing", "error", err, "path", absPath, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusNotFound, "file missing")
		return
	}
	w.Header().Set("Content-Disposition", "attachment; filename=AGENTS.md")
	http.ServeFile(w, r, absPath)
}

func (h *Handler) handleTags(w http.ResponseWriter, r *http.Request) {
	snapshot, err := h.indexer.BuildIndex(r.Context())
	if err != nil {
		h.logger.Error("tags index failed", "error", err, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	counts := map[string]int{}
	for tag, ids := range snapshot.ByTag {
		counts[tag] = len(ids)
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"tags": counts,
	})
}

func (h *Handler) handleSuggestions(w http.ResponseWriter, r *http.Request) {
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	if q == "" {
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"titles": []string{},
			"tags":   []string{},
		})
		return
	}
	snapshot, err := h.indexer.BuildIndex(r.Context())
	if err != nil {
		h.logger.Error("suggestions index failed", "error", err, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
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
	titles := setToSortedSlice(titleSet)
	tags := setToSortedSlice(tagSet)
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"titles": titles,
		"tags":   tags,
	})
}

func (h *Handler) handleRelated(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimSpace(r.URL.Query().Get("id"))
	if id == "" {
		writeError(w, http.StatusBadRequest, "missing id")
		return
	}
	doc, err := h.search.GetByID(r.Context(), id)
	if err != nil {
		if err == ports.ErrNotFound {
			writeError(w, http.StatusNotFound, "not found")
			return
		}
		h.logger.Error("related lookup failed", "error", err, "doc_id", id, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	snapshot, err := h.indexer.BuildIndex(r.Context())
	if err != nil {
		h.logger.Error("related index failed", "error", err, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	tagSet := make(map[string]struct{}, len(doc.Tags))
	for _, t := range doc.Tags {
		tagSet[t] = struct{}{}
	}
	related := make([]docItem, 0, 12)
	seen := map[string]struct{}{doc.ID: {}}
	for _, candidate := range snapshot.Docs {
		if _, ok := seen[candidate.ID]; ok {
			continue
		}
		if candidate.Dept == doc.Dept || shareTag(candidate.Tags, tagSet) {
			seen[candidate.ID] = struct{}{}
			related = append(related, toDocItem(candidate, ""))
		}
		if len(related) >= 10 {
			break
		}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"items": related,
	})
}

func (h *Handler) handleStats(w http.ResponseWriter, r *http.Request) {
	snapshot, err := h.indexer.BuildIndex(r.Context())
	if err != nil {
		h.logger.Error("stats index failed", "error", err, "request_id", requestIDFromContext(r.Context()))
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	recent := make([]docItem, 0, len(snapshot.Docs))
	for _, doc := range snapshot.Docs {
		recent = append(recent, toDocItem(doc, ""))
	}
	if len(recent) > 10 {
		recent = recent[:10]
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"total":  len(snapshot.Docs),
		"recent": recent,
	})
}

type docItem struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Path      string   `json:"path"`
	Dept      string   `json:"dept"`
	Role      string   `json:"role"`
	Type      string   `json:"type"`
	Tags      []string `json:"tags"`
	UpdatedAt string   `json:"updated_at"`
	Excerpt   string   `json:"excerpt"`
}

func toDocItem(doc model.AgentDoc, query string) docItem {
	excerpt := doc.Excerpt
	// Lightweight inline highlight for list previews only.
	if query != "" {
		excerpt = highlightMatch(excerpt, query)
	}
	return docItem{
		ID:        doc.ID,
		Title:     doc.Title,
		Path:      doc.Path,
		Dept:      doc.Dept,
		Role:      doc.Role,
		Type:      doc.Type,
		Tags:      doc.Tags,
		UpdatedAt: doc.UpdatedAt.Format(time.RFC3339),
		Excerpt:   excerpt,
	}
}

func splitTags(raw string) []string {
	parts := strings.Split(raw, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		v := strings.TrimSpace(p)
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

func parseInt(raw string, fallback int) int {
	if raw == "" {
		return fallback
	}
	v, err := strconv.Atoi(raw)
	if err != nil {
		return fallback
	}
	return v
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(statusCode int) {
	w.status = statusCode
	w.ResponseWriter.WriteHeader(statusCode)
}

type requestIDKey struct{}

func withRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey{}, id)
}

func requestIDFromContext(ctx context.Context) string {
	if v := ctx.Value(requestIDKey{}); v != nil {
		if id, ok := v.(string); ok {
			return id
		}
	}
	return ""
}

type tocItem struct {
	Level int    `json:"level"`
	Text  string `json:"text"`
}

func buildTOC(content string) []tocItem {
	lines := strings.Split(content, "\n")
	toc := make([]tocItem, 0, 16)
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "#") {
			continue
		}
		level := 0
		for level < len(line) && line[level] == '#' {
			level++
		}
		text := strings.TrimSpace(line[level:])
		if level == 0 || text == "" {
			continue
		}
		toc = append(toc, tocItem{Level: level, Text: text})
	}
	return toc
}

func highlightMatch(text string, query string) string {
	if text == "" || query == "" {
		return text
	}
	lowerText := strings.ToLower(text)
	lowerQuery := strings.ToLower(query)
	idx := strings.Index(lowerText, lowerQuery)
	if idx < 0 {
		return text
	}
	return text[:idx] + "<mark>" + text[idx:idx+len(query)] + "</mark>" + text[idx+len(query):]
}

func setToSortedSlice(items map[string]struct{}) []string {
	out := make([]string, 0, len(items))
	for v := range items {
		out = append(out, v)
	}
	sort.Strings(out)
	if len(out) > 20 {
		out = out[:20]
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
