# 1. Introduction and Goals

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `d1fa162` (branch: `main`)
> - **Verified Timestamp**: `2026-10-30T20:12:51+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

The **Human Gradient Descent (HGD)** platform formulates human learning as an active, high-velocity parameter optimization loop:
$$\Theta_{t+1} = \Theta_t - \alpha \nabla_\Theta \mathcal{L}$$

Rather than passive consumption, HGD treats the human brain analogously to a neural network during fast-paced pretraining and fine-tuning: executing rapid forward-pass predictions, computing multidimensional diagnostic loss, and updating internal cognitive weights with checkpoint and rollback guarantees.

---

## 1.1 Requirements Overview

| ID | Requirement | Description |
|:---|:---|:---|
| **REQ-01** | **Prediction-First Forward Pass** | Strict generation-effect enforcement; no explanatory text is delivered before active prediction. |
| **REQ-02** | **5-Axis Diagnostic Loss** | Isolate errors into Concept Gap, Missing Prerequisite, Notation, Strategy, and Reasoning. |
| **REQ-03** | **Dual Pacing Modes** | Support both `time_bounded` (sprint/fast-paced training) and `self_paced` (deep mastery) curricula. |
| **REQ-04** | **Checkpoints & Rollbacks** | Save stable cognitive checkpoints; rollback frontier upon severe loss spikes or misconception divergence. |
| **REQ-05** | **Encyclopedic Partitioning** | Support Oxford Dictionary scale ($> 50,000$ nodes) via lightweight manifests and decoupled shards. |
| **REQ-06** | **Pure JSON UI Contract** | Output deterministic, self-contained JSON consumed directly by web/mobile frontends without custom server logic. |

---

## 1.2 Quality Goals (Q42 Model)

| Priority | Quality Attribute | Motivation / Metric |
|:---|:---|:---|
| **Q-01** | **High Velocity (Fast-Paced)** | Rapid forward-backward passes ($30\text{s}-90\text{s}$ per cycle in timed mode) maximizing retention epochs. |
| **Q-02** | **Cognitive Hermeticity** | Prevent premature solution leaks; zero false competence via strict diagnostic rubrics. |
| **Q-03** | **Divergence Resilience** | Catastrophic forgetting mitigation via automatic rollback to verified milestone checkpoints. |
| **Q-04** | **Context Budgeting ($O(1)$ RAM)** | Bounded context memory for LLMs and headless frontends by loading only 1 active shard at a time. |

---

## 1.3 Stakeholders

* **AI Coding Agents**: Ingest arbitrary markdown or codebases, compile sharded curricula, and drive interactive tutoring sessions.
* **Frontend UI Developers**: Build web/mobile learning experiences by strictly consuming the standardized HGD JSON specifications.
* **Human Learners**: Optimize learning speed and permanent retention through active cognitive gradient descent.
