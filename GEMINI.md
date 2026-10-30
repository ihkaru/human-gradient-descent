# Repository Architectural Blueprint & Governance (`GEMINI.md`)

> **Repository**: `human-gradient-descent`  
> **Architecture**: Vertical Slice Architecture (VSA) + SOLID + Formative Pedagogy  
> **Standard**: October 2026 Coding Agent Skill Specification  
> **Runtime**: Bun (>= 1.2.0) / Node.js (>= 22.0.0)

---

## 🏛️ Architectural Principles & Invariants

### 1. SOLID & Single Responsibility Principle (SRP)
* Every module and class has only one reason to change.
* Separation of concerns:
  * `src/compiler`: Ingestion of raw markdown into sharded DAG structures.
  * `src/engine`: Forward-pass probes, loss vectors, hint ladders, and state tracking.
  * `src/validator`: Schema validation with Draft 2020-12 compliance.
  * `src/cli.ts`: Clean terminal command-line routing with zero side-effects.

### 2. Encyclopedic-Scale Partitioning Invariant
* Never load or serialize massive curricula as monolithic JSON files.
* Curricula are partitioned into:
  1. `curriculum-manifest.json`: Root metadata and global topological DAG edge list.
  2. `shards/shard_XXX.json`: Sub-graphs of 20–50 nodes containing questions, hints, and rubrics.
  3. `learner-state.json`: Sparse cognitive state vector $\Theta$.

### 3. Strict 350-Line Limit
* Every code file, schema, and documentation file must strictly remain under 350 lines.
* Automated verification script: `bun run check:lines`.

### 4. Zero-Mock Production Invariant
* All production engines, validators, and compilers operate with real data structures and real validation logic.
* Tests are hermetic and parallelizable.

---

## 🗺️ Roadmap & Phase Traceability

Engineering phases are tracked in:
* Master Roadmap: [`ROADMAP.md`](./ROADMAP.md)
* Implementation Phases: [`phases/`](./phases/) (`001_` through `100+`)

---

## 🧪 Verification & Gauntlet Commands

Run the following commands to verify repository compliance:

```bash
# 1. Typecheck TypeScript sources
bun run check:types

# 2. Verify all files strictly obey the < 350 line limit
bun run check:lines

# 3. Execute hermetic unit and integration tests
bun test

# 4. Validate schema definitions against sample curricula
bun run validate examples/sample-curriculum
```
