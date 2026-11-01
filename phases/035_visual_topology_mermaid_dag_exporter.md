# Phase 035: Visual Topology & Mermaid DAG Exporter

## 1. Context & Motivation
Understanding the topological progression and prerequisite dependencies of an HGD curriculum is critical for curriculum designers, educators, and learners. While the reference UI provides a runtime subway map, documentation, CI/CD reports, and terminal users need a portable, text-native representation.

Phase 035 introduces `DAGExporter`, generating standard GitHub-compatible Mermaid diagrams (`flowchart TD`) and topological summary matrices directly from curriculum manifests and learner states.

## 2. Invariants & Rules
1. **GitHub Markdown Compatibility**: Emits standard ````mermaid flowchart TD` syntax without unescaped characters.
2. **Cognitive Tier Styling**: Nodes are color-coded according to Bloom cognitive levels (`foundational_fluency`, `causal_application`, `compositional_synthesis`).
3. **Learner State Overlay**: When learner state is provided, nodes reflect real-time cognitive status:
   - `[Mastered]` (Emerald green, theta >= 0.8)
   - `[Frontier]` (Cyan blue, ready to learn)
   - `[Locked]` (Slate gray, prerequisites unsatisfied)
4. **Line Limit**: File size strictly `< 350 lines`.

## 3. Architecture
- `src/validator/dag-exporter.ts`:
  - `exportMermaid(manifest: CurriculumManifest, state?: LearnerState): string`
  - `exportMarkdownReport(manifest: CurriculumManifest, state?: LearnerState): string`
  - `formatNodeLabel(node: DAGNode, state?: LearnerState): string`
