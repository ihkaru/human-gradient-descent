import { describe, it, expect } from "bun:test";
import { MentalTraceEngine } from "../src/engine/mental-trace-engine.js";
import type { CompetencyNode } from "../src/types/curriculum.js";

describe("MentalTraceEngine Suite (Codebase AST Tracing Probes)", () => {
  const engine = new MentalTraceEngine();

  const dummyNode: CompetencyNode = {
    id: "hgd://cs/algorithms/node-001",
    title: "Binary Search Loop Boundary",
    cognitiveLevel: "apply",
    difficultyTier: "2_boundary_perturbation",
    workingMemoryBudget: { wordCount: 20, estimatedReadingSeconds: 3 },
    prerequisites: [],
    conceptSummary: "Binary search boundary invariant.",
    pacing: { timeLimitSeconds: 45, recommendedEpochs: 2, isCheckpoint: false },
    variationProbes: { conceptualVariants: [], proceduralPerturbations: [] },
    forwardPass: {
      probeType: "prediction_what_if",
      readingContext: "Binary search implementation",
      prompt: "Predict return value",
      expectedMentalModel: ["mid", "low", "high"],
      groundTruth: "returns index 2",
    },
    lossRubric: {
      conceptGapCriteria: ["Fails binary search"],
      notationCriteria: ["Ambiguous index notation"],
      strategyCriteria: ["Linear scan heuristic"],
      reasoningCriteria: ["Off by one index error"],
    },
    backwardPass: {
      learningRate: 0.25,
      hintLadder: {
        level0Reflective: "Reflect",
        level1Directional: "Direct",
        level2Constraint: "Constrain",
        level3WorkedExample: "Worked",
      },
      microRemediations: {
        conceptGap: "Remediate concept",
        notationBreakdown: "Check indices",
        methodChoice: "Use divide and conquer",
        reasoningBug: "Step through loop condition",
      },
    },
    sources: [{ sourceRef: "ref", locationTag: "loc" }],
  };

  const codeSnippet = `
function search(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
  `.trim();

  it("generates a formatted code trace challenge with line numbers", () => {
    const challenge = engine.generateTraceChallenge({
      node: dummyNode,
      language: "typescript",
      codeSnippet,
      inputs: { arr: [10, 20, 30, 40, 50], target: 30 },
      tracingTarget: "return_value",
      expectedOutput: "2",
    });

    expect(challenge.codeSnippet).toContain("1 | function search");
    expect(challenge.prompt).toContain("inputs (arr = [10,20,30,40,50], target = 30)");
    expect(challenge.expectedOutput).toBe("2");
    expect(challenge.diagnosticTraps.length).toBeGreaterThan(0);
  });

  it("converges with 0.0 loss on exact mental trace prediction", () => {
    const challenge = engine.generateTraceChallenge({
      node: dummyNode,
      language: "typescript",
      codeSnippet,
      inputs: { arr: [10, 20, 30, 40, 50], target: 30 },
      tracingTarget: "return_value",
      expectedOutput: "2",
    });

    const res = engine.evaluateTrace(challenge, "2");
    expect(res.isCorrect).toBe(true);
    expect(res.totalLoss).toBe(0.0);
    expect(res.lossVector.reasoningBug).toBe(0.0);
  });

  it("detects diagnostic trap and attributes loss to the reasoningBug axis", () => {
    const challenge = engine.generateTraceChallenge({
      node: dummyNode,
      language: "typescript",
      codeSnippet,
      inputs: { arr: [10, 20, 30, 40, 50], target: 30 },
      tracingTarget: "return_value",
      expectedOutput: "2",
      diagnosticTraps: [
        {
          trapName: "off_by_one_index",
          incorrectPrediction: "3",
          axisAffected: "reasoningBug",
          remediation: "Remember 0-based array indexing: arr[2] is 30.",
        },
      ],
    });

    const res = engine.evaluateTrace(challenge, "3");
    expect(res.isCorrect).toBe(false);
    expect(res.detectedTrap).toBe("off_by_one_index");
    expect(res.lossVector.reasoningBug).toBe(0.7);
    expect(res.feedback).toContain("0-based array indexing");
  });
});
