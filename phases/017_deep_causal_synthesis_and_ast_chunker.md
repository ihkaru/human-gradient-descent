# Phase 017: Deep Causal Synthesis & AST Chunker

## 1. Objective
Refactor the markdown ingestion pipeline to eliminate superficial boilerplate templates, accurately separate document-level metadata (H1) from substantive competency nodes (H2/H3), and extract domain-agnostic invariant sentences and formula blocks.

---

## 2. Invariants & Rules
1. **Title-Node Disambiguation**:
   The root `# ` header represents the document title (`manifest.title`) and introductory prose (`manifest.description`). It must **never** be instantiated as an empty orphan competency node (`node-001`).
2. **Substantive Node Extraction**:
   Only sections with non-empty bodies and verified causal statements are promoted to competency nodes.
3. **Causal Invariant Sentence Extraction**:
   The chunker scans section bodies for explicit invariant markers (*"invariant"*, *"states that"*, *"requires"*, *"fundamental"*, *"operates via"*), promoting the identified sentence to the node's `groundTruth` and `conceptualVariants.verbal`.
4. **Symbolic & Code Block Harvesting**:
   LaTeX blocks (`$$...$$`) and code fences are automatically parsed into `conceptualVariants.symbolic` and `conceptualVariants.code`.

---

## 3. Implementation Steps
- [x] Refactor `MarkdownCurriculumCompiler.parseMarkdown` in `src/compiler/markdown-compiler.ts`.
- [x] Implement `extractInvariantSentence` heuristic parser.
- [x] Strip HTML annotation comments (`<!-- hgd:... -->`) while extracting authoring metadata.
- [x] Recompile sample curricula and verify zero empty nodes.

---

## 4. Verification Evidence
- Run `bun test tests/markdown-compiler.test.ts` verifying that `# Document Title` is excluded from the node count.
