import { describe, expect, it } from "bun:test";
import { MarkdownCurriculumCompiler } from "../src/compiler/markdown-compiler.js";
import { SchemaValidator } from "../src/validator/schema-validator.js";

describe("MarkdownCurriculumCompiler Suite", () => {
  const compiler = new MarkdownCurriculumCompiler();
  const validator = new SchemaValidator("./schemas");

  const sampleMarkdown = `
# Relational Database Internals

## Write-Ahead Logging (WAL)
Write-ahead logging dictates that any state modification must be persisted to non-volatile disk in an append-only log before it is applied to page buffers.
The fundamental invariant is atomicity and durability (ACID). If a crash occurs, the recovery manager replays REDO records and rolls back UNDO records.

## B-Tree Index Invariants
A B-Tree of order M guarantees that every internal node (except root) has at least ceil(M/2) children.
The core invariant is that search, insertion, and deletion execute in guaranteed O(log N) time because all leaf nodes reside at equal depth.

## Multi-Version Concurrency Control (MVCC)
MVCC ensures that readers do not block writers and writers do not block readers.
Each transaction reads a consistent snapshot of the database identified by transaction ID watermark.
`;

  it("compiles markdown into valid manifest and shards satisfying schemas", () => {
    const { manifest, shards } = compiler.compile(sampleMarkdown, {
      curriculumId: "db-internals",
      title: "Database Internals",
      domain: "ComputerScience",
      nodesPerShard: 2,
    });

    expect(manifest.curriculumId).toBe("db-internals");
    expect(manifest.scale.totalNodes).toBe(4); // 1 root + 3 sections
    expect(manifest.scale.totalShards).toBe(2); // 4 nodes with 2 per shard = 2 shards
    expect(shards).toHaveLength(2);

    // Validate manifest against schema
    const mRes = validator.validateManifest(manifest);
    expect(mRes.valid).toBe(true);

    // Validate all shards against schema
    for (const shard of shards) {
      const sRes = validator.validateShard(shard);
      expect(sRes.valid).toBe(true);
    }
  });

  it("links prerequisite DAG edges sequentially across sections", () => {
    const { manifest } = compiler.compile(sampleMarkdown, {
      curriculumId: "db-internals",
      title: "Database Internals",
      domain: "ComputerScience",
    });

    expect(manifest.dag.edges.length).toBeGreaterThan(0);
    const edge = manifest.dag.edges[0];
    expect(edge.relationType).toBe("prerequisite");
    expect(edge.from).toContain("db-internals");
    expect(edge.to).toContain("db-internals");
  });
});
