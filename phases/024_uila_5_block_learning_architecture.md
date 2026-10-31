# Phase 024: The Universal Invariant Learning Architecture (UILA 5-Block Framework)

## 1. Objective
Eliminate cognitive paralysis and demoralization caused by ungrounded, zero-shot forward-pass predictions. In machine learning optimization, gradient descent requires disciplined weight initialization (e.g. Xavier/He initialization) to prevent exploding or vanishing gradients. Similarly, human learning requires foundational cognitive grounding before testing causal limits.

This phase establishes the **Universal Invariant Learning Architecture (UILA)**: a strict, domain-agnostic 5-block sequence for every competency unit. Blocks 1 to 4 initialize the intuitive mental model, and Block 5 executes the boundary stress-test (Forward Pass).

---

## 2. Invariants & Cognitive Rules
1. **The 5-Block Sequential Invariant**:
   - **Block 1: Pangkal Anomali (The Ground State & Inadequacy)**: Builds curiosity gap; shows how old method breaks/fails/explodes without introducing jargon.
   - **Block 2: Prototipe Intuitif (Isomorphic Sandbox)**: Physical real-world isomorphic model/sandbox showing proportional dynamics and resolving the deadlock of Block 1.
   - **Block 3: Invarian & Operasi Inti (Core Mechanics)**: Isolates what changes vs what stays invariant, reinforced by Side-by-Side Contrasting Cases (Pemula Salah vs Model Mental Nyata).
   - **Block 4: Notasi Sebagai Kontrak (Minimal Formalization)**: Symbolism/code introduced solely as shorthand/contract, deconstructing terms into their physical meanings.
   - **Block 5: Uji Tegangan Batas (Boundary Stress-Test)**: The Forward Pass prediction probe testing edge conditions ($0, \infty$, inversion, collapse) using Diagnostic MCQ.
2. **Prinsip Monosentris per Sub-bab**:
   Each competency node introduces exactly one mechanistic invariant. Dual mechanisms must be partitioned into separate nodes.
3. **Zero Blind Jargon**:
   No technical symbol or term may appear before its functional need is experienced in Block 1 or 2.

---

## 3. Implementation Steps
- [x] Extend `schemas/node-shard.schema.json` with `uila` schema definition.
- [x] Create `src/types/uila.ts` for UILA block models and contrasting cases.
- [x] Implement `src/compiler/uila-builder.ts` for automated heading extraction (`### 1. Pangkal Anomali` to `### 5. Uji Tegangan Batas`).
- [x] Update `src/compiler/markdown-compiler.ts` to attach parsed UILA structures to synthesized nodes.
- [x] Recompile sample curricula into valid 1-node-per-shard JSON files.
- [x] Build `examples/reference-ui/uila-renderer.js` and `uila-heatmap.css` to render blocks in the reference UI.
- [x] Validate hermetically in `tests/uila-and-expansion.test.ts`.

---

## 4. Verification Evidence
```bash
$ bun test tests/uila-and-expansion.test.ts
✓ UILA & Curriculum Expansion Suite > extracts all 4 foundational UILA blocks from markdown headings [0.57ms]
✓ UILA & Curriculum Expansion Suite > validates NodeShard containing UILA and expansion pathways against Draft 2020-12 schema [0.51ms]
```
