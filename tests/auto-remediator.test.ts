import { describe, it, expect } from "bun:test";
import { AutoRemediator } from "../src/validator/auto-remediator.js";
import type { CompetencyNode, AuditViolation } from "../src/types/curriculum.js";

describe("AutoRemediator Suite (Causal Auto-Patcher)", () => {
  const remediator = new AutoRemediator();

  function makeMockNode(overrides: Partial<CompetencyNode> = {}): CompetencyNode {
    return {
      id: "node_test",
      title: "Superposition Dynamics",
      cognitiveLevel: "understand",
      prerequisites: [],
      conceptSummary: "Short concept summary.",
      forwardPass: {
        probeType: "prediction_what_if",
        microPrimer: "Initial short primer.",
        prompt: "Predict outcome of state transformation.",
        groundTruth: "State collapses proportionally upon measurement.",
        expectedMentalModel: ["measurement collapse"],
        options: [
          {
            optionId: "opt_1",
            text: "Equal 50% probability distribution.",
            isCorrect: true,
            causalRationale: "Hadamard gate transforms state evenly.",
          },
        ],
      },
      lossRubric: {
        conceptGapCriteria: ["fails to mention collapse"],
        notationCriteria: ["bra-ket confusion"],
        strategyCriteria: ["classical probability"],
        reasoningCriteria: ["passive measurement"],
      },
      backwardPass: {
        hintLadder: {
          level0Reflective: "Think about the phase.",
          level1Directional: "Look at the Hadamard gate.",
          level2Constraint: "Probability must sum to 1.",
          level3WorkedExample: "Here is the exact calculation.",
        },
        microRemediations: {
          conceptGap: "Review superposition.",
          notationBreakdown: "Check Dirac notation.",
          methodChoice: "Use matrix multiplication.",
          reasoningBug: "Measurement is an active perturbation.",
        },
      },
      ...overrides,
    };
  }

  it("truncates long primers exceeding 50 words down to <= 50 words", () => {
    const longPrimer =
      "This is an excessively long and unnecessarily verbose explanation of quantum superposition that rambles on for sentence after sentence without active cognitive chunking or respect for the phonological loop budget of the human brain, repeating itself endlessly until it far surpasses fifty words in total length and causes cognitive overload for any student attempting to parse it without proper scaffolding.";

    const node = makeMockNode({
      forwardPass: {
        probeType: "prediction_what_if",
        microPrimer: longPrimer,
        prompt: "Predict probability.",
        groundTruth: "50%",
        expectedMentalModel: ["superposition"],
      },
    });

    const violation: AuditViolation = {
      nodeId: node.id,
      ruleId: "WORKING_MEMORY_OVERFLOW",
      severity: "ERROR",
      tier: 1,
      message: "Primer exceeds 50 words",
      remediation: "Truncate primer",
    };

    const patched = remediator.patchViolation(node, violation);
    expect(patched).toBe(true);

    const words = node.forwardPass.microPrimer!.split(/\s+/).filter(Boolean);
    expect(words.length).toBeLessThanOrEqual(50);
    expect(node.workingMemoryBudget?.wordCount).toBe(words.length);
  });

  it("synthesizes balanced 5-axis diagnostic distractors when options are insufficient", () => {
    const node = makeMockNode();
    expect(node.forwardPass.options?.length).toBe(1);

    const violation: AuditViolation = {
      nodeId: node.id,
      ruleId: "INSUFFICIENT_DIAGNOSTIC_OPTIONS",
      severity: "ERROR",
      tier: 1,
      message: "Options < 3",
      remediation: "Add options",
    };

    const patched = remediator.patchViolation(node, violation);
    expect(patched).toBe(true);
    expect(node.forwardPass.options?.length).toBeGreaterThanOrEqual(4);

    const axes = node.forwardPass.options!.filter((o) => !o.isCorrect).map((o) => o.diagnosticAxis);
    expect(axes.length).toBeGreaterThanOrEqual(3);
    expect(new Set(axes).size).toBe(axes.length); // Distinct axes
  });

  it("resolves multiple correct options so exactly one is true", () => {
    const node = makeMockNode({
      forwardPass: {
        probeType: "prediction_what_if",
        prompt: "Test",
        groundTruth: "A",
        expectedMentalModel: ["A"],
        options: [
          { optionId: "opt_1", text: "A", isCorrect: true, causalRationale: "Correct" },
          { optionId: "opt_2", text: "B", isCorrect: true, causalRationale: "Also marked correct" },
        ],
      },
    });

    const violation: AuditViolation = {
      nodeId: node.id,
      ruleId: "INVALID_CORRECT_OPTION_COUNT",
      severity: "ERROR",
      tier: 1,
      message: "2 correct options found",
      remediation: "Ensure 1 correct",
    };

    const patched = remediator.patchViolation(node, violation);
    expect(patched).toBe(true);

    const correctCount = node.forwardPass.options!.filter((o) => o.isCorrect).length;
    expect(correctCount).toBe(1);
    expect(node.forwardPass.options![1].isCorrect).toBe(false);
    expect(node.forwardPass.options![1].diagnosticAxis).toBeDefined();
  });

  it("synthesizes contrasting cases in Block 3 when missing", () => {
    const node = makeMockNode({
      uila: {
        block3_coreMechanics: {
          invariantProperty: "Probability conservation",
          variableComponents: ["state"],
          contrastingCases: [],
        },
      },
    });

    const violation: AuditViolation = {
      nodeId: node.id,
      ruleId: "MISSING_CONTRASTING_CASES",
      severity: "ERROR",
      tier: 1,
      message: "Empty contrasting cases",
      remediation: "Add cases",
    };

    const patched = remediator.patchViolation(node, violation);
    expect(patched).toBe(true);
    expect(node.uila?.block3_coreMechanics?.contrastingCases.length).toBeGreaterThanOrEqual(1);
    const firstCase = node.uila?.block3_coreMechanics?.contrastingCases[0]!;
    expect(firstCase.beginnerMisconception).toContain("Superposition Dynamics");
    expect(firstCase.physicalReality).toContain("Probability conservation");
  });

  it("reports zero patches on already compliant sample curricula", () => {
    const report = remediator.remediate("./examples/sample-curriculum", { dryRun: true });
    expect(report.initialScore).toBe(100);
    expect(report.finalScore).toBe(100);
    expect(report.resolvedViolations).toBe(0);
  });
});
