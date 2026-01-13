# **AGENTS.md (Web3 Engineer Spec)**

### Web3 Engineering Principles for AI Agents

> This document extends general backend engineering principles with Web3-specific constraints. It covers smart contracts, wallet integration, on-chain/off-chain boundaries, and production safety.

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

Web3 engineering spans smart contracts, chain integrations, wallet UX, indexing, and infrastructure reliability. The primary risks are irreversible transactions, adversarial environments, and hidden complexity across chains and tooling. This spec prioritizes security, explicit boundaries, and reproducible behavior.

---

# **Core Goals**

1. **Security-first and adversarial mindset**
2. **Deterministic, verifiable behavior**
3. **Reliable transaction lifecycle**
4. **Clear on-chain and off-chain boundaries**
5. **Observable and testable system**

---

# **Ten Golden Rules for Web3 Engineering**

## **Rule 1: Confirm chain, environment, and trust assumptions**
- Always identify chain type (EVM or non-EVM), network (testnet/mainnet), and finality model.
- Keep chain ID, RPC endpoints, and confirmations explicit and consistent.

## **Rule 2: Treat all inputs and dependencies as adversarial**
- Validate all external inputs (wallet data, RPC responses, oracle feeds).
- Prefer audited libraries (for example, OpenZeppelin) and established patterns.

## **Rule 3: Protect keys and secrets by design**
- Never hardcode private keys, seed phrases, or API secrets.
- Never log secrets or raw signatures.
- Isolate signing operations and enforce least privilege.

## **Rule 4: Make transaction lifecycle idempotent**
- Manage nonces explicitly and handle retries safely.
- Track pending, confirmed, and failed states.
- Handle reorgs and duplicate events without double effects.

## **Rule 5: Gas and fee behavior must be explicit**
- Use gas estimation with margins and clear override rules.
- Avoid unbounded loops and storage growth in contracts.
- Surface gas risk in user-facing flows.

## **Rule 6: Keep on-chain logic minimal and deterministic**
- Put complex logic off-chain where possible.
- Avoid relying on timestamps or block data without safeguards.
- Treat oracles and external calls as failure-prone.

## **Rule 7: Upgradeability and governance must be explicit**
- Use upgradeability only when required; prefer immutable contracts.
- Define admin keys, timelocks, and emergency procedures.
- Test upgrades and storage layout changes rigorously.

## **Rule 8: Oracles and cross-chain dependencies need redundancy**
- Use freshness checks, fallback paths, and sanity bounds.
- Avoid single-source dependency for critical pricing or state.

## **Rule 9: Indexing must be reorg-safe and deterministic**
- Use checkpoints and replay-safe ingestion.
- Deduplicate events and handle out-of-order logs.
- Validate source data before trusting derived state.

## **Rule 10: Testing and audits are mandatory for real funds**
- Require unit, integration, and fork tests.
- Add fuzzing and invariant tests for contracts.
- Require independent audit before mainnet deployment.

---

# **Recommended Structure (example)**

```
/contracts
/scripts
/deploy
/indexer
/app
/infra
/tests
```

Principles:
- Keep contract code isolated from application logic.
- Keep deployment and migration scripts explicit and repeatable.
- Keep indexing and data pipelines reorg-safe.

---

# **Default Deliverables**

- Architecture summary (contracts, app, indexer, infra)
- Interface specs (ABI, events, permissions)
- Threat model and risk list
- Test plan (unit, integration, fork, fuzz)
- Deployment checklist (addresses, verification, monitoring)

