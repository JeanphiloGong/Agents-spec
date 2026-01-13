# **AGENTS.md (Solidity Smart Contract Engineer Spec)**

### Solidity Contract Engineering Principles for AI Agents

> This document extends the Web3 engineering spec with Solidity-specific constraints for secure, auditable smart contracts.

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

Solidity contracts run in adversarial environments and handle irreversible value transfers. This spec prioritizes explicit trust boundaries, minimal attack surface, and audit-ready behavior.

---

# **Core Goals**

1. **Security and correctness over feature speed**
2. **Deterministic and verifiable behavior**
3. **Minimal on-chain complexity**
4. **Gas-aware design without hidden costs**
5. **Audit-ready documentation and tests**

---

# **Ten Golden Rules for Solidity Contracts**

## **Rule 1: Pin compiler and license metadata**
- Include SPDX license identifiers.
- Pin the pragma version and document compiler settings.

## **Rule 2: Make access control explicit**
- Define roles and permissions clearly.
- Use well-audited access patterns and modifiers.

## **Rule 3: Use checks-effects-interactions**
- Update state before external calls.
- Protect external calls with reentrancy guards.
- Prefer pull payments over push payments.

## **Rule 4: Avoid unsafe primitives**
- Do not use `tx.origin` for authorization.
- Avoid `delegatecall` and `selfdestruct` unless strictly required and audited.

## **Rule 5: Validate inputs and enforce invariants**
- Use explicit validation for all inputs.
- Use custom errors or clear revert reasons.

## **Rule 6: Keep upgradeability explicit and rare**
- Prefer immutable contracts unless a clear upgrade case exists.
- For proxies, document storage layout and initializer rules.

## **Rule 7: Emit events for critical state changes**
- Emit events for state transitions and admin actions.
- Make key fields indexed for monitoring and analytics.

## **Rule 8: Avoid on-chain randomness and unsafe time assumptions**
- Do not use `block.timestamp` for randomness.
- Use oracles or VRF for randomness; bound time usage.

## **Rule 9: Gas and storage must be bounded**
- Avoid unbounded loops and unbounded storage growth.
- Keep hot paths minimal and predictable.

## **Rule 10: Testing and audits are mandatory for real funds**
- Require unit, integration, fuzz, and invariant tests.
- Run static analysis and require independent audits before mainnet.

---

# **Recommended Structure (example)**

```
/contracts
  /interfaces
  /libraries
  /modules
/scripts
/deploy
/test
/audits
```

Principles:
- Keep interfaces and libraries isolated from core logic.
- Separate upgradeable contracts if used.

---

# **Default Deliverables**

- Contract specification (roles, invariants, state model)
- ABI and event catalog
- Threat model and access matrix
- Test plan and coverage targets
- Deployment and verification checklist

