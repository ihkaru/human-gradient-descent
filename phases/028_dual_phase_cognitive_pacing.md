# Phase 028: Dual-Phase Cognitive Pacing (Untimed Grounding vs Timed Testing)

## 1. Objective
Eliminate timer anxiety during initial conceptual assimilation. In high-velocity sprint learning, counting down seconds while a learner is trying to understand a novel physical analogy (Block 2) or examine contrasting misconceptions (Block 3) creates destructive cognitive thrashing.

This phase bifurcates the node lifecycle into two distinct cognitive phases:
- **Phase A: Untimed Mental Grounding (Blocks 1–4)**: Pacing timer is in a paused/contemplative state (`"Phase 1: Untimed Primer"`). The learner reads and reflects without time pressure.
- **Phase B: Timed Boundary Stress-Test (Block 5)**: When the learner focuses on Block 5 or selects a hypothesis, the fast-paced countdown timer (`01:00`) activates to train rapid mental model recall.

---

## 2. Invariants & Cognitive Rules
1. **Separation of Priming and Probing**:
   Cognitive intake (reading) and retrieval practice (probing) require different neural tempos. Intake requires high working memory reflection; probing requires fast retrieval.
2. **Deterministic Auto-Activation**:
   Focusing the cursor on the challenge prompt or interacting with options immediately triggers Phase B timing without manual button overhead.

---

## 3. Implementation Steps
- [x] Update `PacingBanner` in `examples/reference-ui/index.html` with `#phase-indicator`.
- [x] Implement dual-phase transition logic in `examples/reference-ui/app.js`.
- [x] Add styling for active phase badges in `examples/reference-ui/uila-heatmap.css`.

---

## 4. Verification Evidence
Timer remains calm and paused during UILA reading, then transitions smoothly to the 60s epoch sprint once Block 5 is active.
