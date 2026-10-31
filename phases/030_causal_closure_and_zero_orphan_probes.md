# Phase 030: Causal Closure & Zero Orphan Entities in Probes

## 1. Objective
Eliminate the *Orphan Probe Entity Fallacy* where an evaluation probe in Block 5 suddenly tests an unannounced technical term, operator, or mathematical constant (e.g. testing the "Hadamard gate" or "$1/\sqrt{2}$" when Blocks 1–4 never introduced what a Hadamard gate does). Testing entities that have no parent definition in the preceding blocks causes immediate disorientation, cognitive split-attention, and learner demoralization.

This phase enforces **Causal Closure (Prinsip Ketuntasan Kausal)**:
Every named entity, operator, parameter, and constant tested in Block 5 must have its physical analog established in Block 2, its mechanistic behavior isolated in Block 3, and its contract symbol deconstructed in Block 4.

---

## 2. Invariants & Pedagogical Rules
1. **Zero Orphan Entity Invariant**:
   No technical term, operator, formula symbol, or constant may appear in Block 5 (question or options) unless it explicitly appeared and was deconstructed in Blocks 1 to 4.
2. **Causal Coherence Over Text Length**:
   The solution to cognitive unfairness is **NOT** creating endlessly long textbooks (which causes working memory exhaustion). The solution is tight, coherent causal closure: every component introduced in the setup has a functional role in the test.
3. **Rigorous Heading & Term Extraction**:
   Compilers must extract actual author formulas, invariant statements, and symbol callouts rather than falling back to placeholder strings.

---

## 3. Implementation Steps
- [x] Fix regex parsing order and raw text extraction in `src/compiler/uila-builder.ts` for Block 3 invariants and Block 4 formulas.
- [x] Enrich `examples/quantum_computing.md` with explicit physical grounding for the Hadamard equalizer lever in Block 2, Block 3, and Block 4.
- [x] Recompile sample curricula into valid 1-node shards verifying causal closure.
- [x] Add the *Causal Closure Invariant* and the 5th self-diagnostic question into `SKILL.md`.

---

## 4. Verification Evidence
```bash
$ bun -e 'const shard = await Bun.file("examples/sample-curriculum/shards/shard_001.json").json(); console.log(shard.nodes[0].uila.block4_notationContract.formulaOrCode);'
H|0\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle
```
Block 5 now tests the exact operator ($H$) and amplitude ($1/\sqrt{2}$) fully grounded in Blocks 2, 3, and 4.
