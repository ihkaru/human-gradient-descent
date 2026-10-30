# Phase 012: Headless UI JSON Contract & Pacing Telemetry

## 1. Objective
Establish the headless UI integration contract, guaranteeing that any web, mobile, or terminal frontend can consume HGD JSON schemas directly and render the complete interactive learning loop without proprietary backend logic.

---

## 2. Invariants
1. **Zero-Logic Frontend Invariant**:
   The frontend UI is a pure renderer. All timers, question probes, diagnostic loss rubrics, hint levels, and checkpoint milestones are supplied entirely by the JSON payloads.
2. **Deterministic State Flushes**:
   The frontend writes updated parameter weights $\Theta$ to `learner-state.json` (or local storage) after each backward pass.

---

## 3. Implementation Steps
- [x] Align `curriculum-manifest.schema.json` with frontend progress and checkpoint requirements.
- [x] Align `node-shard.schema.json` with UI timer and hint accordion needs.
- [x] Validate end-to-end schema compliance via `bun run cli validate`.
- [x] Author ADR-004 in `docs/architecture/09_architecture_decisions.md`.

---

## 4. Verification Evidence
- Sample curriculum compiled from markdown validates 100% against Draft 2020-12 schemas.
