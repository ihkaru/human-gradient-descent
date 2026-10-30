# Phase 020: Automated Tarjan SCC Cycle Resolver & DAG Integrity

## 1. Objective
Ensure mathematical acyclicity and topological integrity across partitioned, encyclopedic-scale curriculum DAGs. Prevent learner frontier queue deadlocks caused by circular prerequisite loops ($A \to B \to C \to A$) using Tarjan's Strongly Connected Components algorithm ($O(V + E)$) combined with Kahn's topological sort.

---

## 2. Invariants & Mathematical Rules
1. **Linear Time & Space Complexity ($O(V + E)$)**:
   Cycle detection and topological ordering must execute linearly with respect to vertices (nodes) and edges, supporting curricula scaling to hundreds of thousands of competency nodes without CPU or RAM degradation.
2. **Exact Cycle Isolation**:
   When a cycle is detected, the engine must isolate the non-trivial SCC ($|SCC| > 1$) and trace the exact circular pathway (e.g. `[A, B, C, A]`) to enable immediate author or agent remediation.
3. **Fail-Fast Compiler Verification**:
   The `MarkdownCurriculumCompiler` must run DAG validation by default. Any circular reference in markdown annotations immediately aborts compilation with typed diagnostics.
4. **Comprehensive Integrity Checks**:
   The validator must detect:
   - Multi-node circular dependency cycles.
   - Self-loop dependencies ($A \to A$).
   - Dangling prerequisite edges referencing non-existent node IDs.

---

## 3. Implementation Steps
- [x] Create `src/validator/dag-cycle-detector.ts` implementing Tarjan's SCC algorithm and Kahn's topological sort.
- [x] Export `DAGCycleDetector` in `src/index.ts`.
- [x] Hook `DAGCycleDetector` into `MarkdownCurriculumCompiler.compile` with option `validateDAG?: boolean`.
- [x] Add `hgd check-dag <curriculum_dir> [--json]` subcommand to `src/cli.ts`.
- [x] Write hermetic tests in `tests/dag-cycle-detector.test.ts` covering linear DAGs, diamond DAGs, direct 2-node cycles, 3-node cycles, self-loops, dangling edges, and real sample curricula.

---

## 4. Verification Evidence

### CLI Execution on Sample Curricula
```bash
$ bun run src/cli.ts check-dag examples/sample-curriculum
✅ DAG Integrity Verified: 5 nodes, 6 edges.
   Acyclic: YES (0 cycles) | Strongly Connected Components: 5
   Topological Root: hgd://knowledgebase/quantum-computing/node-001
   Topological Leaf: hgd://knowledgebase/quantum-computing/node-005
```

### JSON Mode for Agent Automation
```bash
$ bun run src/cli.ts check-dag examples/sample-curriculum --json
{
  "isValid": true,
  "hasCycles": false,
  "cycles": [],
  "danglingEdges": [],
  "selfLoops": [],
  "sccCount": 5,
  "topologicalOrder": [
    "hgd://knowledgebase/quantum-computing/node-001",
    "hgd://knowledgebase/quantum-computing/node-002",
    "hgd://knowledgebase/quantum-computing/node-003",
    "hgd://knowledgebase/quantum-computing/node-004",
    "hgd://knowledgebase/quantum-computing/node-005"
  ],
  "diagnostics": []
}
```

### Test Suite Execution
```bash
$ bun test tests/dag-cycle-detector.test.ts
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > verifies a valid linear DAG without cycles
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > verifies a branching diamond (fork-and-join) DAG
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > detects a direct 2-node circular dependency (A <-> B)
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > detects a 3-node cycle in a larger graph
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > detects self-loop edges (A -> A)
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > detects dangling edges pointing to nonexistent nodes
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > validates existing sample curriculum manifest DAGs
✓ DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort) > MarkdownCurriculumCompiler throws error when circular prerequisites are passed
8 pass, 0 fail
```
