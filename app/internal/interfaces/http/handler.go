package httpapi

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
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
)

type Handler struct {
	search     *search.Service
	rootPath   string
	maxResults int
	logger     *slog.Logger
}

const (
	defaultPageSize      = 20
	maxPageSize          = 200
	maxTagFilters        = 20
	maxQueryLength       = 200
	maxSuggestionResults = 20
	maxRelatedResults    = 10
	maxRecentDocs        = 10
)

type apiError struct {
	Status  int
	Code    string
	Message string
}

type errorResponse struct {
	Error     errorBody `json:"error"`
	RequestID string    `json:"request_id,omitempty"`
}

type errorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

var (
	errNotFound  = apiError{Status: http.StatusNotFound, Code: "not_found", Message: "not found"}
	errForbidden = apiError{Status: http.StatusForbidden, Code: "forbidden", Message: "forbidden"}
	errInternal  = apiError{Status: http.StatusInternalServerError, Code: "internal_error", Message: "internal error"}
)

// NewHandler wires HTTP endpoints to use cases.
func NewHandler(searchSvc *search.Service, rootPath string, maxResults int, logger *slog.Logger) *Handler {
	return &Handler{search: searchSvc, rootPath: rootPath, maxResults: maxResults, logger: logger}
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
		requestID := strings.TrimSpace(r.Header.Get("X-Request-Id"))
		if requestID == "" {
			requestID = newRequestID()
		}
		traceID := strings.TrimSpace(r.Header.Get("X-Trace-Id"))
		ctx := withRequestID(r.Context(), requestID)
		if traceID != "" {
			ctx = withTraceID(ctx, traceID)
			w.Header().Set("X-Trace-Id", traceID)
		}
		w.Header().Set("X-Request-Id", requestID)
		rw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rw, r.WithContext(ctx))
		h.logger.Info(
			"request completed",
			"method", r.Method,
			"path", r.URL.Path,
			"status", rw.status,
			"duration_ms", time.Since(start).Milliseconds(),
			"request_id", requestID,
			"trace_id", traceID,
		)
	})
}

func (h *Handler) handleHealth(w http.ResponseWriter, r *http.Request) {
	h.writeJSON(w, r, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) handleDocs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	text := strings.TrimSpace(q.Get("q"))
	if len(text) > maxQueryLength {
		h.respondError(w, r, invalidRequest("query too long"), nil, "invalid query", "param", "q")
		return
	}
	page := 1
	if v, ok, err := parseOptionalInt(q.Get("page")); err != nil || (ok && v <= 0) {
		h.respondError(w, r, invalidRequest("invalid page"), err, "invalid query", "param", "page", "value", q.Get("page"))
		return
	} else if ok {
		page = v
	}
	size := defaultPageSize
	if v, ok, err := parseOptionalInt(q.Get("size")); err != nil || (ok && (v <= 0 || v > maxPageSize)) {
		h.respondError(w, r, invalidRequest("invalid size"), err, "invalid query", "param", "size", "value", q.Get("size"))
		return
	} else if ok {
		size = v
	}
	limit := 0
	if v, ok, err := parseOptionalInt(q.Get("limit")); err != nil || (ok && v < 0) {
		h.respondError(w, r, invalidRequest("invalid limit"), err, "invalid query", "param", "limit", "value", q.Get("limit"))
		return
	} else if ok {
		if h.maxResults > 0 && v > h.maxResults {
			h.respondError(w, r, invalidRequest("limit too large"), nil, "invalid query", "param", "limit", "value", q.Get("limit"))
			return
		}
		limit = v
	}
	tags := []string(nil)
	if tagsRaw := q.Get("tags"); tagsRaw != "" {
		tags = splitTags(tagsRaw)
		if len(tags) > maxTagFilters {
			h.respondError(w, r, invalidRequest("too many tags"), nil, "invalid query", "param", "tags")
			return
		}
	}

	query := search.Query{
		Text:  text,
		Dept:  q.Get("dept"),
		Role:  q.Get("role"),
		Type:  q.Get("type"),
		Sort:  q.Get("sort"),
		Page:  page,
		Size:  size,
		Limit: limit,
		Tags:  tags,
	}

	result, err := h.search.Search(r.Context(), query)
	if err != nil {
		h.respondError(w, r, errInternal, err, "search failed")
		return
	}
	items := make([]docItem, 0, len(result.Items))
	for _, doc := range result.Items {
		items = append(items, toDocItem(doc, query.Text))
	}
	h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
		"total": result.Total,
		"items": items,
	})
}

