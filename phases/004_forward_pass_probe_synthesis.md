# Phase 004: Forward-Pass Probe Synthesizer

## 1. Objective
Implement the Forward-Pass engine responsible for generating predictive, generation-effect probes from raw technical contexts and competency nodes before presenting explanatory content.

---

## 2. Probe Archetypes
1. **Prediction What-If (`prediction_what_if`)**:
   Presents a system or code snippet and asks: *"If input $X$ changes to $Y$, how does state $Z$ react and why?"*
2. **Pre-Test Scenario (`pre_test`)**:
   Presents an authentic problem case requiring the learner to hypothesize the required mechanism or concept.
3. **Counterfactual Challenge (`counterfactual`)**:
   Presents an intentional deviation and asks: *"Why would doing $A$ fail even though it appears correct at first glance?"*
4. **Code Output Prediction (`code_output_prediction`)**:
   Demands mental execution of logic or algorithms, predicting output and complexity without a compiler.

---

## 3. Implementation Steps
- [x] Define probe generation contracts in `src/types/curriculum.ts`.
- [x] Implement `ForwardPassEngine` in `src/engine/forward-pass.ts`.
- [x] Enforce anti-hint policy: sanitize reading context to eliminate inadvertent solution leaks.
- [x] Write hermetic unit tests verifying probe prompt formatting and expected mental models.

---

## 4. Verification Evidence
- Verify that every node in generated curricula possesses at least one valid forward-pass probe matching its cognitive level.
