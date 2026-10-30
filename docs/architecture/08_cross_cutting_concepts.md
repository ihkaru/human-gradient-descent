# 8. Cross-Cutting Concepts

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `c06f553` (branch: `main`)
> - **Verified Timestamp**: `2026-10-30T20:22:42+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

This section covers systemic concepts that span across multiple components.

---

## 8.1 Domain-Agnostic Invariant Extraction

Regardless of domain (e.g. quantum physics vs contract law vs immunology):
1. **The Invariant**: Non-negotiable causal principle (e.g., *No-Cloning Theorem* in physics; *Objective Manifestation of Assent* in law).
2. **Boundary Conditions**: Conditions under which the invariant breaks or transitions (e.g., *Measurement collapse*; *Promissory estoppel exception*).
3. **Representational Mapping**: Formatted into symbolic, verbal, tabular, and code representations.

---

## 8.2 Bianshi Variation Mechanics (*Bianshi Jiaoxue*)

Each node encapsulates two dimensions of variation:
* **Conceptual Variation**: Multi-modal encoding (e.g., Code $\leftrightarrow$ Math formula $\leftrightarrow$ Legal statute $\leftrightarrow$ Visual diagram).
* **Procedural Variation**: Systematic perturbation of single variables (e.g., $N=0$, negative integers, joke subjective intent, zero-concentration enzymes).

---

## 8.3 Dual Pacing Strategy & Anti-Fatigue Circuit Breaker

| Dimension | `time_bounded` (Sprint Training) | `self_paced` (Deep Mastery) |
|:---|:---|:---|
| **Pacing Philosophy** | Fast-paced high-velocity batch training | Deliberate exploratory reflection |
| **Countdown Enforcement** | Active ($30\text{s}-180\text{s}$ per node) | None (User clicks when ready) |
| **Timeout Policy** | Auto-escalates hint level, logs time pressure | None |
| **Fatigue Circuit Breaker** | Triggers 3-min cooldown if `fatigueScore` $\ge 0.7$ | Inactive |

---

## 8.4 Checkpoint & Rollback Mechanics

To prevent compounding misconceptions (analogous to gradient explosion / divergence in LLM training):
1. **Checkpoint Definition**: Key nodes in the DAG are designated as `checkpoints` (e.g., end-of-module milestones).
2. **Divergence Trigger**: If a learner fails 3 consecutive attempts on a downstream node, or if $l_{\text{prereq}} \ge 0.7$, a **Divergence Event** is raised.
3. **Rollback Action**: The engine records the divergence event in `learner-state.json` and resets the active frontier to the nearest upstream checkpoint node for reinforcement.

---

## 8.5 Working Memory Budgeting & Context Isolation ($O(1)$ RAM)

* **Phonological Loop Budget**: Challenge prompts are capped at $\le 50$ words ($\le 3$ seconds) to fit within short-term working memory capacity.
* **Shard Partitioning**: Root manifest omits questions and hints ($< 100\text{KB}$); individual shards store $20-50$ nodes ($< 250\text{KB}$). Agents load only the active shard into memory, maintaining $O(1)$ token overhead.
