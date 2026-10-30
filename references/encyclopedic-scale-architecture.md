# Encyclopedic-Scale Architecture (Oxford Dictionary Scale)

## 1. The Scaling Problem

When structuring curricula at massive scales (e.g., an entire legal code, an exhaustive technical encyclopedia, or an Oxford English Dictionary scale corpus with 50,000+ entries):
1. **Context Window Saturation**: An entire curriculum easily exceeds 10,000,000 tokens, which cannot fit into an LLM context window without degrading reasoning quality.
2. **Memory Footprint**: Monolithic JSON files cause quadratic deserialization overhead and memory pressure on local environments.
3. **Blast Radius of Edits**: A single typo in a monolithic 200MB JSON invalidates the entire database.

---

## 2. Partitioned Sharded DAG Topology

HGD resolves this through a **two-tier hierarchical decomposition**:

```
curriculum-manifest.json (Root Manifest: < 100KB)
  ├── Metadata, global domain configs, versioning
  ├── Global DAG Topological Edge List (Node IDs & dependencies only)
  └── Shards Index Catalog
        ├── shards/shard_001.json (Nodes hgd://dict/a/a-001 ... hgd://dict/a/a-050)
        ├── shards/shard_002.json (Nodes hgd://dict/a/a-051 ... hgd://dict/a/a-100)
        └── shards/shard_N.json   (Nodes hgd://dict/z/z-950 ... hgd://dict/z/z-999)
```

### 2.1 The Root Manifest Contract
The `curriculum-manifest.json` contains:
* High-level domain metadata.
* Topological edges (`from` $\to$ `to`).
* Shard partition mapping (`shardId` $\to$ `filePath`, `nodeIds[]`).
* **Zero prose text, zero question bodies, zero hints**.

### 2.2 The Node Shard Contract
Each `shards/shard_XXX.json` file is strictly bounded:
* Contains 20 to 50 cohesive competency nodes.
* File size bounded to $< 250\text{KB}$.
* Fully self-contained: includes the forward-pass probe, ground truth, 5-axis loss rubric, progressive hint ladder, and verbatim citations.

---

## 3. Streaming Agent Execution Invariant

An agent running HGD maintains a constant $O(1)$ memory and token footprint:
1. **Startup**: Agent reads only `curriculum-manifest.json` (or caches the active frontier node IDs).
2. **Active Frontier Discovery**: Agent finds the next target node $u$ whose prerequisite set $\text{Prereq}(u)$ satisfies $\theta \ge 0.95$.
3. **Shard Resolution**: Agent looks up $u$ in the shard index and loads **only that single shard file** (`shards/shard_k.json`).
4. **Execution**: Forward pass, loss calculation, and backward pass occur within the shard scope.
5. **State Persist**: Agent flushes updated weights to `learner-state.json` (sparse dictionary) and discards the shard from RAM.

---

## 4. Sparse Learner State Representation

The learner's state is stored sparsely:
```json
{
  "learnerId": "user-alpha",
  "curriculumId": "oxford-cs-foundations",
  "globalMastery": 0.428,
  "weights": {
    "hgd://cs/algo/dp/memoization": {
      "theta": 0.96,
      "confidence": 0.92,
      "lastLoss": 0.04,
      "attempts": 4,
      "lastReviewTimestamp": "2026-10-30T10:00:00Z"
    }
  }
}
```
Nodes not yet attempted are omitted entirely from `weights`, ensuring state files remain minimal ($< 500\text{KB}$) even across curricula spanning 100,000 nodes.
