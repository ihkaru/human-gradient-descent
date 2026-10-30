# Phase 011: Time-Bounded Pacing, Epoch Acceleration & Checkpoints

## 1. Objective
Formalize the dual-mode pacing engine (`time_bounded` fast-paced training vs `self_paced` deep mastery) and the milestone checkpoint & rollback mechanism. Bring the velocity of human learning in line with high-throughput neural network training loops.

---

## 2. Invariants & Rules
1. **Countdown Invariant**:
   In `time_bounded` mode, nodes enforce an active timeout ($30\text{s}-180\text{s}$). If the timer elapses without a prediction submission, the system triggers automatic hint ladder escalation (Tier 1).
2. **Checkpoint Invariant**:
   Milestone checkpoints are saved at module boundaries. When catastrophic loss ($\mathcal{L} > 0.7$) or severe prerequisite deficit ($l_{\text{prereq}} \ge 0.7$) occurs, the engine rolls back the active frontier to the preceding checkpoint.
3. **Rollback Traceability**:
   Every rollback is recorded in `learner-state.json` under `pacingState.rollbackHistory` for diagnostic analytics.

---

## 3. Implementation Steps
- [x] Author schema updates for `curriculum-manifest.schema.json`, `node-shard.schema.json`, and `learner-state.schema.json`.
- [x] Implement `CheckpointManager` in `src/engine/checkpoint-manager.ts`.
- [x] Implement `PacingController` in `src/engine/pacing-controller.ts`.
- [x] Integrate dual-mode pacing in `src/compiler/markdown-compiler.ts`.
- [x] Author arc42 documentation in `docs/architecture/`.

---

## 4. Verification Evidence
- Run `bun test tests/pacing-checkpoint.test.ts` verifying countdown enforcement and rollback execution upon simulated divergence.
