import { describe, expect, it } from "bun:test";
import { SchemaValidator } from "../src/validator/schema-validator.js";
import type { CurriculumManifest, NodeShard, LearnerState } from "../src/types/curriculum.js";

describe("SchemaValidator Suite", () => {
  const validator = new SchemaValidator("./schemas");

  it("validates a well-formed CurriculumManifest", () => {
    const validManifest: CurriculumManifest = {
      schemaVersion: "2026.1",
      curriculumId: "algorithms-core",
      title: "Core Algorithms & Complexity",
      domain: "ComputerScience",
      version: "1.0.0",
      license: "MIT",
      scale: {
        totalNodes: 2,
        totalShards: 1,
      },
      pacing: {
        defaultMode: "time_bounded",
      },
      shards: [
        {
          shardId: "shard_001",
          filePath: "shards/shard_001.json",
          nodeCount: 2,
          nodeIds: ["hgd://cs/algo/sorting", "hgd://cs/algo/quicksort"],
        },
      ],
      dag: {
        nodes: [
          {
            id: "hgd://cs/algo/sorting",
            shardId: "shard_001",
            title: "Comparison Sorting Invariant",
            cognitiveLevel: "understand",
          },
          {
            id: "hgd://cs/algo/quicksort",
            shardId: "shard_001",
            title: "Quicksort Partitioning",
            cognitiveLevel: "apply",
          },
        ],
        edges: [
          {
            from: "hgd://cs/algo/sorting",
            to: "hgd://cs/algo/quicksort",
            relationType: "prerequisite",
          },
        ],
      },
    };

    const res = validator.validateManifest(validManifest);
    expect(res.valid).toBe(true);
    expect(res.errors).toBeUndefined();
  });

  it("rejects a malformed CurriculumManifest with missing required fields", () => {
    const invalidManifest = {
      schemaVersion: "2026.1",
      curriculumId: "INVALID_UPPERCASE",
    };
    const res = validator.validateManifest(invalidManifest);
    expect(res.valid).toBe(false);
    expect(res.errors && res.errors.length > 0).toBe(true);
  });

  it("validates a well-formed NodeShard", () => {
    const validShard: NodeShard = {
      shardId: "shard_001",
      curriculumId: "algorithms-core",
      nodes: [
        {
          id: "hgd://cs/algo/sorting",
          title: "Comparison Sorting Invariant",
          cognitiveLevel: "understand",
          prerequisites: [],
          conceptSummary: "Comparison sorting has a lower bound of Omega(N log N).",
          forwardPass: {
            probeType: "prediction_what_if",
            prompt: "Predict why decision trees forbid O(N) worst-case comparison sorting.",
            expectedMentalModel: ["decision tree", "permutations", "log n factorial"],
            groundTruth: "A binary decision tree over N! permutations requires depth at least log2(N!).",
          },
          lossRubric: {
            conceptGapCriteria: ["Believes linear search can sort arbitrarily"],
            notationCriteria: ["Confuses Big-O with Big-Omega"],
            strategyCriteria: ["Suggests radix sort when comparison was stipulated"],
            reasoningCriteria: ["Stirling approximation arithmetic error"],
          },
          backwardPass: {
            learningRate: 0.3,
            hintLadder: {
              level0Reflective: "How many leaves must the decision tree have to distinguish N! permutations?",
              level1Directional: "Relate the height of a binary tree to its maximum number of leaves.",
              level2Constraint: "A tree of height h has at most 2^h leaves; set 2^h >= N!.",
              level3WorkedExample: "For N=3, N!=6. Binary tree of height 2 has only 4 leaves (< 6), so height 3 is required.",
            },
            microRemediations: {
              conceptGap: "Information-theoretic lower bound states log2(N!) = Omega(N log N).",
              notationBreakdown: "Omega denotes lower asymptotic bound.",
              methodChoice: "Rely on tree depth inequalities rather than loop counting.",
              reasoningBug: "Review Stirling's approximation: ln(N!) approx N ln N - N.",
            },
          },
        },
      ],
    };

    const res = validator.validateShard(validShard);
    expect(res.valid).toBe(true);
  });

  it("validates a well-formed LearnerState", () => {
    const validState: LearnerState = {
      learnerId: "test-user-01",
      curriculumId: "algorithms-core",
      lastUpdated: new Date().toISOString(),
      globalMastery: 0.5,
      learningRateAlpha: 0.25,
      weights: {
        "hgd://cs/algo/sorting": {
          theta: 0.98,
          confidence: 0.95,
          lastLoss: 0.02,
          attempts: 2,
          consecutiveCorrect: 2,
          lastReviewTimestamp: new Date().toISOString(),
          halfLifeHours: 108.0,
        },
      },
      activeFrontier: ["hgd://cs/algo/quicksort"],
      masteredNodes: ["hgd://cs/algo/sorting"],
    };

    const res = validator.validateState(validState);
    expect(res.valid).toBe(true);
  });
});
