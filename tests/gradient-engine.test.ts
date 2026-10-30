import { describe, expect, it } from "bun:test";
import { ForwardPassEngine } from "../src/engine/forward-pass.js";
import { LossEngine } from "../src/engine/loss-engine.js";
import { BackwardPassEngine } from "../src/engine/backward-pass.js";
import { LearnerStateTracker } from "../src/engine/state-tracker.js";
import type { CompetencyNode, CurriculumManifest } from "../src/types/curriculum.js";

describe("Gradient Engine Loop Suite", () => {
  const dummyNode: CompetencyNode = {
    id: "hgd://cs/ds/hash-table",
    title: "Hash Collision Resolution",
    cognitiveLevel: "apply",
    prerequisites: ["hgd://cs/ds/array"],
    conceptSummary: "Open addressing vs separate chaining collision strategies.",
    forwardPass: {
      probeType: "prediction_what_if",
      readingContext: "Hash table load factor alpha = n / m.",
      prompt: "Predict what happens to average lookup time if alpha exceeds 0.9 in linear probing.",
      expectedMentalModel: ["clustering", "degradation", "infinite loop"],
      groundTruth: "Primary clustering causes consecutive blocks, degrading lookup from O(1) to O(N).",
    },
    lossRubric: {
      conceptGapCriteria: ["Asserts lookup remains O(1) regardless of load factor"],
      notationCriteria: ["Confuses alpha load factor with hash modulus"],
      strategyCriteria: ["Proposes rehashing without resizing table"],
      reasoningCriteria: ["Miscalculates cluster probe sequence length"],
    },
    backwardPass: {
      learningRate: 0.25,
      hintLadder: {
        level0Reflective: "Think about what happens to empty slots adjacent to filled slots in linear probing.",
        level1Directional: "Consider how contiguous blocks of occupied buckets grow with each collision.",
        level2Constraint: "Primary clustering increases the chance that new keys land in an existing cluster.",
        level3WorkedExample: "If slots 2,3,4,5 are full, any key hashing to 2, 3, 4, or 5 will probe until slot 6.",
      },
      microRemediations: {
        conceptGap: "Linear probing creates primary clustering as load factor approaches 1.0.",
        notationBreakdown: "Load factor alpha = n/m where n is elements and m is total capacity.",
        methodChoice: "When alpha > 0.7, standard practice requires dynamic table doubling and rehashing.",
        reasoningBug: "Probe length grows as (1 + 1/(1 - alpha)^2)/2 for unsuccessful searches.",
      },
    },
  };

  const dummyManifest: CurriculumManifest = {
    schemaVersion: "2026.1",
    curriculumId: "ds-core",
    title: "Data Structures",
    domain: "CS",
    version: "1.0.0",
    scale: { totalNodes: 2, totalShards: 1 },
    shards: [{ shardId: "shard_001", filePath: "shards/shard_001.json", nodeCount: 2, nodeIds: ["hgd://cs/ds/array", "hgd://cs/ds/hash-table"] }],
    dag: {
      nodes: [
        { id: "hgd://cs/ds/array", shardId: "shard_001", title: "Contiguous Array", cognitiveLevel: "remember" },
        { id: "hgd://cs/ds/hash-table", shardId: "shard_001", title: "Hash Collision Resolution", cognitiveLevel: "apply" },
      ],
      edges: [{ from: "hgd://cs/ds/array", to: "hgd://cs/ds/hash-table", relationType: "prerequisite" }],
    },
  };

  it("ForwardPassEngine generates challenge without leaking ground truth", () => {
    const fpEngine = new ForwardPassEngine();
    const challenge = fpEngine.generateChallenge(dummyNode);

    expect(challenge.nodeId).toBe(dummyNode.id);
    expect(challenge.prompt).toContain("Predict what happens");
    expect(challenge.prompt).not.toContain("Primary clustering causes");
  });

  it("LossEngine converges to zero loss when ground truth causal terms are provided", () => {
    const lossEngine = new LossEngine();
    const result = lossEngine.evaluateLoss(
      dummyNode,
      "Primary clustering causes consecutive blocks, degrading lookup from O(1) to O(N)."
    );

    expect(result.converged).toBe(true);
    expect(result.totalLoss).toBeLessThanOrEqual(0.05);
    expect(result.primaryClassification).toBe("zero_loss");
  });

  it("LossEngine detects concept gap when student gives vague or wrong response", () => {
    const lossEngine = new LossEngine();
    const result = lossEngine.evaluateLoss(
      dummyNode,
      "Nothing happens, lookup is always O(1) in a hash table."
    );

    expect(result.converged).toBe(false);
    expect(result.lossVector.conceptGap).toBeGreaterThan(0.5);
    expect(result.primaryClassification).toBe("concept_gap");
  });

  it("BackwardPassEngine escalates hint ladder tiers across consecutive attempts", () => {
    const bpEngine = new BackwardPassEngine();
    const lossEngine = new LossEngine();
    const badLoss = lossEngine.evaluateLoss(dummyNode, "It gets faster.");

    const t0 = bpEngine.generateIntervention(dummyNode, badLoss, 1);
    expect(t0.hintLevel).toBe(0);
    expect(t0.hintText).toBe(dummyNode.backwardPass.hintLadder.level0Reflective);

    const t1 = bpEngine.generateIntervention(dummyNode, badLoss, 2);
    expect(t1.hintLevel).toBe(1);
    expect(t1.hintText).toBe(dummyNode.backwardPass.hintLadder.level1Directional);

    const t2 = bpEngine.generateIntervention(dummyNode, badLoss, 3);
    expect(t2.hintLevel).toBe(2);
    expect(t2.hintText).toBe(dummyNode.backwardPass.hintLadder.level2Constraint);

    const t3 = bpEngine.generateIntervention(dummyNode, badLoss, 4);
    expect(t3.hintLevel).toBe(3);
    expect(t3.hintText).toBe(dummyNode.backwardPass.hintLadder.level3WorkedExample);
  });

  it("LearnerStateTracker unlocks downstream frontier node when prerequisite is mastered", () => {
    const tracker = new LearnerStateTracker();
    const state = tracker.initializeState("student-01", dummyManifest);

    // Initially, only 'array' is in frontier
    expect(state.activeFrontier).toEqual(["hgd://cs/ds/array"]);
    expect(state.masteredNodes).toHaveLength(0);

    // Master 'array' node
    tracker.updateWeight(
      state,
      "hgd://cs/ds/array",
      1.0,
      0.0,
      { conceptGap: 0, missingPrerequisite: 0, notationBreakdown: 0, methodChoice: 0, reasoningBug: 0 },
      dummyManifest
    );

    expect(state.masteredNodes).toContain("hgd://cs/ds/array");
    // Now hash-table prerequisite is satisfied, so it enters active frontier!
    expect(state.activeFrontier).toContain("hgd://cs/ds/hash-table");
  });

  it("LearnerStateTracker applies Ebbinghaus temporal decay after elapsed time", () => {
    const tracker = new LearnerStateTracker();
    const state = tracker.initializeState("student-01", dummyManifest);

    // Set initial mastery
    state.weights["hgd://cs/ds/array"] = {
      theta: 1.0,
      confidence: 1.0,
      lastLoss: 0.0,
      attempts: 2,
      consecutiveCorrect: 2,
      lastReviewTimestamp: new Date("2026-10-01T00:00:00Z").toISOString(),
      halfLifeHours: 72.0,
    };

    // Simulate 72 hours later (1 half-life elapsed)
    const futureDate = new Date("2026-10-04T00:00:00Z");
    const decayedCount = tracker.applyTemporalDecay(state, dummyManifest, futureDate);

    expect(decayedCount).toBe(1);
    expect(state.weights["hgd://cs/ds/array"].theta).toBeCloseTo(0.5, 1);
  });
});
