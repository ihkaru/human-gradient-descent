# Phase 031: Tier 1 Deterministic AST, Causal Closure & Orphan Entity Linter

## 1. Objective
Establish Tier 1 of the Curriculum & Learning Material Evaluation Suite: a deterministic, sub-20ms AST static linter. This tier provides mathematical guarantees on curriculum validity prior to learner exposure or expensive LLM-based evaluations. It enforces JSON schema compliance, acyclic DAG topology via Tarjan's SCC algorithm, phonological working memory word counts (<= 50 words per concept primer), Causal Closure (Zero Orphan Probe Entities), 5-axis diagnostic multiple-choice hypothesis completeness, and Block 3 contrasting cases presence.

---

## 2. Invariants & Pedagogical Rules
1. **Deterministic Execution (< 20ms)**:
   Tier 1 must execute completely offline with zero network calls and zero probabilistic LLM inference, ensuring instant CI/CD feedback.
2. **Causal Closure AST Invariant**:
   Any technical term, proper noun, symbol, or mathematical operator tested in Block 5 (prompt or option hypotheses) must have lexical representation in Blocks 1 to 4. Lexical tokens that fail closure are flagged with error `ORPHAN_PROBE_ENTITY`.
3. **Cognitive Load & Working Memory Limit**:
   Preliminary grounding text must not overwhelm phonological working memory. Concept summaries and micro-primers must satisfy `wordCount <= 50`.
4. **Diagnostic Completeness Invariant**:
   Every probe must provide exactly 1 correct hypothesis and at least 2 distractors, each attributed to an explicit diagnostic axis (`conceptGap`, `missingPrereq`, `notationBreakdown`, `methodChoice`, `reasoningBug`) with a causal rationale.
5. **Line Limit Invariant**:
   All files must strictly remain under 350 lines.

---

## 3. Implementation Steps
- [ ] Define `AuditViolation` and `CurriculumAuditReport` contracts in `src/types/curriculum.ts`.
- [ ] Implement `CurriculumAuditor` class in `src/validator/curriculum-auditor.ts` with Tier 1 checks:
  - Schema validation across manifest and shards.
  - Tarjan SCC cycle detection and dangling edge verification.
  - Working memory word count limits.
  - AST entity extraction and causal closure lexical matching.
  - Diagnostic MCQ options completeness (1 correct, >= 2 distractors with axis and rationale).
  - Contrasting cases presence in Block 3.
- [ ] Expose `hgd audit <curriculum_dir> [--strict] [--json]` in `src/cli.ts`.
- [ ] Author comprehensive unit tests in `tests/curriculum-auditor.test.ts`.

---

## 4. Verification Evidence
- `bun test tests/curriculum-auditor.test.ts` passing 100%.
- Terminal execution of `bun run src/cli.ts audit examples/sample-curriculum` yielding valid status.
- Verification that an intentionally corrupted curriculum containing an orphan probe entity fails with exit code 1.
