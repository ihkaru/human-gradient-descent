# Phase 016: Universal Agent Skill Packaging & Headless UI Showcase

## 1. Objective
Package HGD as an autonomous Coding Agent Skill conforming to October 2026 standards, reinforcing the architectural principle that the core product is the **Agent Skill & Engine**, while any frontend UI is simply a decoupled consumer of the resulting JSON schemas.

---

## 2. Invariants
1. **Agent-First Tooling**:
   The engine must be 100% executable headlessly via CLI commands with `--json` output, enabling autonomous coding agents (Claude Code, Hermes, Codex) to run curriculum synthesis and learner evaluation.
2. **Decoupled UI Consumer**:
   Any UI (web, mobile, or terminal TUI) consumes the JSON schema directly:
   - `curriculum-manifest.json` $\to$ Course tree & checkpoint nodes.
   - `shards/shard_XXX.json` $\to$ Active challenges, timers, Bianshi probes, and hint accordions.
   - `learner-state.json` $\to$ Progress bars, radar loss charts, and fatigue indicators.

---

## 3. Implementation Steps
- [x] Maintain `SKILL.md` aligned with agentskills-2026.1 standard.
- [x] Provide a domain-agnostic showcase in `examples/reference-ui/`.
- [x] Author architecture views in `docs/architecture/07_deployment_view.md`.

---

## 4. Verification Evidence
- Run `bun run cli --help` and verify all commands execute with deterministic exit codes.
