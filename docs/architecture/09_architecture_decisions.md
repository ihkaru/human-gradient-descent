# 9. Architecture Decisions (ADRs)

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `85dd89b`
> - **Verified Timestamp**: `2026-10-31T20:21:00+07:00`
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

---

## ADR-007: Universal Invariant Learning Architecture (UILA) Grounding vs Blind Prediction
* **Status**: Accepted
* **Context**: Forcing novice learners to predict system states from a vacuum (*zero-shot blind guessing*) causes cognitive paralysis and demoralization.
* **Decision**: Structure every competency node into the 5-block UILA sequence. Blocks 1 to 4 provide foundational model initialization (breakdown scenario, isomorphic physical sandbox, invariant contrasting cases, and notation contracts), while Block 5 executes the boundary stress-test (Forward Pass).
* **Consequences**: Eliminates the "Draw the Rest of the Owl" fallacy and grounds active prediction in rigorous causal mental models.

---

## ADR-008: Native CSS Grid for GitHub-Style Activity & Mastery Heatmap
* **Status**: Accepted
* **Context**: Learners require visual confirmation of incremental effort and daily streaks (*effort over innate ability*) without bloating bundle size.
* **Decision**: Render a 4-tier emerald activity calendar using native CSS Grid and semantic HTML attributes, logging timestamps directly to `learner-state.json`.
* **Consequences**: Zero third-party chart dependencies, $<1\text{ms}$ rendering, and complete offline responsiveness on mobile viewports.
