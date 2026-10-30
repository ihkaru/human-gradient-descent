# Phase 005: 5-Axis Diagnostic Loss Function Engine

## 1. Objective
Implement the 5-Axis Diagnostic Loss Engine that decomposes a human learner's forward pass answer $\hat{y}$ against the ground truth $y$, producing an isolated error vector $\mathbf{l} \in [0.0, 1.0]^5$.

---

## 2. Loss Dimensions & Scoring
$$\mathcal{L}_{\text{total}} = 0.35 \cdot l_{\text{concept}} + 0.25 \cdot l_{\text{prereq}} + 0.10 \cdot l_{\text{notation}} + 0.15 \cdot l_{\text{strategy}} + 0.15 \cdot l_{\text{reasoning}}$$

1. **Concept Gap ($l_{\text{concept}}$)**:
   Measures structural absence of the core principle. (e.g., treating asynchronous promises as synchronous threads).
2. **Missing Prerequisite ($l_{\text{prereq}}$)**:
   Detects that failure stems from an unmastered parent node in the DAG.
3. **Notation Breakdown ($l_{\text{notation}}$)**:
   Valid logic, but confused terminology, units, or syntax.
4. **Method Choice ($l_{\text{strategy}}$)**:
   Selected brute-force $O(N^2)$ when dynamic programming $O(N)$ was expected.
5. **Reasoning Bug ($l_{\text{reasoning}}$)**:
   Correct formula and approach, but arithmetic or off-by-one boundary error.

---

## 3. Implementation Steps
- [x] Implement `LossEngine` in `src/engine/loss-engine.ts`.
- [x] Build multi-axis heuristic evaluator mapping response tokens and rationale against rubric criteria.
- [x] Generate primary error classification and human-readable pedagogical justification.
- [x] Unit test against known response patterns (near-misses, syntax errors, deep misconceptions).

---

## 4. Verification Evidence
- Zero-loss detection on ground-truth matches ($\mathcal{L} \le 0.05$).
- Accurate classification of boundary errors as reasoning bugs vs concept gaps.
