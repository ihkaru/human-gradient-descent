# Phase 022: Cold-Start Anti-Owl Grounding & Scratch Topic Synthesizer

## 1. Objective
Eliminate the *"Draw the Rest of the Owl"* fallacy in Prediction-Driven Active Learning. When a learner encounters a concept for the first time or possesses zero prior knowledge, expecting an ungrounded forward-pass prediction produces cognitive paralysis rather than productive failure. This phase establishes mandatory **Micro-Primers** ($\le 60$ words), an automated **Cold-Start Fast-Track** directly to Worked Solutions, and an autonomous engine (`TopicCurriculumSynthesizer`) that generates pedagogical curricula from scratch.

---

## 2. Invariants & Cognitive Rules
1. **The Grounding Primer Invariant**:
   Every competency node must supply an intuitive physical metaphor or foundational definition (`microPrimer`) before expecting a forward-pass prediction. Jargon must never be introduced without a concrete cognitive anchor.
2. **Cold-Start Fast-Track Invariant**:
   When a learner inputs *"don't know"*, *"blank"*, or signals zero prior knowledge, the system must **NEVER** respond with abstract Socratic questions (Tier 0). It must immediately reveal:
   - **Tier 3 (Worked Solution & Concept Primer)** to establish the mental model.
   - An **Isomorphic Variation Probe** to test whether the explained mechanism was understood.
3. **Non-Truncated Scaffolding Rule**:
   Hint ladders and worked solutions must consist of complete, grammatically sound sentences. Slicing sentences mid-word is strictly prohibited.
4. **Autonomous Synthesis from Scratch**:
   The engine must provide `hgd generate "<topic>" -o <output_dir>`, building an end-to-end curriculum with full grounding from a simple prompt without requiring hand-crafted markdown.

---

## 3. Implementation Steps
- [x] Add `microPrimer` to `schemas/node-shard.schema.json` and `CompetencyNode`.
- [x] Update `MarkdownCurriculumCompiler` with `extractMicroPrimer` and non-truncated hint ladders.
- [x] Build `TopicCurriculumSynthesizer` in `src/compiler/topic-synthesizer.ts`.
- [x] Add `hgd generate "<topic>" -o <output_dir>` to `src/cli.ts`.
- [x] Update reference UI with `#primer-box` and `"I am New / Need Worked Primer"` button.
- [x] Write hermetic tests in `tests/topic-synthesizer.test.ts`.

---

## 4. Verification Evidence

### CLI Generation from Scratch
```bash
$ bun run src/cli.ts generate "Linear Algebra Foundations" -o /tmp/linear-algebra
✅ Synthesized curriculum for 'Linear Algebra Foundations' from scratch!
   Generated 3 nodes across 1 shards into /tmp/linear-algebra
```

### Schema & DAG Validation
```bash
$ bun run src/cli.ts validate /tmp/linear-algebra
✓ Manifest linear-algebra-foundations is valid.
✅ All 1 shards successfully validated against Draft 2020-12 schema.

$ bun run src/cli.ts check-dag /tmp/linear-algebra
✅ DAG Integrity Verified: 3 nodes, 3 edges.
   Acyclic: YES (0 cycles) | Strongly Connected Components: 3
```

### Test Suite Execution
```bash
$ bun test tests/topic-synthesizer.test.ts
✓ TopicCurriculumSynthesizer Suite > synthesizes a curriculum package from scratch given a simple topic string
✓ TopicCurriculumSynthesizer Suite > ensures every synthesized node includes an anti-owl micro-primer and worked solution
✓ TopicCurriculumSynthesizer Suite > guarantees acyclicity and valid topological order across synthesized nodes
3 pass, 0 fail
```
