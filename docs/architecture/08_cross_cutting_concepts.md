# 8. Cross-Cutting Concepts

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `3e2dba6` (branch: `main`)
> - **Verified Timestamp**: `2026-10-30T20:12:51+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

This section covers systemic concepts that span across multiple components.

---

## 8.1 Dual Pacing Strategy: Time-Bounded vs. Self-Paced

| Dimension | `time_bounded` (Sprint Training) | `self_paced` (Deep Mastery) |
|:---|:---|:---|
| **Pacing Philosophy** | Fast-paced high-velocity batch training | Deliberate exploratory reflection |
| **Countdown Enforcement** | Active ($30\text{s}-180\text{s}$ per node) | None (User clicks when ready) |
| **Timeout Policy** | Auto-escalates hint level, logs time pressure | None |
| **Target Audience** | Exam preparation, rapid onboarding, code katas | Foundational research, complex proofs |

---

## 8.2 Checkpoint & Rollback Mechanics

To prevent compounding misconceptions (analogous to gradient explosion / divergence in LLM training):
1. **Checkpoint Definition**: Key nodes in the DAG are designated as `checkpoints` (e.g., end-of-module milestones).
2. **Divergence Trigger**: If a learner fails 3 consecutive attempts on a downstream node, or if $l_{\text{prereq}} \ge 0.7$, a **Divergence Event** is raised.
3. **Rollback Action**: The engine records the divergence event in `learner-state.json` and resets the active frontier to the nearest upstream checkpoint node for reinforcement.

---

## 8.3 Long-Term Memory & Ebbinghaus Spaced Decay

Cognitive weights decay exponentially without review:
$$\theta_i(t + \Delta t) = \theta_i(t) \cdot 2^{-\frac{\Delta t}{h_i}}$$
Where $h_i$ is the half-life in hours. Each successful review without hint assistance expands $h_i$ by $1.5\times$, automatically scheduling spaced reviews.

---

## 8.4 Context Budgeting ($O(1)$ Memory Overhead)

To support massive dictionaries and corpuses (50,000+ entries):
* Root `curriculum-manifest.json` omits prose and questions ($< 100\text{KB}$).
* Shards isolate 20-50 nodes each ($< 250\text{KB}$).
* At any runtime step, agents or frontends load **exactly one shard** into memory, maintaining $O(1)$ RAM and token overhead.
