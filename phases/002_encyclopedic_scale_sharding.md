# Phase 002: Encyclopedic-Scale Sharding Architecture

## 1. Objective
Design and implement the partitioned sharded DAG architecture capable of scaling to encyclopedic corpuses (e.g., Oxford Dictionary scale, 10,000 to 500,000+ entries) without exceeding LLM context windows or local RAM limits.

---

## 2. Technical Architecture
1. **Root Curriculum Manifest (`curriculum-manifest.json`)**:
   Contains high-level metadata, total node counts, global DAG edges ($u \to v$), and a map of shard file locations. Must remain bounded ($< 100\text{KB}$) by omitting all markdown bodies, questions, and worked examples.
2. **Node Shards (`shards/shard_XXX.json`)**:
   Independent JSON files containing 20–50 cohesive competency nodes. Each shard contains full node definitions, forward pass probes, ground truths, diagnostic rubrics, and hint ladders.
3. **Sparse Learner State (`learner-state.json`)**:
   Stores only active/visited nodes in $\Theta$. Unvisited nodes default to $\theta = 0.0$ implicitly, preventing file bloat.

---

## 3. Implementation Steps
- [x] Define partitioning topology criteria: group nodes by DAG depth and thematic cluster.
- [x] Establish shard file naming standard (`shard_001.json`, `shard_002.json`).
- [x] Implement $O(1)$ memory loading invariant: agent loads only 1 active shard at any given turn.
- [x] Author architectural reference in `references/encyclopedic-scale-architecture.md`.

---

## 4. Verification Evidence
- Load test with 50,000 synthetic nodes partitioned into 1,000 shards.
- Verify root manifest remains $< 100\text{KB}$ and per-shard RAM stays $< 15\text{MB}$.
