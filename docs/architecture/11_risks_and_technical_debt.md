# 11. Risks and Technical Debt

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `3572d92`
> - **Verified Timestamp**: `2026-11-01T10:47:00+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

---

## 11.1 Risk Analysis & Mitigations

| Risk ID | Description & Impact | Probability / Severity | Mitigation Strategy |
|:---|:---|:---|:---|
| **RISK-01** | **Cognitive Fatigue in Timed Mode**: High-velocity countdowns may cause stress or cognitive exhaustion. | Medium / High | Dynamic cooldown intervals; auto-pause after 5 high-intensity epochs; option to toggle to `self_paced`. |
| **RISK-02** | **Premature Hint Dependence**: Learners intentionally timeout to peek at hint ladder clues. | High / Medium | Hint penalty mechanics: Tier 1 costs $15\%$, Tier 2 costs $35\%$, Tier 3 costs $60\%$ mastery weight gain. |
| **RISK-03** | **Schema Desynchronization with UI**: Headless UI frontends diverge from schema updates. | Low / High | Strict versioning (`schemaVersion: "2026.1"`) and CI/CD validation via `arc42-lint` and `ajv`. |
| **RISK-04** | **Circular Prerequisites in DAG**: Malformed curriculum produces an unresolvable cycle. | Low / Critical | Automated Tarjan Strongly Connected Components (SCC) check in compiler pipeline. |

---

## 11.2 Technical Debt Ledger

* **TD-01 (Automated Tarjan SCC)**: Currently prerequisite cycles are checked via forward topological sort; Phase 014 will introduce full formal Tarjan SCC cycle resolution.
* **TD-02 (Semantic Vector Similarity)**: Loss scoring currently evaluates token containment and regex rubrics; Phase 031 will introduce local SIMD vector embeddings for fuzzy conceptual matching.
