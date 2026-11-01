# Phase 034: Automated Causal Remediation Engine (Auto-Patcher)

## 1. Context & Motivation
When authors compile massive markdown corpora or scratch materials, `CurriculumAuditor` rigorously detects Tier 1 and Tier 2 violations such as:
- `WORKING_MEMORY_OVERFLOW` (concept primer > 50 words)
- `INSUFFICIENT_DIAGNOSTIC_OPTIONS` (< 3 diagnostic options)
- `MISSING_DISTRACTOR_AXIS` (options without 5-axis diagnostic mappings)
- `INVALID_CORRECT_OPTION_COUNT` (!= 1 correct option)
- `MISSING_CONTRASTING_CASES` (empty Block 3 misconception pairs)

Manually fixing these violations across hundreds of encyclopedic shards is time-consuming and error-prone. Phase 034 introduces `AutoRemediator`, a deterministic auto-patcher that resolves audit violations systematically while preserving pedagogical invariants.

## 2. Invariants & Rules
1. **Preserve Causal Ground Truth**: The correct answer hypothesis and underlying invariant property must never be corrupted.
2. **Deterministic Working Memory Truncation**: When `wordCount > 50`, extract the core causal assertion sentence while keeping total word count <= 50 words.
3. **Balanced 5-Axis Distribution**: Generated diagnostic options must span distinct axes (`conceptGap`, `missingPrerequisite`, `notationBreakdown`, `methodChoice`, `reasoningBug`).
4. **Idempotence**: Running remediation multiple times on an already compliant curriculum must produce 0 modifications.
5. **Line Limit**: File size strictly `< 350 lines`.

## 3. Architecture
- `src/validator/auto-remediator.ts`:
  - `remediate(targetDir: string, options?: RemediationOptions): RemediationResult`
  - `patchNode(node: CompetencyNode, violations: AuditViolation[]): boolean`
  - `truncatePrimer(primer: string): string`
  - `synthesizeContrastingCases(node: CompetencyNode): ContrastingCase[]`
  - `balanceDiagnosticOptions(node: CompetencyNode): void`
