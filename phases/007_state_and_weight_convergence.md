# Phase 007: State Vector & Weight Convergence Optimizer

## 1. Objective
Implement persistent state management tracking the learner's parameter weights $\Theta$, temporal memory decay, active frontier generation, and overall convergence tracking.

---

## 2. Invariants
1. **Frontier Activation Invariant**:
   A node $u$ enters `activeFrontier` if and only if for all $p \in \text{Parents}(u)$, $\theta_p \ge 0.95$, and $\theta_u < 0.95$.
2. **Mastery Invariant**:
   A node is marked `mastered` when $\theta_u \ge 0.95$ and has at least two consecutive zero-loss attempts.
3. **Decay Dynamics**:
   Memory weights decay exponentially over time based on half-life $h_u$. Successful reviews double the half-life.

---

## 3. Implementation Steps
- [x] Implement `LearnerStateTracker` in `src/engine/state-tracker.ts`.
- [x] Compute topological sorting and detect active frontier nodes dynamically.
- [x] Implement Ebbinghaus decay calculator based on elapsed timestamps.
- [x] Hermetic unit tests testing state updates, frontier transitions, and mastery convergence.

---

## 4. Verification Evidence
- Nodes unlock in strict topological DAG order.
- Inactive nodes exhibit calculated decay when timestamp advances.
