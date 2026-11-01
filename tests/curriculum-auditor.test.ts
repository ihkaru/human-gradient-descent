import { describe, it, expect } from "bun:test";
import { CurriculumAuditor } from "../src/validator/curriculum-auditor.js";
import type { CompetencyNode, CurriculumManifest, NodeShard } from "../src/types/curriculum.js";

function createValidNode(id: string = "node-001"): CompetencyNode {
  return {
    id,
    title: "Binary Logic Gate",
    cognitiveLevel: "understand",
    difficultyTier: "1_foundational_fluency",
    workingMemoryBudget: { wordCount: 25 },
    prerequisites: [],
    conceptSummary: "A binary switch is either on or off.",
    forwardPass: {
      probeType: "prediction_what_if",
      microPrimer: "A binary switch conducts current only when closed.",
      prompt: "Predict whether current flows when switch S is open.",
      options: [
        {
          optionId: "opt_a",
          text: "No current flows because an open switch creates an air gap breaking circuit continuity.",
          isCorrect: true,
          causalRationale: "Correct: Air gap breaks electrical continuity."
        },
        {
          optionId: "opt_b",
          text: "Current flows because voltage pushes electrons through the insulator.",
          isCorrect: false,
          diagnosticAxis: "conceptGap",
          causalRationale: "Treats air as a conductor under normal operating voltages."
        },
        {
          optionId: "opt_c",
          text: "Current oscillates between 0 and 1 randomly.",
          isCorrect: false,
          diagnosticAxis: "reasoningBug",
          causalRationale: "Confuses deterministic static switch with random generator."
        }
      ],
      expectedMentalModel: ["circuit continuity", "open switch"],
      groundTruth: "No current flows when switch is open."
    },
    uila: {
      block1_anomaly: {
        groundState: "Manual wiring connects lamps directly to batteries.",
        oldWay: "Direct wire connections work well until multiple lamps must be controlled.",
        breakdownPoint: "Direct connections cannot interrupt current without cutting wires."
      },
      block2_intuitivePrototype: {
        physicalObject: "Mechanical lever switch with a metal contact arm.",
        isomorphicMapping: "Moving the lever arm breaks the physical flow of electrons.",
        deadlockResolution: "The lever allows reversible interruption of current flow."
      },
      block3_coreMechanics: {
        invariantProperty: "Continuity of circuit loop.",
        variableComponents: ["switch state S", "current flow"],
        contrastingCases: [
          {
            beginnerMisconception: "Voltage is consumed like fuel.",
            physicalReality: "Voltage provides the potential; current is the rate of charge flow."
          }
        ]
      },
      block4_notationContract: {
        formulaOrCode: "I = V / R",
        minimalFormalization: "Current I is zero when resistance R is infinite.",
        termsDeconstruction: [
          {
            symbol: "I",
            calloutLabel: "Current",
            physicalMeaning: "Flow of electric charge."
          }
        ]
      }
    },
    lossRubric: {
      conceptGapCriteria: ["circuit continuity"],
      notationCriteria: ["Ohm's law"],
      strategyCriteria: ["loop analysis"],
      reasoningCriteria: ["state propagation"]
    },
    backwardPass: {
      learningRate: 0.1,
      hintLadder: {
        level0Reflective: "Does an open gap conduct current?",
        level1Directional: "Look at the physical gap in the switch.",
        level2Constraint: "Current requires a complete closed loop.",
        level3WorkedExample: "An open switch has infinite resistance, so current is 0."
      },
      microRemediations: {
        conceptGap: "Review circuit continuity rules.",
        notationBreakdown: "Check Ohm's law formula.",
        methodChoice: "Trace physical loop.",
        reasoningBug: "Check gap conductivity."
      }
    }
  };
}

