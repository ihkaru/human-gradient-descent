# Phase 033: Tier 3 Adversarial Virtual Novice Simulation & Skill Packaging

## 1. Objective
Establish Tier 3 of the Curriculum Evaluation Suite: Adversarial Virtual Novice Simulation, and package the complete system into the standalone agent skill `hgd-curriculum-auditor`. Tier 3 subjects the authored curriculum to an epistemic boundary test: a simulated reasoning agent stripped of all prior domain knowledge is tasked with solving Block 5 using strictly and exclusively the facts, mappings, and rules stated in Blocks 1 to 4. If the agent is forced to guess due to an unstated axiom, the curriculum fails causal sufficiency.

---

## 2. Invariants & Pedagogical Rules
1. **Zero External Knowledge Assumption**:
   A well-grounded UILA node must be self-sufficient. A simulated novice possessing only common physical intuition and the contents of Blocks 1 to 4 must be able to deductively eliminate all distractors and arrive at the correct hypothesis.
2. **Epistemic Sufficiency Invariant**:
   If Block 5 requires an axiom or formula that was not articulated in Block 3 or Block 4, the node suffers from an Epistemic Sufficiency Breach (`EPISTEMIC_SUFFICIENCY_BREACH`).
3. **Decoupled Auditor Skill**:
   The auditor must exist as an independent agent skill (`hgd-curriculum-auditor`) with its own `SKILL.md`, enabling any coding agent or CI workflow to audit, score, and remediate learning materials.
4. **Line Limit Invariant**:
   All files must strictly remain under 350 lines.

---

## 3. Implementation Steps
- [ ] Implement Tier 3 Virtual Novice check logic and simulation protocol prompt generator in `src/validator/curriculum-auditor.ts`.
- [ ] Create standalone skill directory `/root/.agents/skills/hgd-curriculum-auditor/` and author `SKILL.md`.
- [ ] Document the 3-tier auditing protocol, CLI commands, agent review rubric, and JSON schemas in `SKILL.md`.
- [ ] Ensure all code and documentation strictly comply with zero emoticons and line limit (< 350 lines).

---

## 4. Verification Evidence
- Verification of `bun run src/cli.ts audit <path>` with `--json` output.
- Execution of `bun test` covering Tier 1, Tier 2, and Tier 3 checks.
- Presence of `/root/.agents/skills/hgd-curriculum-auditor/SKILL.md` compliant with Agent Skills 2026.1 standard.
