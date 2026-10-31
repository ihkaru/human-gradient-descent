# Phase 029: Interactive Knowledge Subway Map & Cross-Domain Modals

## 1. Objective
Transform the static visual Subway Map into an actionable, interactive exploration engine. When a learner is inspired by a concept and seeks to branch out, clicking any line in the subway map immediately reveals actionable pathways:
- **Depth Spiral Track**: Opens detailed mathematical and systems specifications for advanced rigor.
- **Isomorphic Bridge**: Displays a comparative modal showing how the governing invariant maps directly across disciplines (e.g. Quantum Probability $\leftrightarrow$ Stochastic Matrices).
- **Branch Tracks**: Explains specialized engineering career paths and prerequisite readiness.

---

## 2. Invariants & Interaction Rules
1. **Actionable Affordance Invariant**:
   Every line and node rendered in the subway map must be clickable ($\ge 44\text{px}$ touch envelope) with visual hover/active feedback.
2. **Zero Route Breakage**:
   Clicking a pathway reveals an informative modal dialog without losing active node state or wiping current user progress.

---

## 3. Implementation Steps
- [x] Extend `renderSubwayMap()` in `examples/reference-ui/uila-renderer.js` with click event listeners.
- [x] Add modal container and overlay in `examples/reference-ui/index.html`.
- [x] Style responsive subway map cards and modal dialogs in `examples/reference-ui/uila-heatmap.css`.
- [x] Write hermetic tests for pathway discovery.

---

## 4. Verification Evidence
Clicking on any Subway Track item opens an interactive modal with full invariant mapping details and actionable next steps.
