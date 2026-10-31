# Phase 026: Multi-Dimensional Curriculum Expansion (Depth Spiral, Branching & Subway Map)

## 1. Objective
Establish the macroeconomic curriculum engine that connects atomic UILA nodes into deep, branching, and cross-domain knowledge graphs. When a learner masters a foundational concept and seeks deeper mastery, the system dynamically unrolls multi-dimensional expansion pathways:
1. **Vertical Depth Spiral**: Re-visiting the concept with higher mathematical/production rigor.
2. **Horizontal Branching Tracks**: Elective specializations (e.g. Algorithms vs Hardware).
3. **Lateral Isomorphic Bridges**: Connecting the mastered invariant to completely different domains.
4. **On-Demand Dynamic Synthesis**: Agent-driven procedural generation of child shards on demand.

---

## 2. Invariants & Data Structures
1. **The Fractal Curriculum Invariant**:
   - Macro level: Curriculum DAG (Tracks and dependencies).
   - Meso level: Competency Node with expansion pointers.
   - Micro level: The atomic 5-block UILA unit.
2. **Knowledge Subway Map Representation**:
   Rendered as an interactive transit line map displaying Core tracks, Depth Spiral tracks, and Isomorphic Bridges.

---

## 3. Implementation Steps
- [x] Extend `schemas/node-shard.schema.json` with `expansionPathways`.
- [x] Add `ExpansionPathways`, `ExpansionBranch`, and `IsomorphicBridge` to `src/types/uila.ts`.
- [x] Implement `src/compiler/expansion-builder.ts` for automated track generation.
- [x] Integrate `renderSubwayMap()` in `examples/reference-ui/uila-renderer.js`.
- [x] Wire subway map container in `examples/reference-ui/index.html`.
- [x] Write hermetic tests in `tests/uila-and-expansion.test.ts`.

---

## 4. Verification Evidence
```bash
$ bun test tests/uila-and-expansion.test.ts
✓ UILA & Curriculum Expansion Suite > builds multidimensional expansion pathways with depth spiral and isomorphic bridges [0.12ms]
```
