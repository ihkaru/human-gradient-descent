# Phase 027: Progressive UILA Stepper & Mobile Viewport Focus

## 1. Objective
Eliminate vertical scroll fatigue on mobile viewports while preserving complete conceptual grounding. When all 5 UILA blocks (including tables and formulas) are rendered simultaneously in an unconstrained vertical stream, mobile users on Chrome Android must scroll through extensive content before reaching the interactive hypothesis cards in Block 5.

This phase introduces a **Progressive UILA Stepper & Collapsible Reader**:
- Learners can navigate step-by-step through Blocks 1 to 4 using tab pills, or collapse them with a single click (*"Focus on Boundary Test"*).
- When collapsed, a compact status pill confirms the grounded invariant, keeping Block 5 directly inside the mobile viewport.

---

## 2. Invariants & UI Ergonomics
1. **Zero Grounding Compromise**:
   Collapsing or stepping through blocks must never delete the underlying content. Novices can inspect any block at any time.
2. **Compact Mobile Viewport Invariant**:
   When entering test mode, the distance from top of node to the first hypothesis card must not exceed 400px on vertical viewports.
3. **Step Navigation Affordance**:
   Provide sequential navigation (`Previous Step` / `Next Step`) for structured reading without cognitive overload.

---

## 3. Implementation Steps
- [x] Extend `examples/reference-ui/uila-renderer.js` with stepper and collapsible tab controls.
- [x] Add stepper navigation styles in `examples/reference-ui/uila-heatmap.css`.
- [x] Add focus mode toggle (*"Collapse Reading / Focus on Test"*) in `examples/reference-ui/app.js`.
- [x] Test responsive viewport scrolling on mobile screen dimensions.

---

## 4. Verification Evidence
All UILA blocks can be toggled between full view and step-by-step tabbed mode, reducing initial mobile vertical height from >900px down to <350px.
