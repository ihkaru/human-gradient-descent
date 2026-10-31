# Phase 023: Diagnostic Multiple-Choice Hypotheses with Causal Rationales

## 1. Objective
Solve the fragile client-side evaluation dilemma in headless, zero-backend, and offline environments. In pure client-side web architectures, evaluating unconstrained free-form student text requires either:
1. An expensive backend LLM round-trip with latency ($> 1\text{s}$), destroying the fast-paced gradient update cadence.
2. Fragile keyword/regex matching that suffers from high false-positive and false-negative rates.

This phase introduces **Diagnostic Multiple-Choice Hypotheses (Concept Inventories)** directly into the HGD schema and headless engine. Distractors are not trivial multiple-choice options; they are rich, substantive alternative causal hypotheses (*"tidak masalah jika panjang"*) each meticulously mapped to a specific diagnostic error axis ($l_{\text{concept}}$, $l_{\text{prereq}}$, $l_{\text{notation}}$, $l_{\text{strategy}}$, $l_{\text{reasoning}}$).

---

## 2. Invariants & Cognitive Rules
1. **Diagnostic Distractor Invariant**:
   Every distractor must represent a known structural misconception or reasoning failure mode rather than superficial noise. Choosing an option immediately pinpoints the exact cognitive failure axis.
2. **Substantive Causal Rationale**:
   Every option (both correct and distractors) must provide a comprehensive, multi-sentence causal explanation detailing *why* the hypothesis succeeds or fails.
3. **Dual-Mode Input Ergonomics**:
   - **Primary**: High-contrast, touch-optimized ($\ge 44\text{px}$) diagnostic hypothesis cards for instant selection.
   - **Secondary**: Collapsible free-form text input for learners who wish to type unconstrained predictions or personal reflections before inspecting the options.
   - **Fallback**: Cold-Start button (*"I am New / Need Worked Primer"*) for novice learners encountering concepts for the first time.
4. **Deterministic Zero-Latency Evaluation**:
   Client evaluation executes in $O(1)$ time ($< 1\text{ms}$) without network egress, calculating loss vectors and updating the learner's DAG frontier instantly.
5. **Strict Shard Line Limit ($< 350$ lines)**:
   Because rich diagnostic options expand JSON shard sizes, the compiler maintains a default `nodesPerShard: 2` to ensure 100% compliance with repository line limit invariants.

---

## 3. Implementation Steps
- [x] Extend `schemas/node-shard.schema.json` with `DiagnosticOption` definition.
- [x] Update TypeScript types in `src/types/curriculum.ts`.
- [x] Create modular `src/compiler/options-builder.ts` for option compilation and fallback synthesis.
- [x] Wire options builder into `src/compiler/markdown-compiler.ts`.
- [x] Enrich `examples/quantum_computing.md` with multi-sentence diagnostic options.
- [x] Recompile sample curricula into compliant shards.
- [x] Update Reference Headless UI (`index.html`, `styles.css`, `ui-renderer.js`, `app.js`).
- [x] Add comprehensive test suite in `tests/diagnostic-options.test.ts`.

---

## 4. Verification Evidence

### Test Suite Execution
```bash
$ bun test tests/diagnostic-options.test.ts
✓ Diagnostic MCQ Options Builder Suite > builds fallback diagnostic options when no custom options provided [0.71ms]
✓ Diagnostic MCQ Options Builder Suite > parses custom diagnostic options from annotations [0.46ms]
✓ Diagnostic MCQ Options Builder Suite > compiler emits diagnostic options on generated node shards validating against schema [134.95ms]

 3 pass
 0 fail
Ran 3 tests across 1 file.
```

### Full Repository Integrity
```bash
$ bun test && bun run check:types && bun run check:lines
35 pass across 9 files (0 fail)
TypeScript: clean (0 errors)
All 94 files comply with line limit (< 350 lines).
```
