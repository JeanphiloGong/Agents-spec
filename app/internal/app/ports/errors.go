package ports

import "errors"

// ErrNotFound signals missing resources without leaking path details.
var ErrNotFound = errors.New("not found")
