# 1. Introduction and Goals

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `c5a1aa4`
> - **Verified Timestamp**: `2026-10-31T19:45:00+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

The **Human Gradient Descent (HGD)** platform formulates human learning as an active, high-velocity parameter optimization loop:
$$\Theta_{t+1} = \Theta_t - \alpha \nabla_\Theta \mathcal{L}$$

Rather than passive consumption, HGD treats the human brain analogously to a neural network during fast-paced pretraining and fine-tuning: executing rapid forward-pass predictions, computing multidimensional diagnostic loss, and updating internal cognitive weights with checkpoint and rollback guarantees.

Crucially, HGD is **strictly domain-agnostic**: whether the input corpus is quantum mechanics, software architecture, statutory contract law, clinical medicine, or linguistics, the invariant deconstruction engine operates with identical mathematical and pedagogical rigor.

---

## 1.1 Requirements Overview

| ID | Requirement | Description |
|:---|:---|:---|
| **REQ-01** | **Prediction-First Forward Pass** | Strict generation-effect enforcement; no explanatory text is delivered before active prediction. |
| **REQ-02** | **5-Axis Diagnostic Loss** | Isolate errors into Concept Gap, Missing Prerequisite, Notation, Strategy, and Reasoning. |
| **REQ-03** | **Dual Pacing Modes** | Support both `time_bounded` (sprint/fast-paced training) and `self_paced` (deep mastery) curricula. |
| **REQ-04** | **Checkpoints & Rollbacks** | Save stable cognitive checkpoints; rollback frontier upon severe loss spikes or misconception divergence. |
| **REQ-05** | **Bianshi Variation Engine** | Multi-representational invariants (*Gannian Bianshi*) and boundary perturbations (*Guocheng Bianshi*). |
| **REQ-06** | **Anti-Fatigue Safety Governor** | Real-time detection of hurried blind guessing and exhaustion, enforcing neural consolidation cooldowns. |
| **REQ-07** | **Domain-Agnostic Scale** | Support Oxford Dictionary scale ($> 50,000$ nodes) across any discipline via decoupled shards. |
| **REQ-08** | **Pure JSON UI Contract** | Output deterministic JSON consumed directly by web/mobile frontends without custom server logic. |

---

## 1.2 Quality Goals (Q42 Model)

| Priority | Quality Attribute | Motivation / Metric |
|:---|:---|:---|
| **Q-01** | **High Velocity (Fast-Paced)** | Rapid forward-backward passes ($30\text{s}-90\text{s}$ per cycle in timed mode) maximizing retention epochs. |
| **Q-02** | **Domain Agnosticism** | Identical schema and engine contracts for STEM, law, medicine, languages, and humanities. |
| **Q-03** | **Cognitive Hermeticity** | Prevent premature solution leaks; zero false competence via strict diagnostic rubrics. |
| **Q-04** | **Anti-Burnout Safety** | Ethical pacing governor mitigating toxic involution (*neijuan*) through automatic cooldown pauses. |
| **Q-05** | **Context Budgeting ($O(1)$ RAM)** | Bounded context memory for LLMs and headless frontends by loading only 1 active shard at a time. |

---

## 1.3 Stakeholders

* **Autonomous Coding Agents**: Use HGD as an agent skill to deconstruct corpuses, synthesize shards, and tutor learners headlessly.
* **Frontend UI Developers**: Build learning apps by strictly consuming the standardized HGD JSON specifications.
* **Human Learners**: Optimize learning speed and permanent retention through active cognitive gradient descent.
