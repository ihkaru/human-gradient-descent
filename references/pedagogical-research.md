# Pedagogical Research & Comparative Agent Skill Audit

## 1. Executive Summary

The **Human Gradient Descent (HGD)** agent skill synthesizes modern cognitive learning sciences with mathematical optimization principles. Rather than passive reading or rote quizzing, HGD structures human learning as an iterative optimization loop:
$$\Theta_{t+1} = \Theta_t - \alpha \nabla_{\Theta} \mathcal{L}$$

This document audits the core pedagogical frameworks and existing agent skills that inspire HGD.

---

## 2. The Cognitive Foundations

### 2.1 The Generation & Pre-Testing Effect (Forward Pass)
* **Foundational Studies**: Slamecka & Graf (1978); Kornell, Hays, & Bjork (2009); Richland, Kornell, & Kao (2009).
* **Core Principle**: Actively generating an answer—even if incorrect—primes the learner's cognitive schema, dramatically increasing retention when the error is corrected compared to passive reading.
* **HGD Invariant**: The agent must **never** explain a concept prior to prompting a forward-pass prediction or causal hypothesis from the learner.

### 2.2 Formative Diagnostic Error Taxonomy (Loss Function)
* **Foundational Studies**: Brown & Burton (1978) *Diagnostic Models for Procedural Bugs*; VanLehn (1990) *Mind Bugs*.
* **Core Principle**: Binary feedback ("Correct" / "Incorrect") provides zero gradient. True cognitive optimization requires isolating the *exact dimension of divergence*.
* **5-Axis Diagnostic Loss Components**:
  1. **Concept Gap ($\mathcal{L}_{\text{concept}}$)**: Fundamental absence or inversion of the underlying mental model.
  2. **Missing Prerequisite ($\mathcal{L}_{\text{prereq}}$)**: Upstream competency in the DAG is deficient.
  3. **Notation Breakdown ($\mathcal{L}_{\text{notation}}$)**: Terminology or symbolic syntax mismatch despite correct intuition.
  4. **Method Choice ($\mathcal{L}_{\text{strategy}}$)**: Selected an inappropriate algorithm, theorem, or heuristic.
  5. **Reasoning Bug ($\mathcal{L}_{\text{reasoning}}$)**: Correct strategy, but localized execution slip in deductive steps.

### 2.3 Scaffolding & Zone of Proximal Development (Backward Pass)
* **Foundational Studies**: Vygotsky (1978); Wood, Bruner, & Ross (1976).
* **Core Principle**: Interventions must adhere to the *Minimal Necessary Intervention* principle. Handing out answers collapses the learning rate ($\alpha \to 0$); over-challenging causes divergence ($\alpha \to \infty$).

---

## 3. Comparative Audit of Existing Agent Skills

| Skill & Author | Core Pedagogical Analogy | Alignment with HGD | Key Architectural Contribution |
|:---|:---|:---|:---|
| **Human Skill Tree** (`human-skill-tree`) | Active Recall & Pre-Testing | Forward Pass ($\hat{y}$) | Strict "test before explaining" policy; acyclic progression. |
| **teach-me** (Magnus Hedemark / `magnus919`) | Teach $\to$ Attempt $\to$ Check $\to$ Feedback | Loop Orchestration | Explicit distinction between minor slip, deep misconception, and missing prereq. |
| **teach** (Helder Burato Berto / `helderberto`) | Minimal Necessary Knowledge (MNK) | Learning Rate ($\alpha$) | Enforces micro-lessons to avoid exceeding working memory limits. |
| **education-agent-skills** (Gareth Manning) | Progressive Hint Ladder | Backward Pass ($\Delta \Theta$) | Multi-tiered hints (Reflective $\to$ Directional $\to$ Constraint $\to$ Worked Example). |
| **Universal Diagnostic Tutor** (`universal-diagnostic-tutor-skill`) | 5-Component Error Isolation | Loss Function ($\mathcal{L}$) | Isolates errors into concept, prerequisite, notation, strategy, and reasoning bugs. |

---

## 4. Synthesis: The HGD Unified Architecture

HGD combines these disparate tools into a mathematically consistent optimization loop:
1. `human-skill-tree` + `teach-me` form the **Forward Pass Probe**.
2. `universal-diagnostic-tutor-skill` forms the **5-Axis Loss Vector Evaluator**.
3. `helderberto/teach` regulates the **Dynamic Learning Rate $\alpha$**.
4. `gareth-manning/education-agent-skills` governs the **Backward Pass Hint Ladder**.
5. All operations are backed by an **Oxford Dictionary-scale Sharded DAG Schema**.
