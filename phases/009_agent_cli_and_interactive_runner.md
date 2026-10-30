# Phase 009: Agent CLI & Interactive Learning Runner

## 1. Objective
Provide a unified, agent-first Command Line Interface (`hgd` / `bun run cli`) enabling both human interactive sessions and headless automated agent invocations.

---

## 2. CLI Command Surface
1. `hgd compile <input.md> -o <out_dir>`: Compiles a raw markdown document into a sharded curriculum.
2. `hgd validate <curriculum_dir>`: Validates all shards and manifests against schemas.
3. `hgd learn <curriculum_dir> [--node <nodeId>]`: Starts an interactive terminal learning session executing the HGD loop.
4. `hgd status <curriculum_dir> [--state <state.json>]`: Displays learner mastery progress, weights vector $\Theta$, and active frontier.

---

## 3. Implementation Steps
- [x] Implement CLI command parser in `src/cli.ts`.
- [x] Format terminal output with clear visual demarcation of Forward Pass, Loss Analysis, and Hint Escalation.
- [x] Support headless JSON output flags (`--json`) for coding agent orchestration.
- [x] Provide clean exit codes: 0 for success, typed error codes for validation failures.

---

## 4. Verification Evidence
- Terminal run: compile -> validate -> learn -> check status completes end-to-end.
