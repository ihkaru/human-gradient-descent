# Phase 006: Backward-Pass Progressive Hint Ladder & Remediation

## 1. Objective
Implement the Backward-Pass optimization engine that executes Minimal Necessary Intervention via the Progressive Hint Ladder (PHL), adjusting intervention tiers based on loss severity and past attempts.

---

## 2. Progressive Hint Ladder Tiers
* **Tier 0 (Reflective Question)**: Prompts metacognitive inspection (Penalty: $0\%$).
* **Tier 1 (Directional Clue)**: Directs attention toward relevant variables or conditions (Penalty: $15\%$).
* **Tier 2 (Constraint Narrowing)**: Eliminates invalid alternatives (Penalty: $35\%$).
* **Tier 3 (Worked Example)**: Provides step-by-step resolution of an isomorphic case (Penalty: $60\%$).

---

## 3. Implementation Steps
- [x] Implement `BackwardPassEngine` in `src/engine/backward-pass.ts`.
- [x] State-machine escalation logic: Tier $0 \to 1 \to 2 \to 3$ on consecutive non-convergent attempts.
- [x] Inject targeted micro-remediation markdown snippets matching the primary failing loss axis.
- [x] Calculate weight update $\Delta \theta$ factoring in hint penalties and learning rate $\alpha$.

---

## 4. Verification Evidence
- Hint tier increments strictly upon consecutive errors.
- Corrected responses at Tier 0 receive full weight gain; Tier 3 receives attenuated weight gain.
