# Phase 032: Tier 2 Semantic Causal Oracle & Misconception Authenticity

## 1. Objective
Establish Tier 2 of the Curriculum Evaluation Suite: Semantic Causal Oracle Inspection. While Tier 1 proves structural and lexical validity, Tier 2 verifies pedagogical and epistemic authenticity. It evaluates whether the isomorphic physical sandbox in Block 2 represents a true physical dynamical system rather than an empty poetic metaphor, checks that contrasting cases address genuine beginner cognitive failure modes rather than trivial strawmen, and ensures that Block 5 tests transfer prediction rather than rote recall.

---

## 2. Invariants & Pedagogical Rules
1. **Isomorphic Physics vs Poetic Metaphor**:
   Block 2 must describe an interactive physical system (with levers, balances, flows, partitions, or pulleys) where spatial or mechanical manipulations correspond directly to the mathematical/computational operations of the target domain.
2. **Authentic Misconception Rigor**:
   Distractor options and contrasting cases must embody authentic cognitive traps (e.g. assuming measurement is passive, assuming classical commutativity, or conflating variable scope). Trivial nonsense distractors (e.g. "Because the computer gets tired") are strictly forbidden.
3. **Transfer Prediction Mandate**:
   Block 5 must challenge the learner to predict the outcome of a state perturbation, forcing activation of the mental model built in Blocks 1 to 4. Definitional recall ("What is the definition of X?") is rejected.
4. **Line Limit Invariant**:
   All files must strictly remain under 350 lines.

---

## 3. Implementation Steps
- [ ] Extend `CurriculumAuditor` in `src/validator/curriculum-auditor.ts` to include Tier 2 heuristic rules:
  - Isomorphic physical keywords and relational mapping checks in Block 2.
  - Distractor rationale depth checks (rejecting trivial or tautological rationales).
  - Transfer prediction verb presence in Block 5 (`predict`, `calculate`, `determine`, `infer`, `observe`).
- [ ] Define standardized Semantic Oracle Rubric in `CurriculumAuditor` for automated scoring and agent-guided review.
- [ ] Integrate Tier 2 evaluation into `hgd audit` reports and unit tests.

---

## 4. Verification Evidence
- `bun test tests/curriculum-auditor.test.ts` verifying Tier 2 rubric execution.
- Automated score calculation reflecting both Tier 1 structural and Tier 2 semantic weights.
