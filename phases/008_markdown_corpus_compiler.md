# Phase 008: Markdown Corpus Deconstruction & Shard Compiler

## 1. Objective
Build an automated compiler that transforms arbitrary markdown documents, technical specs, or textbook chapters into a fully validated, sharded HGD curriculum meeting all schemas.

---

## 2. Ingestion Pipeline
```
[Raw Markdown / Topic Brief / Text Corpus]
                    │
                    ▼
          AST Header Parser (H1/H2/H3)
                    │
                    ▼
        Atomic Concept Chunking (200-500w)
                    │
                    ▼
     Topological DAG Dependency Inference
                    │
                    ▼
Forward Pass & Loss Rubric Synthesis (LLM / Rule-based)
                    │
                    ▼
      Shard Partitioning (20-50 nodes / shard)
                    │
                    ▼
curriculum-manifest.json + shards/shard_XXX.json
```

---

## 3. Implementation Steps
- [x] Implement `MarkdownCurriculumCompiler` in `src/compiler/markdown-compiler.ts`.
- [x] Extract sections, headings, bullet invariants, and code blocks into discrete nodes.
- [x] Synthesize probe prompts, ground truths, 5-axis rubrics, and hint ladders.
- [x] Partition nodes into shards and generate root `curriculum-manifest.json`.
- [x] Validate output against Draft 2020-12 schemas.

---

## 4. Verification Evidence
- Ingestion of a sample technical markdown document produces valid manifest and shard files.
