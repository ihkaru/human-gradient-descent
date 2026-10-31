---
name: human-gradient-descent
description: Adaptive learning engine and curriculum compiler using the Human Gradient Descent paradigm. Deconstructs massive encyclopedic content (Oxford Dictionary scale) into Acyclic Competency DAGs across any domain (STEM, Law, Medicine, Humanities), executing iterative Forward-Pass prediction probes, Bianshi variation challenges, 5-axis Loss Function diagnostic error classification, and Progressive Hint Ladder parameter updates with anti-fatigue safeguards. Use when a user wants to deeply learn, retain, or be quizzed on complex technical, scientific, or massive markdown corpuses without passive reading.
license: MIT
compatibility: Linux, macOS, Windows; Bun >= 1.2.0 or Node >= 22.0.0
metadata:
  author: ihkaru
  version: "1.1.0"
  standard: "agentskills-2026.1"
---

# 🧠 Human Gradient Descent (`human-gradient-descent`)

This skill transforms passive reading into an active mathematical optimization process for human learners across **any knowledge domain** (STEM, Law, Medicine, Languages, Philosophy).

Instead of lecturing, the agent models human understanding as a parameter weight vector $\Theta \in [0.0, 1.0]^D$ across an Acyclic Competency Graph (DAG). The agent executes an iterative optimization loop:
$$\Theta_{t+1} = \Theta_t - \alpha \nabla_\Theta \mathcal{L}$$

---

## ⚡ The 5-Step Optimization & Pacing Loop

```mermaid
flowchart TD
    Start["Ingest Sharded Corpus / Target Node"] --> FP["1. Forward Pass (Prediction Probe)\nUser generates hypothesis BEFORE explanation\n(Working memory budget <= 50 words)"]
    FP --> BV["2. Bianshi Variation Probes\nTest conceptual variants & boundary perturbations"]
    BV --> Eval["3. Loss Evaluation (5-Axis Diagnosis)\nDecompose error into Concept, Prereq, Notation, Strategy, Reasoning"]
    Eval --> Check{"Loss <= 0.05 ?"}
    Check -- Yes --> Update["Update State Vector (+alpha)\nUnlock next frontier node in DAG"]
    Check -- No --> Safety{"Fatigue Score >= 0.7 ?"}
    Safety -- Yes --> Cooldown["Anti-Fatigue Circuit Breaker\nMandatory 3-min cooldown & switch to self_paced"]
    Safety -- No --> BP["4. Backward Pass (Scaffolding)\nProgressive Hint Ladder (T0 -> T1 -> T2 -> T3)"]
    BP --> Retry["User Submits Revised Prediction"]
    Retry --> Eval
```

---

## 🎯 Hard Invariants for Coding Agents

1. **Strict Pre-Testing Policy (Zero Premature Explanation)**:
   * **NEVER** explain a concept, summarize theory, or provide solutions prior to prompting the user for an active forward-pass prediction ($\hat{y}$).
   * Grounded in the *Generation Effect* and *Pre-testing Effect* (*Slamecka & Graf, 1978; Kornell et al., 2009*).

2. **Domain-Agnostic Invariant Extraction**:
   * Deconstruct any subject into: (1) Core Invariant, (2) Boundary Conditions, and (3) Observable States.

3. **Bianshi Variation Probes (*Bianshi Jiaoxue*)**:
   * Test concepts across alternative representations (code, math formulas, visual diagrams, verbal rules).
   * Probe boundary conditions with single-parameter perturbations ($N=0$, inverted conditions).

4. **Anti-Fatigue & Ethical Pacing Governance**:
   * Detect hurried blind guessing ($< 3\text{s}$) and cognitive exhaustion.
   * Enforce neural consolidation cooldowns to prevent burnout and toxic involution (*neijuan*).

5. **Encyclopedic Scale Isolation ($O(1)$ Token Context Budget)**:
   * Curricula of Oxford Dictionary scale are partitioned into independent shards (`shards/shard_XXX.json`).
   * The agent and UI load **only the active shard** into working context.

---

## 🤖 Agent Curriculum Authoring & Synthesis Protocol

When an AI Coding Agent is requested to create, expand, or tutor a curriculum:
1. **Author Markdown with Causal Annotations**:
   Write structured markdown using clean H2 sections and HTML annotations:
   ```markdown
   # Curriculum Title
   Overview text...

   ## Section Title
   <!-- hgd:tier: 2_boundary_perturbation -->
   <!-- hgd:prereqs: ["Prerequisite Section Title"] -->
   <!-- hgd:probe: "Predict: What happens when parameter X approaches zero?" -->
   <!-- hgd:truth: "State Y collapses because invariant Z is violated." -->
   <!-- hgd:models: ["parameter x", "state y", "invariant z"] -->
   <!-- hgd:options: [{"optionId":"opt_a","text":"Hypothesis text","isCorrect":true,"causalRationale":"Detailed rationale..."}] -->
   Section content explaining the concept...
   ```
2. **Compile to Sharded DAG**:
   `bun run cli compile <input.md> -o <output_dir>`
3. **Verify Compliance**:
   `bun run cli validate <output_dir>`
   The resulting JSON shards are immediately ready for consumption by any headless UI or interactive agent session.

---

## 🛠️ CLI & Automated Tooling

* **Synthesize Curriculum from Scratch (Anti-Owl Grounding)**:
  `bun run cli generate "<topic>" -o <curriculum_dir>`
* **Compile Markdown Corpus (Domain-Agnostic)**:
  `bun run cli compile <input.md> -o <curriculum_dir>`
* **Validate Curricula & Shards**:
  `bun run cli validate <curriculum_dir>`
* **Verify DAG Acyclicity & Integrity (Tarjan SCC)**:
  `bun run cli check-dag <curriculum_dir> [--json]`
* **Interactive Learning Session**:
  `bun run cli learn <curriculum_dir>`
* **Inspect Learner State & Frontier**:
  `bun run cli status <curriculum_dir>`

---

## 🖥️ Headless UI Consumer
The generated JSON schemas are decoupled from any specific client. A standalone, zero-backend reference frontend is available in [`examples/reference-ui/`](./examples/reference-ui/). To run:
```bash
bunx serve examples
# Open http://localhost:3000/reference-ui/
```

---

## 📚 Progressive References
* **Master Roadmap & Phases**: [`ROADMAP.md`](./ROADMAP.md)
* **Architecture Standard arc42**: [`docs/architecture/`](./docs/architecture/)
* **Pedagogical Foundations**: [`references/pedagogical-research.md`](./references/pedagogical-research.md)
* **Encyclopedic Sharding**: [`references/encyclopedic-scale-architecture.md`](./references/encyclopedic-scale-architecture.md)
* **Mathematical Loss & Updates**: [`references/mathematical-loss-and-update.md`](./references/mathematical-loss-and-update.md)
* **Scaffolding & Hint Ladder**: [`references/hint-ladder-scaffolding.md`](./references/hint-ladder-scaffolding.md)