func (h *Handler) handleDocByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		h.respondError(w, r, invalidRequest("missing id"), nil, "missing id")
		return
	}
	doc, err := h.search.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, ports.ErrNotFound) {
			h.respondError(w, r, errNotFound, nil, "doc not found", "doc_id", id)
			return
		}
		h.respondError(w, r, errInternal, err, "doc lookup failed", "doc_id", id)
		return
	}
	h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
		"doc": doc,
		"toc": buildTOC(doc.Content),
	})
}

func (h *Handler) handleDownload(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		h.respondError(w, r, invalidRequest("missing id"), nil, "missing id")
		return
	}
	doc, err := h.search.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, ports.ErrNotFound) {
			h.respondError(w, r, errNotFound, nil, "doc not found", "doc_id", id)
			return
		}
		h.respondError(w, r, errInternal, err, "download lookup failed", "doc_id", id)
		return
	}
	absRoot, err := filepath.Abs(h.rootPath)
	if err != nil {
		h.respondError(w, r, errInternal, err, "root path resolution failed")
		return
	}
	absPath, err := filepath.Abs(doc.Path)
	if err != nil {
		h.respondError(w, r, errInternal, err, "file path resolution failed", "path", doc.Path)
		return
	}
	if !isWithinRoot(absRoot, absPath) {
		// Prevent path traversal outside the configured root.
		h.respondError(w, r, errForbidden, nil, "download path rejected", "path", absPath)
		return
	}
	if _, err := os.Stat(absPath); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			h.respondError(w, r, errNotFound, nil, "download file missing", "path", absPath)
			return
		}
		h.respondError(w, r, errInternal, err, "download file stat failed", "path", absPath)
		return
	}
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%q", filepath.Base(absPath)))
	http.ServeFile(w, r, absPath)
}

func (h *Handler) handleTags(w http.ResponseWriter, r *http.Request) {
	counts, err := h.search.Tags(r.Context())
	if err != nil {
		h.respondError(w, r, errInternal, err, "tags index failed")
		return
	}
	h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
		"tags": counts,
	})
}

func (h *Handler) handleSuggestions(w http.ResponseWriter, r *http.Request) {
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	if q == "" {
		h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
			"titles": []string{},
			"tags":   []string{},
		})
		return
	}
	if len(q) > maxQueryLength {
		h.respondError(w, r, invalidRequest("query too long"), nil, "invalid query", "param", "q")
		return
	}
	titles, tags, err := h.search.Suggestions(r.Context(), q, maxSuggestionResults)
	if err != nil {
		h.respondError(w, r, errInternal, err, "suggestions index failed")
		return
	}
	h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
		"titles": titles,
		"tags":   tags,
	})
}

func (h *Handler) handleRelated(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimSpace(r.URL.Query().Get("id"))
	if id == "" {
		h.respondError(w, r, invalidRequest("missing id"), nil, "missing id")
		return
	}
	relatedDocs, err := h.search.Related(r.Context(), id, maxRelatedResults)
	if err != nil {
		if errors.Is(err, ports.ErrNotFound) {
			h.respondError(w, r, errNotFound, nil, "doc not found", "doc_id", id)
			return
		}
		h.respondError(w, r, errInternal, err, "related lookup failed", "doc_id", id)
		return
	}
	related := make([]docItem, 0, len(relatedDocs))
	for _, doc := range relatedDocs {
		related = append(related, toDocItem(doc, ""))
	}
	h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
		"items": related,
	})
}

