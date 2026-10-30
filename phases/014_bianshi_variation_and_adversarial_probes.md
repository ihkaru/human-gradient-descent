# Phase 014: Bianshi Variation Engine & Adversarial Probes

## 1. Objective
Implement the Bianshi Variation Theory (*Bianshi Jiaoxue* / Ference Marton & Gu Lingyuan) into the HGD optimization pipeline. Introduce conceptual multi-representation and procedural boundary perturbations, formalizing the 4-tier difficulty pyramid.

---

## 2. Invariants & Architecture
1. **Conceptual Variation (*Gannian Bianshi*)**:
   Every competency node provides alternative representations of the same invariant (e.g. symbolic logic, code syntax, visual diagram descriptions, verbal rules) to prevent representational overfitting.
2. **Procedural Variation (*Guocheng Bianshi*)**:
   Systematic single-variable perturbations exposing critical boundary conditions (e.g. $N=0$, null values, reversed constraints, infinite limits).
3. **4-Tier Graduated Difficulty Pyramid**:
   - **Tier 1: Foundational Fluency**: Rapid reflexive recall of the primary invariant.
   - **Tier 2: Boundary Perturbation**: Single-variable parameter shifts.
   - **Tier 3: Isomorphic Transfer**: Non-routine scenario with identical deep math/logic but completely disjoint surface disguise.
   - **Tier 4: Adversarial Dilemma**: Cognitive traps challenging intuitive biases.

---

## 3. Implementation Steps
- [x] Integrate `variationProbes` into `node-shard.schema.json`.
- [x] Implement `VariationEngine` in `src/engine/variation-engine.ts`.
- [x] Connect procedural perturbations to `LossEngine` boundary evaluation.
- [x] Author ADR-005 in `docs/architecture/09_architecture_decisions.md`.

---

## 4. Verification Evidence
- Hermetic test in `tests/variation-and-fatigue.test.ts` verifying variation challenge generation and difficulty tier assignment.
