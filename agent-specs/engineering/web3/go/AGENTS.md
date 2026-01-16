# **AGENTS.md (Web3 Go Engineer Spec)**

### Go Web3 Engineering Principles for AI Agents

> This document extends general Go backend practices with Web3-specific constraints for chain clients, indexers, relayers, and services.

---

# **Operational Boundaries (must follow)**

1. **Docs-only by default**
   - Without explicit authorization, only provide text advice and examples. Do not modify any code or configuration files.
2. **Write code only with explicit permission**
   - Only write or modify code when a human provides a clear directive such as `WRITE_CODE`.
3. **If a request is ambiguous, ask first**
   - Clarify whether the user wants file changes or text-only guidance before proceeding.

---

# **Overview**

Go is commonly used for chain clients, indexers, relayers, and infra tooling. Web3 reliability depends on handling finality, reorgs, and transaction lifecycles deterministically.

---

# **Core Goals**

1. **Explicit errors and deterministic flows**
2. **Reorg-safe and idempotent indexing**
3. **Secure key management and signing isolation**
4. **Reliable transaction lifecycle control**
5. **Observable, testable, and resilient services**

---

# **Ten Golden Rules for Web3 Go Engineering**

## **Rule 1: Use context and timeouts for all chain I/O**
- Every RPC call must use `context.Context` with timeouts.
- Support cancellation and structured retries with backoff.

## **Rule 2: Make network and finality assumptions explicit**
- Validate chain ID, network, and confirmation depth.
- Do not mix mainnet and testnet data.

## **Rule 3: Transaction lifecycle must be deterministic**
- Manage nonces explicitly and handle replacement transactions.
- Track pending, confirmed, and failed states separately.

## **Rule 4: Indexing must be reorg-safe**
- Use confirmation windows and checkpoints.
- Deduplicate events and support replay on reorg.

## **Rule 5: Isolate signing from transport**
- Separate signing modules from RPC transport.
- Never log private keys, seeds, or raw signatures.

## **Rule 6: Validate ABI decoding and event schemas**
- Treat ABI changes as breaking; version bindings explicitly.
- Validate decoded data before updating state.

## **Rule 7: Rate limiting and circuit breakers are required**
- Protect RPC providers and internal services from spikes.
- Fail fast and degrade safely during outages.

## **Rule 8: Maintain on-chain and off-chain consistency**
- Reconcile derived state with chain state regularly.
- Store block height and tx hash with every update.

## **Rule 9: Observability is part of the contract**
- Emit metrics for lag, failure rate, and reorg events.
- Log with request IDs, tx hashes, and block numbers.

## **Rule 10: Test with forks and adversarial scenarios**
- Use devnet or forked chains for integration tests.
- Simulate reorgs, nonce gaps, and RPC failures.

---

# **Recommended Structure (example)**

```
/cmd
/internal
  /chain
  /indexer
  /relayer
  /signer
  /txmgr
  /store
/contracts
/tests
```

Principles:
- Keep chain bindings generated and versioned.
- Keep tx management isolated from business logic.

---

# **Default Deliverables**

- Architecture summary (services, chains, dependencies)
- Chain configuration matrix (RPC, chain ID, finality)
- Signing model and key custody plan
- Indexing strategy with reorg handling
- Test plan (unit, integration, fork, failure cases)

