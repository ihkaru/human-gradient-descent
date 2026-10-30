# Phase 001: Core Mathematical Pedagogy & Cognitive Invariants

## 1. Objective
Establish the formal mathematical and cognitive mapping of the Human Gradient Descent (HGD) learning model. Translate optimization paradigms (forward pass, loss evaluation, backward pass parameter update) into human cognitive operations grounded in empirical learning science.

---

## 2. Invariants & Mathematical Contracts
1. **State Space Invariant**:
   The learner's knowledge state is represented as a bounded weight vector:
   $$\Theta = [\theta_1, \theta_2, \dots, \theta_D] \in [0.0, 1.0]^D$$
   Every entry represents mastery of a single atomic node in the prerequisite DAG.

2. **Pre-Testing Invariant**:
   An agent running HGD is strictly forbidden from outputting concept definitions, solutions, or summaries before the human learner submits an explicit forward pass prediction $\hat{y}$.

3. **Loss Multi-Dimensionality**:
   Loss is never binary (0 or 1). It is evaluated as a 5-axis vector $\mathbf{l} \in [0.0, 1.0]^5$ spanning Concept Gap, Missing Prerequisite, Notation Breakdown, Strategy Error, and Reasoning Bug.

---

## 3. Implementation Steps
- [x] Audit existing literature on the Generation Effect and Diagnostic Error Analysis.
- [x] Compare behavioral patterns from `human-skill-tree`, `teach-me`, `helderberto/teach`, `education-agent-skills`, and `universal-diagnostic-tutor-skill`.
- [x] Formalize mathematical formulas for cognitive state $\Theta$, dynamic learning rate $\alpha$, and half-life decay.
- [x] Author core documentation in `references/pedagogical-research.md` and `references/mathematical-loss-and-update.md`.

---

## 4. Verification Evidence
- Mathematical continuity of $\Theta \in [0.0, 1.0]$.
- Absence of premature explanations verified by test suites.