func (h *Handler) handleStats(w http.ResponseWriter, r *http.Request) {
	total, recentDocs, err := h.search.Stats(r.Context(), maxRecentDocs)
	if err != nil {
		h.respondError(w, r, errInternal, err, "stats index failed")
		return
	}
	recent := make([]docItem, 0, len(recentDocs))
	for _, doc := range recentDocs {
		recent = append(recent, toDocItem(doc, ""))
	}
	h.writeJSON(w, r, http.StatusOK, map[string]interface{}{
		"total":  total,
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

func parseOptionalInt(raw string) (int, bool, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return 0, false, nil
	}
	v, err := strconv.Atoi(raw)
	if err != nil {
		return 0, true, err
	}
	return v, true, nil
}

func invalidRequest(msg string) apiError {
	return apiError{Status: http.StatusBadRequest, Code: "invalid_request", Message: msg}
}

func (h *Handler) writeJSON(w http.ResponseWriter, r *http.Request, status int, payload interface{}) {
	if err := encodeJSON(w, status, payload); err != nil {
		if r == nil {
			h.logger.Error("response write failed", "error", err, "error.type", fmt.Sprintf("%T", err), "error.msg", err.Error())
			return
		}
		h.logger.Error(
			"response write failed",
			"error", err,
			"error.type", fmt.Sprintf("%T", err),
			"error.msg", err.Error(),
			"request_id", requestIDFromContext(r.Context()),
			"trace_id", traceIDFromContext(r.Context()),
		)
	}
}

func encodeJSON(w http.ResponseWriter, status int, payload interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(payload)
}

func (h *Handler) respondError(w http.ResponseWriter, r *http.Request, apiErr apiError, err error, logMsg string, fields ...any) {
	h.logAPIError(r, apiErr, err, logMsg, fields...)
	h.writeErrorResponse(w, r, apiErr)
}

func (h *Handler) logAPIError(r *http.Request, apiErr apiError, err error, msg string, fields ...any) {
	attrs := []any{"status", apiErr.Status}
	if r != nil {
		requestID := requestIDFromContext(r.Context())
		traceID := traceIDFromContext(r.Context())
		if requestID != "" {
			attrs = append(attrs, "request_id", requestID)
		}
		if traceID != "" {
			attrs = append(attrs, "trace_id", traceID)
		}
	}
	if err != nil {
		attrs = append(attrs, "error", err, "error.type", fmt.Sprintf("%T", err), "error.msg", err.Error())
	}
	attrs = append(attrs, fields...)
	if apiErr.Status >= http.StatusInternalServerError {
		h.logger.Error(msg, attrs...)
		return
	}
	h.logger.Warn(msg, attrs...)
}

func (h *Handler) writeErrorResponse(w http.ResponseWriter, r *http.Request, apiErr apiError) {
	resp := errorResponse{
		Error: errorBody{
			Code:    apiErr.Code,
			Message: apiErr.Message,
		},
	}
	if r != nil {
		if requestID := requestIDFromContext(r.Context()); requestID != "" {
			resp.RequestID = requestID
		}
	}
	if err := encodeJSON(w, apiErr.Status, resp); err != nil {
		if r == nil {
			h.logger.Error("response write failed", "error", err, "error.type", fmt.Sprintf("%T", err), "error.msg", err.Error())
			return
		}
		h.logger.Error(
			"response write failed",
			"error", err,
			"error.type", fmt.Sprintf("%T", err),
			"error.msg", err.Error(),
			"request_id", requestIDFromContext(r.Context()),
			"trace_id", traceIDFromContext(r.Context()),
		)
	}
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

type traceIDKey struct{}

func withTraceID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, traceIDKey{}, id)
}

func traceIDFromContext(ctx context.Context) string {
	if v := ctx.Value(traceIDKey{}); v != nil {
		if id, ok := v.(string); ok {
			return id
		}
	}
	return ""
}

func newRequestID() string {
	var b [16]byte
	if _, err := rand.Read(b[:]); err != nil {
		return fmt.Sprintf("req-%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(b[:])
}

type tocItem struct {
	Level int    `json:"level"`
	Text  string `json:"text"`
}

func isWithinRoot(root, target string) bool {
	rel, err := filepath.Rel(root, target)
	if err != nil {
		return false
	}
	rel = filepath.ToSlash(rel)
	return rel != ".." && !strings.HasPrefix(rel, "../")
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
