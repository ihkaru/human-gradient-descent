# Human Gradient Descent (HGD)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Specification: October 2026](https://img.shields.io/badge/Agent_Skill_Spec-October_2026-brightgreen.svg)](./SKILL.md)
[![Runtime: Bun](https://img.shields.io/badge/Runtime-Bun_1.4+-black.svg)](https://bun.sh)

> **Optimizing Human Cognition via Prediction-Driven Active Learning & Diagnostic Error Backpropagation.**

---

## 💡 What is Human Gradient Descent?

In conventional education, learners read passively, listen to lectures, and then take a test. Cognitive science shows this approach is highly inefficient: it produces the *illusion of competence* while resulting in rapid forgetting.

**Human Gradient Descent (HGD)** reimagines learning as a machine learning optimization loop applied to the human brain:
$$\Theta_{t+1} = \Theta_t - \alpha \nabla_\Theta \mathcal{L}$$

1. **Forward Pass ($\hat{y} = f_\Theta(x)$)**: Before receiving an explanation, the human learner is prompted to predict an outcome, generate an explanation, or identify a mechanism (*The Generation & Pre-testing Effect*).
2. **Loss Function ($\mathcal{L}(\hat{y}, y)$)**: The difference between the human's prediction and ground truth is diagnosed across a **5-axis error vector** (Concept Gap, Missing Prerequisite, Notation Breakdown, Strategy Error, Reasoning Bug).
3. **Backward Pass ($\Delta \Theta = -\alpha \nabla \mathcal{L}$)**: The agent provides **Minimal Necessary Intervention** through a **Progressive Hint Ladder** (Reflective Question $\to$ Directional Clue $\to$ Constraint Narrowing $\to$ Worked Example) and adjusts the cognitive weights $\Theta$.
4. **Iterative Convergence**: The cycle repeats until loss converges below the mastery threshold ($\mathcal{L} \le 0.05, \theta \ge 0.95$).

---

## ⚖️ Analogy: Gradient Descent vs. Cognitive Learning

| Component in Gradient Descent | Cognitive Learning Counterpart | Implementation in Existing Agent Skills | HGD Module |
|:---|:---|:---|:---|
| **Input ($x$)** | Problem / Scenario / Challenge | `teach-me` & `helderberto/teach` | `ForwardPassEngine` |
| **Model Output ($\hat{y}$)** | Human active prediction / hypothesis | `human-skill-tree` ("test before explain") | Generative Probes |
| **Ground Truth ($y$)** | Core invariant / verified concept | Corpus of Record / Source Anchor | `sources[].chunks` |
| **Loss Function ($\mathcal{L}$)** | 5-axis diagnostic error classification | `universal-diagnostic-tutor-skill` | `LossEngine` |
| **Learning Rate ($\alpha$)** | Cognitive load / Working memory capacity | `helderberto/teach` (Micro-lessons / ZPD) | Dynamic $\alpha$ Controller |
| **Backward Pass ($\Delta \Theta$)** | Scaffolding / Progressive Hint Ladder | `gareth-manning/education-agent-skills` | `BackwardPassEngine` |
| **Model Weights ($\Theta$)** | Learner's competency schema vector | Persistent mastery state & decay curve | `LearnerStateTracker` |

---

## 📖 Oxford Dictionary-Scale Architecture

To support massive corpuses (thousands of concepts, encyclopedias, or full dictionaries):
* **Partitioned Sharded DAG**: A lightweight root `curriculum-manifest.json` ($< 100\text{KB}$) links global dependency edges across modular `shards/shard_XXX.json` files ($20-50$ nodes each).
* **Constant $O(1)$ Token Overhead**: AI coding agents load only the single active shard into their context window.
* **Sparse State Vector**: Learner states record only visited nodes, preventing bloat.

---

## 🗺️ Master Roadmap & Numbered Phases

The project follows a systematic, expandable roadmap supporting hundreds of implementation phases:
* **Master Roadmap**: [`ROADMAP.md`](./ROADMAP.md)
* **Numbered Phases Directory**: [`phases/`](./phases/) (e.g. [`001_core_mathematical_pedagogy.md`](./phases/001_core_mathematical_pedagogy.md) through `100+`)
* **Agent Operating Instructions**: [`AGENT.md`](./AGENT.md)
* **Skill Specification**: [`SKILL.md`](./SKILL.md)

---

## 🚀 Quickstart

### Prerequisites
* [Bun](https://bun.sh) (v1.2+) installed.

### Installation
```bash
git clone https://github.com/ihkaru/human-gradient-descent.git
cd human-gradient-descent
bun install
```

### CLI Commands
```bash
# Synthesize complete curriculum from scratch (Anti-Owl Grounded)
bun run cli generate "Quantum Computing" -o ./curricula/quantum

# Compile a markdown document into a sharded curriculum
bun run cli compile examples/quantum_computing.md -o ./curricula/quantum

# Validate curriculum shards against JSON schemas
bun run cli validate ./curricula/quantum

# Verify DAG acyclicity and integrity (Tarjan SCC algorithm O(V+E))
bun run cli check-dag ./curricula/quantum

# Launch an interactive learning session
bun run cli learn ./curricula/quantum

# Inspect learner mastery state and active frontier
bun run cli status ./curricula/quantum
```

---

## 🖥️ Headless UI Consumer
The generated JSON schemas are decoupled from the agent engine. A reference, zero-backend frontend is included in [`examples/reference-ui/`](./examples/reference-ui/):
```bash
bunx serve examples
# Open http://localhost:3000/reference-ui/
```

---

## 📄 License
[MIT](./LICENSE) © 2026 ihkaru
