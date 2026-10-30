# Phase 019: Agent Synthesis Prompt Protocol

## 1. Objective
Establish the formal prompt and schema protocol empowering AI Coding Agents (such as Claude Code, Hermes, Antigravity) to act as high-fidelity curriculum synthesizers. Enable agents to generate authentic forward-pass prediction probes, expected causal mental models, and 5-axis loss rubrics, moving beyond static regex heuristics.

---

## 2. Invariants & Agent Workflow
When an AI Coding Agent is tasked with compiling or updating an HGD curriculum from raw documents:
1. **The Generation-Effect Rule**:
   The agent must draft challenge prompts asking the learner to predict behavior *before* reading definitions.
2. **The 5-Axis Rubric Contract**:
   For every competency node, the agent must define:
   - `conceptGapCriteria`: Specific, domain-grounded misconceptions (not generic platitudes).
   - `notationCriteria`: Ambiguous terms, units, or symbol confusions.
   - `strategyCriteria`: Suboptimal or brute-force methods.
   - `reasoningCriteria`: Common calculation, boundary, or off-by-one errors.
3. **Working Memory Budget**:
   Prompts must remain $\le 50$ words ($\le 3$ seconds reading time).

---

## 3. Standard Agent Annotation Syntax
Agents can embed metadata directly into markdown source files using HTML comment annotations:
```markdown
## Section Title
<!-- hgd:tier: 2_boundary_perturbation -->
<!-- hgd:prereqs: ["Parent Section A", "Parent Section B"] -->
<!-- hgd:probe: "Predict: What happens when parameter X is reduced to zero?" -->
<!-- hgd:truth: "The system transitions to state Y because of invariant Z." -->
<!-- hgd:models: ["parameter x", "state y", "invariant z"] -->
Body text explaining the concept...
```

---

## 4. Implementation Steps
- [x] Define annotation parser in `MarkdownCurriculumCompiler`.
- [x] Document synthesis guidelines in `SKILL.md`.
- [x] Provide complete annotated references in `examples/quantum_computing.md` and `examples/contract_law_basics.md`.

---

## 5. Verification Evidence
- Recompiled curricula preserve all agent-synthesized probes and ground truths with 100% schema compliance.
