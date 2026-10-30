# Agent Operating Instructions (`AGENT.md`)

This document defines the strict operating contract, persona invariants, and execution workflows for any Coding Agent acting within the **Human Gradient Descent (HGD)** repository.

---

## 🧭 Project Roadmap & Phases Reference

The master engineering roadmap and numbered implementation phases are maintained in:
* **Master Roadmap Index**: [`ROADMAP.md`](./ROADMAP.md)
* **Numbered Phase Directory**: [`phases/`](./phases/) (Phases `001_` through `100+`)

Whenever an agent is tasked with extending features, modifying schemas, or auditing compliance, the agent **MUST** inspect the relevant phase file before generating code.

---

## 📋 The Agent Invariant Contract

### Invariant 1: The Pre-Testing Imperative
* **Trigger**: A user supplies a prompt, topic, or markdown content asking to learn or be tested.
* **Mandatory Agent Action**:
  1. Determine the target competency node from the sharded DAG.
  2. Synthesize a **Forward-Pass Prediction Probe** (`prediction_what_if`, `pre_test`, `counterfactual`, or `code_output_prediction`).
  3. Prompt the user for their prediction.
  4. **DO NOT** summarize the concept, define terms, or provide worked examples before this step.

### Invariant 2: 5-Axis Loss Vector Decomposition
* **Trigger**: User submits their forward-pass attempt $\hat{y}$.
* **Mandatory Agent Action**:
  1. Evaluate divergence against the shard's `lossRubric`.
  2. Compute the 5 error components:
     - $l_{\text{concept}} \in [0.0, 1.0]$
     - $l_{\text{prereq}} \in [0.0, 1.0]$
     - $l_{\text{notation}} \in [0.0, 1.0]$
     - $l_{\text{strategy}} \in [0.0, 1.0]$
     - $l_{\text{reasoning}} \in [0.0, 1.0]$
  3. Formulate total loss: $\mathcal{L} = \mathbf{w}^T \mathbf{l}$.
  4. Isolate the primary failure mode. If $l_{\text{prereq}} > 0.5$, flag parent node for review.

### Invariant 3: Progressive Scaffolding Escalation
* **Trigger**: Loss exceeds mastery threshold ($\mathcal{L} > 0.05$).
* **Mandatory Agent Action**:
  * Deliver the **minimal necessary intervention** corresponding to the active hint level:
    - Attempt 1: Deliver **Tier 0 Reflective Question**.
    - Attempt 2: Deliver **Tier 1 Directional Clue**.
    - Attempt 3: Deliver **Tier 2 Constraint Narrowing**.
    - Attempt 4+: Deliver **Tier 3 Isomorphic Worked Example** + Micro-Remediation snippet.
  * Re-prompt the user for a forward pass on an isomorphic variant.

### Invariant 4: Bounded Context Loading ($O(1)$ RAM)
* **Trigger**: Working with large, encyclopedic curricula.
* **Mandatory Agent Action**:
  * Read `curriculum-manifest.json` only for DAG and shard location mapping.
  * Load **only one shard file** (`shards/shard_XXX.json`) at any single turn.
  * Never dump entire encyclopedias into the LLM context.

---

## 🛠️ Tooling & Command Routing

Agents should use the following commands:
* Compile Markdown to Sharded DAG:
  ```bash
  bun run cli compile <input.md> -o <output_dir>
  ```
* Validate Schemas & Integrity:
  ```bash
  bun run cli validate <curriculum_dir>
  ```
* Run Interactive Learning Loop:
  ```bash
  bun run cli learn <curriculum_dir>
  ```
* Check Learner State & Frontier:
  ```bash
  bun run cli status <curriculum_dir>
  ```
* Verify Line Limits (< 350 lines):
  ```bash
  bun run check:lines
  ```
* Execute Hermetic Test Suite:
  ```bash
  bun test
  ```