describe("CurriculumAuditor Suite (3-Tier Evaluation Engine)", () => {
  const auditor = new CurriculumAuditor();

  it("audits existing sample-curriculum with 100 score and 0 errors", () => {
    const report = auditor.audit("examples/sample-curriculum");
    expect(report.valid).toBe(true);
    expect(report.score).toBe(100);
    expect(report.summary.errors).toBe(0);
    expect(report.totalNodes).toBe(5);
    expect(report.summary.tier1Pass).toBe(true);
  });

  it("audits existing sample-law-curriculum with 100 score and 0 errors", () => {
    const report = auditor.audit("examples/sample-law-curriculum");
    expect(report.valid).toBe(true);
    expect(report.score).toBe(100);
    expect(report.summary.errors).toBe(0);
    expect(report.totalNodes).toBe(4);
    expect(report.summary.tier1Pass).toBe(true);
  });

  it("detects ORPHAN_PROBE_ENTITY when probe tests ungrounded technical term", () => {
    const node = createValidNode("node-orphan");
    node.forwardPass.prompt = "Predict the behavior of the Superconducting Josephson junction under microwave drive.";
    node.forwardPass.options![0].text = "The Josephson junction phase oscillates at frequency f = 2eV/h.";

    const violations = auditor.auditNode(node);
    const orphanViolations = violations.filter(v => v.ruleId === "ORPHAN_PROBE_ENTITY");

    expect(orphanViolations.length).toBeGreaterThanOrEqual(1);
    expect(orphanViolations.some(v => v.message.includes("Josephson"))).toBe(true);
    expect(orphanViolations[0].severity).toBe("ERROR");
    expect(orphanViolations[0].tier).toBe(1);
  });

  it("detects WORKING_MEMORY_OVERFLOW when concept primer exceeds 50 words", () => {
    const node = createValidNode("node-overflow");
    node.forwardPass.microPrimer = "This is an excessively long and verbose preliminary explanation designed specifically to overwhelm the learner's phonological working memory loop by providing far more descriptive narrative than can possibly be retained before answering the challenge prompt, containing more than fifty words in total sentence length right here and now in this specific unit test case.";

    const violations = auditor.auditNode(node, [], [], true);
    const overflow = violations.find(v => v.ruleId === "WORKING_MEMORY_OVERFLOW");

    expect(overflow).toBeDefined();
    expect(overflow?.severity).toBe("ERROR");
    expect(overflow?.tier).toBe(1);
  });

  it("detects INSUFFICIENT_DIAGNOSTIC_OPTIONS when options array has fewer than 3 items", () => {
    const node = createValidNode("node-few-opts");
    node.forwardPass.options = [node.forwardPass.options![0]];

    const violations = auditor.auditNode(node);
    const optViolation = violations.find(v => v.ruleId === "INSUFFICIENT_DIAGNOSTIC_OPTIONS");

    expect(optViolation).toBeDefined();
    expect(optViolation?.severity).toBe("ERROR");
  });

  it("detects INVALID_CORRECT_OPTION_COUNT when multiple options are marked correct", () => {
    const node = createValidNode("node-multi-correct");
    node.forwardPass.options![1].isCorrect = true;

    const violations = auditor.auditNode(node);
    const multiCorrect = violations.find(v => v.ruleId === "INVALID_CORRECT_OPTION_COUNT");

    expect(multiCorrect).toBeDefined();
    expect(multiCorrect?.severity).toBe("ERROR");
  });

  it("detects MISSING_CONTRASTING_CASES when Block 3 contrasting cases are empty", () => {
    const node = createValidNode("node-no-cc");
    node.uila!.block3_coreMechanics!.contrastingCases = [];

    const violations = auditor.auditNode(node, [], [], true);
    const ccViolation = violations.find(v => v.ruleId === "MISSING_CONTRASTING_CASES");

    expect(ccViolation).toBeDefined();
    expect(ccViolation?.severity).toBe("ERROR");
  });

  it("generates Virtual Novice evaluation prompt containing preliminary context and test probe", () => {
    const node = createValidNode("node-novice-prompt");
    const prompt = auditor.generateNoviceEvaluationPrompt(node);

    expect(prompt).toContain("SYSTEM: You are an epistemic novice evaluator");
    expect(prompt).toContain("=== PRELIMINARY CONTEXT ===");
    expect(prompt).toContain("Block 1:");
    expect(prompt).toContain("Block 2:");
    expect(prompt).toContain("=== TEST PROBE ===");
    expect(prompt).toContain("Question: Predict whether current flows when switch S is open.");
    expect(prompt).toContain("VERDICT INSTRUCTION:");
  });

  it("records TIER2_VISUAL_MERMAID_DIAGRAM in passedRules when Mermaid diagram is present", () => {
    const node = createValidNode("node-mermaid");
    node.uila!.block2_intuitivePrototype!.isomorphicMapping =
      "Physical model with diagram:\n```mermaid\nflowchart LR\n  A --> B\n```";

    const manifest: CurriculumManifest = {
      curriculumId: "test-curr",
      title: "Test Curr",
      domain: "stem",
      version: "1.0.0",
      schemaVersion: "2026.1",
      scale: { totalNodes: 1, totalShards: 1 },
      pacing: { defaultMode: "self_paced" },
      dag: { nodes: [{ id: "node-mermaid", title: "Binary Logic Gate", cognitiveLevel: "understand", shardId: "shard_001" }], edges: [] },
      shards: [{ shardId: "shard_001", filePath: "shards/shard_001.json", nodeCount: 1, nodeIds: ["node-mermaid"] }],
    };
    const shard: NodeShard = { shardId: "shard_001", curriculumId: "test-curr", nodes: [node] };

    const report = auditor.audit({ manifest, shards: [shard] });
    expect(report.passedRules).toContain("TIER2_VISUAL_MERMAID_DIAGRAM_node-mermaid");
  });
});
