import { describe, it, expect } from "bun:test";
import { TopicCurriculumSynthesizer } from "../src/compiler/topic-synthesizer.js";
import { SchemaValidator } from "../src/validator/schema-validator.js";
import { DAGCycleDetector } from "../src/validator/dag-cycle-detector.js";
import { resolve } from "node:path";

describe("TopicCurriculumSynthesizer Suite (Scratch Material Generator)", () => {
  const synthesizer = new TopicCurriculumSynthesizer();
  const validator = new SchemaValidator(resolve("./schemas"));
  const cycleDetector = new DAGCycleDetector();

  it("synthesizes a curriculum package from scratch given a simple topic string", () => {
    const pkg = synthesizer.synthesizeFromTopic("Rust Memory Safety", {
      domain: "ComputerScience",
    });

    expect(pkg.manifest.title).toBe("Rust Memory Safety");
    expect(pkg.manifest.domain).toBe("ComputerScience");
    expect(pkg.manifest.scale.totalNodes).toBeGreaterThanOrEqual(3);
    expect(pkg.shards.length).toBeGreaterThanOrEqual(1);

    // Validate against Draft 2020-12 schemas
    const mRes = validator.validateManifest(pkg.manifest);
    expect(mRes.valid).toBe(true);

    for (const shard of pkg.shards) {
      const sRes = validator.validateShard(shard);
      expect(sRes.valid).toBe(true);
    }
  });

  it("ensures every synthesized node includes an anti-owl micro-primer and worked solution", () => {
    const pkg = synthesizer.synthesizeFromTopic("Quantum Superposition", {
      domain: "Physics",
    });

    const firstNode = pkg.shards[0].nodes[0];
    expect(firstNode.forwardPass.microPrimer).toBeDefined();
    expect(firstNode.forwardPass.microPrimer!.length).toBeGreaterThan(20);
    expect(firstNode.backwardPass.hintLadder.level3WorkedExample).toBeDefined();
    expect(firstNode.backwardPass.hintLadder.level3WorkedExample).toContain("Worked Solution");
  });

  it("guarantees acyclicity and valid topological order across synthesized nodes", () => {
    const pkg = synthesizer.synthesizeFromTopic("Economics Monetary Policy");
    const dagRes = cycleDetector.validateManifest(pkg.manifest);

    expect(dagRes.isValid).toBe(true);
    expect(dagRes.hasCycles).toBe(false);
    expect(dagRes.topologicalOrder).toBeDefined();
    expect(dagRes.topologicalOrder!.length).toBe(pkg.manifest.dag.nodes.length);
  });

  it("embeds visual Mermaid flowcharts in Block 2 prototypes for intuitive spatial scaffolding", () => {
    const pkg = synthesizer.synthesizeFromTopic("Thermodynamics Entropy");
    expect(pkg.markdown).toContain("```mermaid");
    expect(pkg.markdown).toContain("flowchart");

    for (const shard of pkg.shards) {
      for (const node of shard.nodes) {
        expect(node.uila?.block2_intuitivePrototype?.isomorphicMapping).toContain("flowchart");
      }
    }
  });
});
