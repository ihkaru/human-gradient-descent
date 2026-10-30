# Phase 003: JSON Schema Formalization & AJV Validator

## 1. Objective
Formalize strict, production-grade JSON Schemas (Draft 2020-12) for the entire HGD ecosystem, ensuring deterministic validation of curricula, shards, learner states, and session telemetry.

---

## 2. Schema Inventory
* `schemas/curriculum-manifest.schema.json`: Root manifest defining metadata, scale metrics, shard directory, and DAG topology.
* `schemas/node-shard.schema.json`: Shard payload defining nodes, Bloom cognitive levels, forward-pass probes, 5-axis loss rubrics, and hint ladders.
* `schemas/learner-state.schema.json`: Learner state vector $\Theta$, confidence, consecutive successes, active frontier, and decay half-life.
* `schemas/session-interaction.schema.json`: Real-time session telemetry tracking forward-pass input, loss classification, and hint escalation.

---

## 3. Implementation Steps
- [x] Author Draft 2020-12 schemas with strict regex patterns, required properties, and bounded numeric ranges.
- [x] Integrate AJV (Another JSON Schema Validator) with `ajv-formats`.
- [x] Build schema validation wrapper in `src/validator/schema-validator.ts`.
- [x] Create test fixtures verifying valid and malformed payloads.

---

## 4. Verification Evidence
- Run `bun test tests/schema-validation.test.ts` to confirm 100% pass on schema compliance.
