# Phase 036: High-School Baseline Epistemic Calibration & Interactive Glossary

## 1. Context & Motivation
Learners entering Human Gradient Descent often explore complex technical or scientific domains outside their educational background (e.g., law graduates learning Quantum Computing, or biology graduates learning OS kernel architecture).

Previously, concise word budgets meant for Forward Pass challenge prompts were inadvertently applied to explanatory blocks, causing Blocks 1–4 to become overly terse and terse explanations to leave learners bewildered. Furthermore, ungrounded post-high-school jargon created cognitive friction.

Phase 036 establishes:
1. **The High School (SMA) Epistemic Baseline**: Curricula must assume only standard high school knowledge (basic algebra, basic physics of circuits/force/fluids, general contracts).
2. **Deep & Elucidative Narrative Invariant**: Explanatory blocks (Blocks 1–4) must be detailed, multi-paragraph, and thoroughly grounded with vivid real-world intuition.
3. **Interactive Clickable Glossary (Jembatan Konsep SMA)**: Technical terms are indexed in the compiled JSON shard (`glossary: [{ term, definition, highSchoolAnchor }]`). In the UI, terms become interactive clickable badges that display an instant popover explaining the concept in terms of high school physics, math, or everyday life.

---

## 2. Invariants & Rules

1. **Separation of Concerns: Primer vs Explanatory Blocks**:
   - `forwardPass.microPrimer`: Strict working memory budget ($\le 50$ words) to prevent phonological loop overload during the active challenge.
   - `uila.block1_anomaly` through `block4_notationContract`: Rich, comprehensive, multi-paragraph pedagogical text with step-by-step causal mechanics.
2. **The High-School Anchor Contract**:
   - Every post-SMA technical term (e.g. `Hadamard gate`, `io_uring`, `TLB`, `Consideration`, `DMA`) MUST provide a `highSchoolAnchor` explaining how it relates to concepts taught in high school (e.g., battery switches, water pipes, coin flips).
3. **Deterministic JSON Serialization**:
   - Shards serialize `glossary` entries under each competency node.
4. **Interactive UI Auto-Detection**:
   - The UI renderer automatically cross-references node glossary terms against rendered narrative text, rendering them as interactive badges (`.glossary-term-badge`) without altering the raw text readability.
5. **Line Limits**:
   - All source files remain strictly $< 350$ lines.

---

## 3. Schema & Type Extensions
- `GlossaryTerm`: `{ term: string, definition: string, highSchoolAnchor?: string }`
- Added to `node-shard.schema.json` under `properties.nodes.items.properties.glossary`.
