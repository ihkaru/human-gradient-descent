# Phase 021: Codebase AST Execution Prediction Probes (Mental Tracing)

## 1. Objective
Implement mental model execution tracing probes (*Mental Simulation*) for coding agent skills and technical curricula. Force the human learner to simulate line-by-line execution, predicting variable state mutations, return values, or edge-case branch selections given specific input vectors *before* receiving explanations.

---

## 2. Invariants & Cognitive Rules
1. **Concrete Input Grounding**:
   A mental trace challenge must never ask abstract questions ("What does this function do?"). It must specify exact, concrete input arguments (e.g. `arr = [10, 20, 30, 40, 50], target = 30`).
2. **Diagnostic Cognitive Traps**:
   The engine maps common programming misconceptions (e.g. 0-based index off-by-one, integer division truncation, variable shadowing, state leakage) to specific axes in the 5-axis loss vector:
   - Off-by-one / boundary oversight $\to$ $l_{\text{reasoning}}$
   - Variable scope confusion $\to$ $l_{\text{concept}}$
   - Type coercion or operator precedence $\to$ $l_{\text{notation}}$
3. **Line-Numbered Context**:
   Code snippets must be formatted with standardized column line numbers (`01 | function...`) to facilitate precise line-targeted questions.

---

## 3. Implementation Steps
- [x] Create `MentalTraceEngine` in `src/engine/mental-trace-engine.ts`.
- [x] Export `MentalTraceEngine` in `src/index.ts`.
- [x] Implement line-number formatting and concrete input serialization.
- [x] Implement cognitive trap pattern matching and 5-axis loss vector attribution.
- [x] Write hermetic tests in `tests/mental-trace-engine.test.ts`.

---

## 4. Verification Evidence

### Test Suite Execution
```bash
$ bun test tests/mental-trace-engine.test.ts
✓ MentalTraceEngine Suite (Codebase AST Tracing Probes) > generates a formatted code trace challenge with line numbers
✓ MentalTraceEngine Suite (Codebase AST Tracing Probes) > converges with 0.0 loss on exact mental trace prediction
✓ MentalTraceEngine Suite (Codebase AST Tracing Probes) > detects diagnostic trap and attributes loss to the reasoningBug axis
3 pass, 0 fail
```
