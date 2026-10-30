# Phase 015: Anti-Fatigue Safety Governor & Gradient Analytics

## 1. Objective
Implement ethical pacing safeguards and non-punitive diagnostic analytics. Mitigate cognitive fatigue, hurried blind guessing, and toxic involution (*Neijuan*), reframing all errors as high-signal gradient updates.

---

## 2. Invariants & Rules
1. **Hurried Slip Detection**:
   Submitting an answer in $< 3$ seconds with high loss ($\mathcal{L} > 0.4$) is classified as a *hurried slip* (blind guessing under time anxiety), increasing the fatigue score.
2. **Exhaustion Drift Detection**:
   Response latency exceeding $2.5\times$ the moving average with deteriorating accuracy triggers an exhaustion marker.
3. **Mandatory Cooldown (Anti-Involution Circuit Breaker)**:
   When `fatigueScore` exceeds $0.7$, the governor triggers an automatic 3-minute neural consolidation pause and recommends switching to `self_paced` mode.
4. **Non-Stigmatizing Telemetry Contract**:
   The telemetry payload never transmits "failure" states. It outputs gradient vectors, directional misalignments, and parameter distance to convergence ($\Delta \theta$).

---

## 3. Implementation Steps
- [x] Integrate `fatigueMetrics` into `schemas/learner-state.schema.json`.
- [x] Implement `FatigueGovernor` in `src/engine/fatigue-governor.ts`.
- [x] Hook latency and slip tracking into the interactive session runner.
- [x] Author ADR-006 in `docs/architecture/09_architecture_decisions.md`.

---

## 4. Verification Evidence
- Unit test in `tests/variation-and-fatigue.test.ts` proving cooldown triggering upon repeated hurried slips.
