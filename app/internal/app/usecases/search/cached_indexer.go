package search

import (
	"context"
	"sync"
	"time"

	"agents-app/internal/app/ports"
)

type CachedIndexer struct {
	inner ports.Indexer
	ttl   time.Duration

	mu       sync.RWMutex
	cached   ports.IndexSnapshot
	cachedAt time.Time
	loaded   bool
}

func NewCachedIndexer(inner ports.Indexer, ttl time.Duration) *CachedIndexer {
	return &CachedIndexer{inner: inner, ttl: ttl}
}

func (c *CachedIndexer) BuildIndex(ctx context.Context) (ports.IndexSnapshot, error) {
	c.mu.RLock()
	if c.loaded && (c.ttl <= 0 || time.Since(c.cachedAt) < c.ttl) {
		snapshot := c.cached
		c.mu.RUnlock()
		return snapshot, nil
	}
	c.mu.RUnlock()

	c.mu.Lock()
	defer c.mu.Unlock()
	if c.loaded && (c.ttl <= 0 || time.Since(c.cachedAt) < c.ttl) {
		return c.cached, nil
	}
	snapshot, err := c.inner.BuildIndex(ctx)
	if err != nil {
		return ports.IndexSnapshot{}, err
	}
	c.cached = snapshot
	c.cachedAt = time.Now()
	c.loaded = true
	return snapshot, nil
}
