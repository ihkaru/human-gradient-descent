# Agent Operating Instructions (`AGENT.md`)

> **Repository Standard**: October 2026 Coding Agent Skill Specification  
> **Pedagogical Engine**: Human Gradient Descent (HGD) + Universal Invariant Learning Architecture (UILA)  
> **Educational Taxonomy**: Competency-Based Education (CBE) & Instructional Systems Design (ISD)  
> **Runtime**: Bun (>= 1.2.0) / Node.js (>= 22.0.0)

This document defines the strict operating contract, persona invariants, educational taxonomy, and execution workflows for any Coding Agent acting within the **Human Gradient Descent (HGD)** repository.

---

## 🧭 Project Roadmap & Phases Reference

The master engineering roadmap and numbered implementation phases are maintained in:
* **Master Roadmap Index**: [`ROADMAP.md`](./ROADMAP.md)
* **Numbered Phase Directory**: [`phases/`](./phases/) (Phases `001_` through `100+`)
* **Architecture Standard (arc42)**: [`docs/architecture/`](./docs/architecture/)

Whenever an agent is tasked with extending features, synthesizing materials, modifying schemas, or auditing compliance, the agent **MUST** inspect the relevant phase file before generating code.

---

## 🏛️ Standard Educational Taxonomy (Instructional Design & CBE)

To prevent terminological confusion across academic, corporate, and technical domains, agents **MUST** adhere to the formal Instructional Design & Competency-Based Education taxonomy (ADR-009):

| Technical Educational Term | System / Code Equivalent | Prohibited / Ambiguous Terms |
|:---|:---|:---|
| **Program Pembelajaran** (*Learning Program*) | `Curriculum` / `curriculumId` | ❌ *Kurikulum* (too broad) / *Mata Kuliah* (campus-only) |
| **Cetak Biru Instruksional** (*Instructional Blueprint*) | `CurriculumManifest` (`manifest.json`) | ❌ *RPS* (semester-bound) / *Table of Contents* |
| **Peta Jalur Prasyarat Kompetensi** (*Prerequisite Map*) | `dag.nodes` & `dag.edges` | ❌ *Bagan Materi* / *Pohon Bab* |
| **Unit Kompetensi** (*Competency Unit*) | `CompetencyNode` (in Shards) | ❌ *Bab (Chapter)* / *Pertemuan Mingguan* |
| **Tingkat Capaian Kognitif** (*Cognitive Level*) | `cognitiveLevel` & `difficultyTier` | ❌ *Level Nilai* / *Grade Level* |
| **Fase Konstruksi Skema Mental** | Blocks 1 to 4 UILA Sequence | ❌ *Bahan Bacaan Pasif* / *Slide Hafalan* |
| **Asesmen Diagnostik Kasus Batas** | Block 5 (`forwardPass`) | ❌ *Kuis* / *Latihan Soal* / *PR* |
| **Perancah Progresif** (*Progressive Scaffolding*) | `backwardPass` (Hint Ladder $T_0 \to T_3$) | ❌ *Kunci Jawaban* / *Bocoran Pembahasan* |
| **Vektor Penguasaan Kompetensi** | Parameter Weight $\Theta \in [0.0, 1.0]$ | ❌ *Nilai Rapor* / *IPK* |

---

## 📋 The Agent Invariant Contract

### Invariant 1: UILA Grounding Doctrine (Zero Demoralizing Blind Prediction)
* **Trigger**: A user supplies a prompt, topic, or raw corpus asking to learn or synthesize material.
* **Strict Prohibition**: **NEVER** force a learner to make an ungrounded zero-shot prediction from a conceptual vacuum. Blind guessing induces cognitive paralysis and triggers the "Draw the Rest of the Owl" fallacy.
* **Mandatory Agent Action**:
  Every competency node must initialize the learner's mental model sequentially through **Blocks 1 to 4** before executing the Forward Pass:
  - **Block 1 (Pangkal Anomali)**: Expose failure modes of legacy/naive approaches without introducing ungrounded jargon.
  - **Block 2 (Prototipe Intuitif)**: Anchor a real-world physical analog + **Mermaid flowchart** mapping spatial-temporal dynamics.
  - **Block 3 (Invarian & Operasi Inti)**: Isolate the conserved property + Side-by-side **Contrasting Cases Table** (*Pemula Salah* vs *Kenyataan Fisik*).
  - **Block 4 (Notasi Sebagai Kontrak)**: Formalize symbolism/code as shorthand contracts, deconstructing every symbol into its physical meaning.
  - **Block 5 (Uji Tegangan Batas / Forward Pass)**: Active challenge evaluating edge conditions ($0, \infty$, collapse) with 5-axis diagnostic multiple-choice options.

### Invariant 2: Causal Closure & Zero Orphan Probe Entities
* **Trigger**: Synthesizing or auditing Block 5 Forward Pass probes.
* **Strict Prohibition**: Never test an entity, operator, parameter, or constant in Block 5 that was not explicitly grounded in Blocks 1 to 4.
* **Mandatory Action**: If testing an operator (e.g., Hadamard gate or io_uring ring buffer), it **MUST** have its physical analog in Block 2, mechanics in Block 3, and contract in Block 4.

