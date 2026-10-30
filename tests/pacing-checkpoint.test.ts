import { describe, expect, it } from "bun:test";
import { PacingController } from "../src/engine/pacing-controller.js";
import { CheckpointManager } from "../src/engine/checkpoint-manager.js";
import { LearnerStateTracker } from "../src/engine/state-tracker.js";
import { SchemaValidator } from "../src/validator/schema-validator.js";
import type { CompetencyNode, CurriculumManifest, LearnerState } from "../src/types/curriculum.js";
import type { DiagnosticLossResult } from "../src/engine/loss-engine.js";

describe("Pacing and Checkpoint Suite", () => {
  const validator = new SchemaValidator("./schemas");
  const pacingController = new PacingController();
  const checkpointManager = new CheckpointManager();
  const stateTracker = new LearnerStateTracker();

  const mockManifest: CurriculumManifest = {
    schemaVersion: "2026.1",
    curriculumId: "fast-paced-ml",
    title: "Fast-Paced Machine Learning",
    domain: "AI",
    version: "1.0.0",
    scale: { totalNodes: 3, totalShards: 1 },
    pacing: {
      defaultMode: "time_bounded",
      timeBoundedConfig: {
        defaultNodeTimeoutSeconds: 45,
        totalCurriculumBudgetMinutes: 30,
        autoEscalateHintOnTimeout: true,
        stagnationWarningSeconds: 20,
      },
      checkpoints: [
        {
          checkpointId: "cp-01",
          title: "Milestone: Linear Algebra",
          milestoneNodeId: "hgd://ai/ml/vectors",
          requiredMasteryTheta: 0.9,
        },
      ],
    },
    shards: [{ shardId: "shard_001", filePath: "shards/shard_001.json", nodeCount: 3, nodeIds: ["hgd://ai/ml/vectors", "hgd://ai/ml/gradient", "hgd://ai/ml/backprop"] }],
    dag: {
      nodes: [
        { id: "hgd://ai/ml/vectors", shardId: "shard_001", title: "Vector Operations", cognitiveLevel: "understand" },
        { id: "hgd://ai/ml/gradient", shardId: "shard_001", title: "Gradient Vector", cognitiveLevel: "apply" },
        { id: "hgd://ai/ml/backprop", shardId: "shard_001", title: "Backpropagation", cognitiveLevel: "analyze" },
      ],
      edges: [
        { from: "hgd://ai/ml/vectors", to: "hgd://ai/ml/gradient", relationType: "prerequisite" },
        { from: "hgd://ai/ml/gradient", to: "hgd://ai/ml/backprop", relationType: "prerequisite" },
      ],
    },
  };

  const mockNode: CompetencyNode = {
    id: "hgd://ai/ml/backprop",
    title: "Backpropagation",
    cognitiveLevel: "analyze",
    prerequisites: ["hgd://ai/ml/gradient"],
    conceptSummary: "Chain rule for calculating gradients across neural layers.",
    pacing: {
      timeLimitSeconds: 50,
      recommendedEpochs: 3,
      isCheckpoint: false,
    },
    forwardPass: {
      probeType: "prediction_what_if",
      prompt: "Predict gradient behavior when activation saturates.",
      expectedMentalModel: ["vanishing gradient", "chain rule", "saturation"],
      groundTruth: "Derivatives approach zero, arresting parameter updates upstream.",
    },
    lossRubric: {
      conceptGapCriteria: ["Fails to identify vanishing gradient"],
      notationCriteria: ["Confuses partial derivatives"],
      strategyCriteria: ["Suggests increasing learning rate indefinitely"],
      reasoningCriteria: ["Chain rule multiplication sign error"],
    },
    backwardPass: {
      learningRate: 0.25,
      hintLadder: {
        level0Reflective: "Check the derivative of sigmoid as input magnitude grows.",
        level1Directional: "Notice what happens when multiplying fractions close to zero across layers.",
        level2Constraint: "The derivative of sigmoid maxes out at 0.25.",
        level3WorkedExample: "0.25 * 0.25 * 0.25 = 0.0156, decaying the gradient exponentially.",
      },
      microRemediations: {
        conceptGap: "Saturation drives local gradients toward zero.",
        notationBreakdown: "dLoss/dW = dLoss/dA * dA/dZ * dZ/dW.",
        methodChoice: "Use non-saturating activations like ReLU or LeakyReLU.",
        reasoningBug: "Multiply local gradients sequentially using the chain rule.",
      },
    },
  };

  it("validates manifest schema containing pacing and checkpoint configuration", () => {
    const res = validator.validateManifest(mockManifest);
    expect(res.valid).toBe(true);
  });

  it("PacingController accurately detects countdown timeout and escalation", () => {
    const context = pacingController.resolveNodePacing(mockNode, mockManifest, "time_bounded");
    expect(context.mode).toBe("time_bounded");
    expect(context.timeLimitSeconds).toBe(50);

    const withinTime = pacingController.checkTimeout(30, context);
    expect(withinTime.isTimeout).toBe(false);

    const timedOut = pacingController.checkTimeout(55, context);
    expect(timedOut.isTimeout).toBe(true);
    expect(timedOut.shouldEscalateHint).toBe(true);
  });

  it("CheckpointManager detects divergence and triggers rollback to nearest checkpoint", () => {
    const severePrereqLoss: DiagnosticLossResult = {
      totalLoss: 0.85,
      converged: false,
      primaryClassification: "missing_prerequisite",
      lossVector: {
        conceptGap: 0.6,
        missingPrerequisite: 0.9,
        notationBreakdown: 0.1,
        methodChoice: 0.5,
        reasoningBug: 0.2,
      },
      justification: "Prerequisite gradient foundation missing.",
      matchedCriteria: ["Missing prerequisite"],
    };

    const divergence = checkpointManager.evaluateDivergence(
      mockNode,
      severePrereqLoss,
      1,
      mockManifest
    );

    expect(divergence.diverged).toBe(true);
    expect(divergence.rollbackCheckpointId).toBe("cp-01");
    expect(divergence.rollbackNodeId).toBe("hgd://ai/ml/vectors");

    const state: LearnerState = stateTracker.initializeState("fast-learner", mockManifest);
    state.activeFrontier = ["hgd://ai/ml/backprop"];

    const rollbackEntry = checkpointManager.executeRollback(
      state,
      mockNode.id,
      divergence.rollbackCheckpointId!,
      divergence.rollbackNodeId!,
      divergence.reason!
    );

    expect(rollbackEntry.toCheckpointId).toBe("cp-01");
    expect(state.activeFrontier).toContain("hgd://ai/ml/vectors");
    expect(state.pacingState?.rollbackCount).toBe(1);
    expect(state.pacingState?.rollbackHistory?.length).toBe(1);
  });
});
