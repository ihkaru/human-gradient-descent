# 12. Glossary

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `d1fa162` (branch: `main`)
> - **Verified Timestamp**: `2026-10-30T20:12:51+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

| Term | Definition in Human Gradient Descent (HGD) |
|:---|:---|
| **Active Frontier** | The subset of competency nodes whose prerequisites have all reached mastery ($\theta \ge 0.95$), but the node itself is not yet mastered. |
| **Backward Pass ($\Delta \Theta$)** | Scaffolding intervention where loss is attributed back to the parameter vector $\Theta$ via the Progressive Hint Ladder and micro-remediation. |
| **Checkpoint** | A designated milestone node in the DAG. Serves as a safe fallback anchor during divergence rollback. |
| **Cognitive Weight ($\theta_i$)** | Scalar in $[0.0, 1.0]$ representing human mental model mastery of competency node $i$. |
| **Divergence Event** | Catastrophic loss spike ($\mathcal{L} > 0.7$) or repeated prerequisite failure indicating a broken foundational schema, triggering a rollback. |
| **Forward Pass ($\hat{y}$)** | The learner's active predictive hypothesis submitted *before* reading explanatory text (Generation Effect). |
| **Learning Rate ($\alpha$)** | Parameter regulating the step size of cognitive weight updates, dynamically bounded by working memory load. |
| **Loss Vector ($\mathbf{l}$)** | 5-axis diagnostic error vector: $[l_{\text{concept}}, l_{\text{prereq}}, l_{\text{notation}}, l_{\text{strategy}}, l_{\text{reasoning}}]^T$. |
| **Progressive Hint Ladder (PHL)** | Scaffolding system of 4 graduated tiers: $T_0$ Reflective Question, $T_1$ Directional Clue, $T_2$ Constraint Narrowing, $T_3$ Worked Example. |
| **Rollback** | Moving the active frontier backward to a previously verified checkpoint to re-train foundational prerequisites. |
| **Shard** | Partitioned JSON file containing 20–50 competency nodes, keeping memory and token overhead bounded to $O(1)$. |
| **Time-Bounded Mode** | High-velocity sprint training mode with active countdown timers per node and automated timeout escalation. |
