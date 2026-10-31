# Phase 025: Learner Effort & Cognitive Convergence Heatmap (GitHub-Style Activity Matrix)

## 1. Objective
Provide concrete, visual confirmation of human effort and neural consolidation (*"effort over innate ability"*). Modelled directly after the GitHub commit contribution calendar, the **Cognitive Convergence Heatmap** maps active training epochs, mastered invariants, and daily review streaks into a zero-dependency, lightweight SVG/CSS grid.

---

## 2. Invariants & Data Structures
1. **Effort Attribution Invariant**:
   Every epoch completed and boundary probe mastered must be recorded with a physical timestamp in `learner-state.json`.
2. **4-Tier Intensity Levels**:
   - **Level 0 (Dark / Inactive)**: Zero interactions on date.
   - **Level 1 (Deep Emerald - #064e3b)**: Initial exploration; UILA Blocks 1 and 2 read.
   - **Level 2 (Medium Emerald - #059669)**: Core synthesis; UILA Blocks 3 and 4 internalized.
   - **Level 3 (Bright Emerald - #10b981)**: Boundary Stress-Test solved with hint ladder scaffolding.
   - **Level 4 (Glowing Emerald - #34d399)**: Zero-loss convergence ($\mathcal{L} \le 0.05$) on first-attempt probe!
3. **Zero-Dependency Headless Implementation**:
   Rendered entirely via native CSS Grid and semantic HTML tags without third-party chart libraries, preserving sub-millisecond render latency on mobile devices.

---

## 3. Implementation Steps
- [x] Extend `schemas/learner-state.schema.json` with `dailyActivityLog`.
- [x] Add `DailyActivityRecord` and `DailyActivityLog` types to `src/types/uila.ts`.
- [x] Implement `renderHeatmap()` in `examples/reference-ui/uila-renderer.js`.
- [x] Integrate `#heatmap-card` in `examples/reference-ui/index.html` and `uila-heatmap.css`.
- [x] Wire state updates in `examples/reference-ui/app.js` upon node mastery.
- [x] Write hermetic validation tests in `tests/uila-and-expansion.test.ts`.

---

## 4. Verification Evidence
```bash
$ bun test tests/uila-and-expansion.test.ts
✓ UILA & Curriculum Expansion Suite > validates LearnerState containing dailyActivityLog for GitHub-style heatmap against schema [0.33ms]
```
