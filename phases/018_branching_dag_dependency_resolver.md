# Phase 018: Branching DAG Dependency Resolver

## 1. Objective
Transition the prerequisite topology from simple 1-dimensional linear chains ($1 \to 2 \to 3$) to genuine multi-parent Directed Acyclic Graphs (*fork & join* branching) supporting parallel study paths and multi-concept prerequisites.

---

## 2. Invariants & Rules
1. **Multi-Parent Prerequisite Mapping**:
   A competency node may depend on zero, one, or multiple upstream parent nodes (e.g. *Quantum No-Cloning* requires both *Qubits & Superposition* AND *Unitary Operations*).
2. **Title-to-ID Resolution**:
   Authors and AI agents can specify prerequisites by human-readable section titles in annotations (`<!-- hgd:prereqs: ["Section A", "Section B"] -->`), which are deterministically resolved to canonical node URIs.
3. **Acyclicity Invariant**:
   The resulting topological edge list must be strictly acyclic. No self-references or circular dependency loops are permitted.

---

## 3. Implementation Steps
- [x] Implement title-to-ID lookup map in `src/compiler/markdown-compiler.ts`.
- [x] Parse `<!-- hgd:prereqs: [...] -->` JSON arrays from markdown sections.
- [x] Fallback to sequential linking only when explicit prerequisites are omitted.
- [x] Verify multi-parent DAG edges in `examples/sample-curriculum/curriculum-manifest.json`.

---

## 4. Verification Evidence
- Verify in `curriculum-manifest.json` that `node-004` possesses 2 prerequisite edges (`node-001` and `node-002`).
