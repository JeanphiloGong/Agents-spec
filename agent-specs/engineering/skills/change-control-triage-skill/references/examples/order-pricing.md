# Example (RED): Order Pricing / Final Price Calculation

This is a canonical example of “easy to ship as a black box” logic that must be **RED**.

## Scenario

You need to compute an order’s final price.

Rules (common in real systems):
- The order must be in `CREATED` status to calculate price.
- Base price = sum(unit_price * quantity) across items.
- If there is a coupon:
  - only one coupon may apply
  - coupon cannot stack with VIP discount
- VIP discount is 5% (final price = base * 0.95).
- Final price cannot be negative.
- Once price is confirmed, it cannot be recalculated/modified.

## Mastery Checklist (filled)

### Invariants
1. `order.status == CREATED` is required to calculate price.
2. `coupon XOR vip_discount` (mutual exclusion).
3. `final_price >= 0`.
4. Pricing is a one-time operation (cannot be performed twice).

### Preconditions / State Boundaries
- Allowed when:
  - order status is `CREATED`
  - price not yet confirmed
- Forbidden when:
  - status is not `CREATED`
  - price already confirmed
  - coupon and VIP are both present

### State Transitions
- Before:
  - `price_confirmed = false`
  - `final_price = null` (or absent)
- After:
  - `price_confirmed = true`
  - `final_price = computed_value`
- “Done” means:
  - downstream systems can treat `final_price` as stable for charging/invoicing

### Failure Modes + Handling
1) Wrong status:
   - Signal: error (e.g., `OrderNotPricable`)
   - Handling: reject request; do not write price
2) Repricing attempt:
   - Signal: error (e.g., `PriceAlreadyConfirmed`)
   - Handling: reject; ensure idempotency for retries at higher layers if needed
3) Forbidden stacking (coupon + VIP):
   - Signal: error (e.g., `DiscountConflict`)
   - Handling: reject; do not compute partial discounts

### Verification (minimal)
- Positive tests:
  - base-only calculation
  - coupon-only calculation
  - vip-only calculation
- Negative tests:
  - coupon + VIP → must fail
  - calculate twice → must fail
  - status != CREATED → must fail
- Boundary tests:
  - coupon bigger than base → final price clamps to 0
  - empty items list (if allowed) → define behavior explicitly

### Rollback / Stop-the-Bleeding
- If pricing is not persisted: revert code and redeploy.
- If pricing is persisted:
  - forbid overwriting confirmed price
  - add a compensating adjustment flow (explicit, auditable) instead of mutation
- Emergency switch:
  - disable coupon application via feature flag (if available)
  - or temporarily reject pricing requests except base-only

## Money Precision Note (Common Hidden Risk)

Do not use floating point for money. Prefer:
- integer cents, or
- a decimal type/library with explicit rounding rules.
