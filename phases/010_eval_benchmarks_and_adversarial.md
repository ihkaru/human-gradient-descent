# Phase 010: Evaluation Benchmarks & Adversarial Stress Testing

## 1. Objective
Establish an automated evaluation suite to stress test the HGD framework against simulated learner personas, cognitive fatigue, adversarial attempts, and massive synthetic curricula.

---

## 2. Test Personas & Scenarios
1. **The Rational Master**: Answers accurately on first attempt without hints ($\mathcal{L} \le 0.05$).
2. **The Superficial Guesser**: Submits vague keyword associations; tests whether $l_{\text{concept}}$ isolates shallow mental models.
3. **The Syntax Confused**: Has correct mathematical logic but makes off-by-one or notation errors; tests $l_{\text{notation}}$ vs $l_{\text{reasoning}}$.
4. **The Adversarial Prompter**: Attempts prompt injections or non-sequiturs; tests fallback and rejection mechanisms.
5. **Oxford Scale Stress Test**: Ingestion and validation of 10,000 synthetic nodes across 200 shards to verify memory and speed.

---

## 3. Implementation Steps
- [x] Create simulated persona runner in `tests/persona-eval.test.ts`.
- [x] Benchmark schema validation speed ($> 500$ nodes/second).
- [x] Verify memory usage stays below 50MB during large shard navigation.
- [x] Check line limits and zero-mock invariants.

---

## 4. Verification Evidence
- Persona benchmark test suite completes with deterministic results.