### Invariant 3: Zero-Failure Math Delimiters & Mermaid Diagram Sanitization (ADR-010)
* **Mandatory Formatting Rules**:
  1. **Mermaid Node Labels**: Any mathematical formula or LaTeX symbol inside a Mermaid node label `["..."]` **MUST** be explicitly wrapped in `$$...$$` (e.g., `["Kernel Trap ($$\\tau_{\\text{trap}}$$)"]`). **NEVER** write unescaped raw LaTeX backslashes or curly braces like `(\tau_{trap})` inside Mermaid labels.
  2. **Notation Deconstruction Chips**: All mathematical symbols in `termsDeconstruction` must be wrapped in `$` delimiters (e.g., `$\tau_{\text{switch}}$`, `$\mathcal{O}(1)$`) so KaTeX auto-renders them with zero failure.
  3. **Visual Diagrams First**: Always embed Mermaid diagrams (`flowchart LR`, `stateDiagram-v2`) in Block 2 or Block 3 for dynamic transitions and pipelines.

### Invariant 4: Phonological Working Memory Budget (<= 50 Words)
* **Trigger**: Synthesizing Forward Pass prompts and micro-primers.
* **Mandatory Action**: Challenge prompts must strictly remain $\le 50$ words to prevent overloading the learner's phonological loop during active boundary recall.

### Invariant 5: 5-Axis Diagnostic Loss Decomposition
* **Trigger**: Evaluating a learner's forward-pass response $\hat{y}$.
* **Mandatory Action**:
  Decompose errors across 5 independent diagnostic axes:
  - $l_{\text{concept}} \in [0.0, 1.0]$: Fundamental absence of invariant mental model.
  - $l_{\text{prereq}} \in [0.0, 1.0]$: Deficit in upstream prerequisite node. If $l_{\text{prereq}} > 0.5$, flag parent node for backtracking.
  - $l_{\text{notation}} \in [0.0, 1.0]$: Syntactic/symbolic confusion despite correct intuition.
  - $l_{\text{strategy}} \in [0.0, 1.0]$: Inappropriate method or heuristic choice.
  - $l_{\text{reasoning}} \in [0.0, 1.0]$: Localized deduction or boundary oversight.
  Compute total loss: $\mathcal{L} = \mathbf{w}^T \mathbf{l}$. Convergence requires $\mathcal{L} \le 0.05$ and $\theta \ge 0.8$.

### Invariant 6: Progressive Scaffolding Escalation
* **Trigger**: Loss exceeds mastery threshold ($\mathcal{L} > 0.05$).
* **Mandatory Action**:
  Deliver minimal necessary intervention adhering to the 4-tier Hint Ladder:
  - Attempt 1: **Tier 0 Metacognitive Reflector** (0% credit penalty).
  - Attempt 2: **Tier 1 Directional Clue** (15% penalty).
  - Attempt 3: **Tier 2 Constraint Narrowing** (35% penalty).
  - Attempt 4+: **Tier 3 Isomorphic Worked Example** (60% penalty).

### Invariant 7: Bounded Context Loading ($O(1)$ Token RAM)
* **Trigger**: Managing massive encyclopedic curricula (10,000 to 500,000+ nodes).
* **Mandatory Action**:
  - Read `curriculum-manifest.json` only for topological mapping ($< 100\text{KB}$).
  - Load **only one shard file** (`shards/shard_XXX.json`) into context at any single turn.
  - Never buffer entire encyclopedias into the LLM context window.

---

## 🛠️ Tooling & Command Routing

Agents should use the following commands:
* **Synthesize Complete Curriculum from Topic**:
  ```bash
  bun run cli generate "<topic>" -o <output_dir>
  ```
* **Compile Markdown Corpus into Sharded DAG**:
  ```bash
  bun run cli compile <input.md> -o <output_dir>
  ```
* **Validate Curricula and Shards against JSON Schema Draft 2020-12**:
  ```bash
  bun run cli validate <curriculum_dir>
  ```
* **Run 3-Tier Curriculum Quality Audit (Causal Closure & Working Memory)**:
  ```bash
  bun run cli audit <curriculum_dir> [--strict] [--json]
  ```
* **Auto-Patch Violations Deterministically**:
  ```bash
  bun run cli remediate <curriculum_dir> [--dry-run]
  ```
* **Export Topological DAG (Mermaid Flowchart / Markdown Report)**:
  ```bash
  bun run cli export-dag <curriculum_dir> [--format mermaid|markdown]
  ```
* **Verify DAG Acyclicity & Integrity (Tarjan SCC $O(V+E)$)**:
  ```bash
  bun run cli check-dag <curriculum_dir> [--json]
  ```
* **Run Interactive Terminal Learning Session**:
  ```bash
  bun run cli learn <curriculum_dir>
  ```
* **Inspect Learner Mastery State & Active Frontier**:
  ```bash
  bun run cli status <curriculum_dir>
  ```
* **Serve Reference UI Locally**:
  ```bash
  bun run serve
  # Open http://localhost:3333/reference-ui/
  ```
* **Verify Line Limits (< 350 lines per file)**:
  ```bash
  bun run check:lines
  ```
* **Execute Hermetic Test Suite**:
  ```bash
  bun test
  ```
