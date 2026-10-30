import { describe, it, expect } from "bun:test";
import { DAGCycleDetector } from "../src/validator/dag-cycle-detector.js";
import { MarkdownCurriculumCompiler } from "../src/compiler/markdown-compiler.js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { CurriculumManifest } from "../src/types/curriculum.js";

describe("DAGCycleDetector Suite (Tarjan SCC & Kahn Topological Sort)", () => {
  const detector = new DAGCycleDetector();

  it("verifies a valid linear DAG without cycles", () => {
    const nodes = ["node-1", "node-2", "node-3"];
    const edges = [
      { from: "node-1", to: "node-2" },
      { from: "node-2", to: "node-3" },
    ];

    const result = detector.validate(nodes, edges);
    expect(result.isValid).toBe(true);
    expect(result.hasCycles).toBe(false);
    expect(result.cycles).toHaveLength(0);
    expect(result.sccCount).toBe(3);
    expect(result.topologicalOrder).toEqual(["node-1", "node-2", "node-3"]);
  });

  it("verifies a branching diamond (fork-and-join) DAG", () => {
    const nodes = ["A", "B", "C", "D"];
    const edges = [
      { from: "A", to: "B" },
      { from: "A", to: "C" },
      { from: "B", to: "D" },
      { from: "C", to: "D" },
    ];

    const result = detector.validate(nodes, edges);
    expect(result.isValid).toBe(true);
    expect(result.hasCycles).toBe(false);
    expect(result.topologicalOrder).toBeDefined();
    expect(result.topologicalOrder![0]).toBe("A");
    expect(result.topologicalOrder![3]).toBe("D");
  });

  it("detects a direct 2-node circular dependency (A <-> B)", () => {
    const nodes = ["A", "B"];
    const edges = [
      { from: "A", to: "B" },
      { from: "B", to: "A" },
    ];

    const result = detector.validate(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.hasCycles).toBe(true);
    expect(result.cycles.length).toBeGreaterThanOrEqual(1);
    expect(result.diagnostics.some((d) => d.includes("Circular dependency"))).toBe(true);
    expect(result.topologicalOrder).toBeUndefined();
  });

  it("detects a 3-node cycle in a larger graph", () => {
    const nodes = ["root", "A", "B", "C", "leaf"];
    const edges = [
      { from: "root", to: "A" },
      { from: "A", to: "B" },
      { from: "B", to: "C" },
      { from: "C", to: "A" }, // cycle A -> B -> C -> A
      { from: "C", to: "leaf" },
    ];

    const result = detector.validate(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.hasCycles).toBe(true);
    expect(result.cycles.length).toBe(1);
    const cycle = result.cycles[0];
    expect(cycle.includes("A") && cycle.includes("B") && cycle.includes("C")).toBe(true);
  });

  it("detects self-loop edges (A -> A)", () => {
    const nodes = ["A", "B"];
    const edges = [
      { from: "A", to: "A" },
      { from: "A", to: "B" },
    ];

    const result = detector.validate(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.selfLoops).toContain("A");
  });

  it("detects dangling edges pointing to nonexistent nodes", () => {
    const nodes = ["A", "B"];
    const edges = [
      { from: "A", to: "B" },
      { from: "B", to: "GHOST_NODE" },
    ];

    const result = detector.validate(nodes, edges);
    expect(result.isValid).toBe(false);
    expect(result.danglingEdges.some((e) => e.missingNode === "GHOST_NODE")).toBe(true);
  });

  it("validates existing sample curriculum manifest DAGs", () => {
    const sampleManifestPath = join(process.cwd(), "examples/sample-curriculum/curriculum-manifest.json");
    if (existsSync(sampleManifestPath)) {
      const manifest: CurriculumManifest = JSON.parse(readFileSync(sampleManifestPath, "utf-8"));
      const res = detector.validateManifest(manifest);
      expect(res.isValid).toBe(true);
      expect(res.hasCycles).toBe(false);
      expect(res.topologicalOrder?.length).toBe(manifest.dag.nodes.length);
    }
  });

  it("MarkdownCurriculumCompiler throws error when circular prerequisites are passed", () => {
    const cyclicalMarkdown = `
# Cyclical Test Subject

## Section Alpha
<!-- hgd:prereqs: ["Section Beta"] -->
Alpha relies on Beta.

## Section Beta
<!-- hgd:prereqs: ["Section Alpha"] -->
Beta relies on Alpha.
`;
    const compiler = new MarkdownCurriculumCompiler();
    expect(() => {
      compiler.compile(cyclicalMarkdown, {
        curriculumId: "cycle-test",
        title: "Cyclical Test",
        domain: "Logic",
      });
    }).toThrow("Curriculum DAG validation failed");
  });
});
