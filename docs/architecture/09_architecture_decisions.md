# 9. Architecture Decisions (ADRs)

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `65a1ac8`
> - **Verified Timestamp**: `2026-10-31T09:00:00+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

---

## ADR-001: Partitioned Sharded DAG Topology
* **Status**: Accepted
* **Context**: Oxford Dictionary-scale curricula exceed LLM context windows and client memory if monolithic.
* **Decision**: Decouple the curriculum into a lightweight root manifest (`curriculum-manifest.json`) and isolated subgraphs (`shards/shard_XXX.json`).
* **Consequences**: Enables scaling to 500,000+ nodes while maintaining $O(1)$ memory overhead.

---

## ADR-002: Dual Pacing Modes (Time-Bounded vs. Self-Paced)
* **Status**: Accepted
* **Context**: Learners need both rapid high-velocity drills (fast-paced training) and relaxed deep conceptual study.
* **Decision**: Encode pacing metadata directly in `curriculum-manifest.schema.json` supporting both `time_bounded` and `self_paced` modes.
* **Consequences**: Enables frontend UIs to render timers and auto-escalate hints upon timeout when running in sprint mode.

---

## ADR-003: Checkpoint & Rollback on Divergence
* **Status**: Accepted
* **Context**: When human learners develop deep misconceptions, pushing forward compounds frustration (analogous to gradient explosion / divergence in neural network training).
* **Decision**: Introduce formal milestone checkpoints. If repeated failure or prerequisite deficit occurs, roll back the active frontier to the preceding checkpoint.
* **Consequences**: Prevents learner churn and guarantees solid prerequisite mastery before resuming advanced nodes.

---

## ADR-004: Pure JSON Contract for Headless UI Consumption
* **Status**: Accepted
* **Context**: Multiple frontends (web, mobile, terminal) will deliver the learning experience without re-implementing pedagogical heuristics.
* **Decision**: All probes, rubrics, timers, hint ladders, and checkpoint rules are serialized into standard JSON Schema Draft 2020-12 files.
* **Consequences**: Frontend UIs act as pure renderers; zero backend computation required.

---

## ADR-005: Bianshi Variation Framework (*Bianshi Jiaoxue*)
* **Status**: Accepted
* **Context**: Rote quizzing leads to superficial pattern matching and representational overfitting.
* **Decision**: Implement conceptual multi-representation and procedural boundary perturbation across a 4-tier difficulty ladder.
* **Consequences**: Enforces deep causal comprehension of invariants across all variations.

---

## ADR-006: Anti-Fatigue & Anti-Involution (*Neijuan*) Governor
* **Status**: Accepted
* **Context**: High-velocity timed training can trigger cognitive thrashing, hurried guessing, and academic burnout.
* **Decision**: Monitor latency anomalies and hurried slips in real-time, enforcing a 3-minute cooldown when `fatigueScore` $\ge 0.7$.
* **Consequences**: Protects learner neuroplastic health and maintains sustainable training momentum.
