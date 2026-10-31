# 2. Architecture Constraints

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `a4b86ba`
> - **Verified Timestamp**: `2026-10-31T20:31:00+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

The system must satisfy deterministic technical, organizational, and pedagogical constraints:

---

## 2.1 Technical Constraints

| Constraint | Category | Description |
|:---|:---|:---|
| **TC-01** | **Runtime Environment** | Pure Bun (`bun >= 1.2.0`) / modern Node.js (`>= 22.0.0`) in TypeScript strict mode. |
| **TC-02** | **Line Limit Governance** | All source files, schemas, and architecture documents must strictly remain **$< 350$ lines**. |
| **TC-03** | **Zero-Mock Policy** | Production pathways and validation engines must operate on real data structures and real schemas. |
| **TC-04** | **Schema Draft 2020-12** | All manifests, shards, and states must validate against JSON Schema Draft 2020-12 via `ajv/dist/2020`. |
| **TC-05** | **Decoupled Frontend Contract** | The engine outputs standardized JSON payloads (`curriculum-manifest.json`, `node-shard.json`, `learner-state.json`). The frontend UI operates as a pure renderer without backend re-computation. |

---

## 2.2 Pedagogical & Cognitive Constraints

| Constraint | Description |
|:---|:---|
| **CC-01** | **Generation-Effect Invariant**: The agent or UI is strictly forbidden from displaying theory or worked examples before the forward-pass input is received. |
| **CC-02** | **Minimal Necessary Intervention**: Scaffolding must escalate strictly through the 4 progressive hint tiers ($T_0 \to T_1 \to T_2 \to T_3$), avoiding full solution dumps. |
| **CC-03** | **Bounded Epoch Duration**: In `time_bounded` mode, per-node challenge timers are enforced ($30\text{s}-180\text{s}$), triggering automatic scaffolding escalations upon timeout to maintain momentum. |

---

## 2.3 Organizational & Portability Constraints

* **Self-Contained Repository**: No machine-specific local paths in repository-level documentation (`GEMINI.md`, `README.md`, `docs/architecture/`).
* **License**: Permissive MIT open-source license.
