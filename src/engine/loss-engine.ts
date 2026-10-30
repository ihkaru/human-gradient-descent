import type {
  CompetencyNode,
  LossVector,
  LossRubric,
} from "../types/curriculum.js";

export interface DiagnosticLossResult {
  totalLoss: number;
  converged: boolean;
  primaryClassification:
    | "zero_loss"
    | "concept_gap"
    | "missing_prerequisite"
    | "notation_breakdown"
    | "method_choice"
    | "reasoning_bug";
  lossVector: LossVector;
  justification: string;
  matchedCriteria: string[];
}

export class LossEngine {
  private weights = {
    concept: 0.35,
    prereq: 0.25,
    notation: 0.1,
    strategy: 0.15,
    reasoning: 0.15,
  };

  /**
   * Evaluates user attempt against node rubric and expected mental models.
   */
  public evaluateLoss(
    node: CompetencyNode,
    userAttempt: string
  ): DiagnosticLossResult {
    const text = userAttempt.toLowerCase().trim();
    const groundTruth = node.forwardPass.groundTruth.toLowerCase();
    const expectedModels = node.forwardPass.expectedMentalModel.map((m) =>
      m.toLowerCase()
    );
    const rubric: LossRubric = node.lossRubric;

    if (text.length === 0) {
      return {
        totalLoss: 1.0,
        converged: false,
        primaryClassification: "concept_gap",
        lossVector: {
          conceptGap: 1.0,
          missingPrerequisite: 0.5,
          notationBreakdown: 0.2,
          methodChoice: 0.8,
          reasoningBug: 0.8,
        },
        justification: "Empty prediction attempt provided.",
        matchedCriteria: ["Empty response"],
      };
    }

    // Check mental model concept coverage
    let matchedConceptCount = 0;
    for (const model of expectedModels) {
      if (text.includes(model)) {
        matchedConceptCount++;
      }
    }
    const conceptCoverageRatio =
      expectedModels.length > 0
        ? matchedConceptCount / expectedModels.length
        : 1.0;

    // Check exact ground truth or semantic inclusion
    const containsGroundTruth = text.includes(groundTruth);

    // Calculate component losses
    let l_concept = 0.0;
    let l_prereq = 0.0;
    let l_notation = 0.0;
    let l_strategy = 0.0;
    let l_reasoning = 0.0;
    const matchedCriteria: string[] = [];

    if (containsGroundTruth || conceptCoverageRatio >= 0.85) {
      // Near perfect forward pass
      l_concept = 0.0;
      l_prereq = 0.0;
      l_notation = 0.0;
      l_strategy = 0.0;
      l_reasoning = 0.0;
    } else {
      // Evaluate Concept Gap
      l_concept = Math.max(0.0, 1.0 - conceptCoverageRatio);
      if (l_concept > 0.4) {
        matchedCriteria.push(...rubric.conceptGapCriteria);
      }

      // Check criteria matches in user text
      for (const crit of rubric.notationCriteria) {
        if (text.includes(crit.toLowerCase())) {
          l_notation = Math.min(1.0, l_notation + 0.5);
          matchedCriteria.push(`Notation: ${crit}`);
        }
      }

      for (const crit of rubric.strategyCriteria) {
        if (text.includes(crit.toLowerCase())) {
          l_strategy = Math.min(1.0, l_strategy + 0.6);
          matchedCriteria.push(`Strategy: ${crit}`);
        }
      }

      for (const crit of rubric.reasoningCriteria) {
        if (text.includes(crit.toLowerCase())) {
          l_reasoning = Math.min(1.0, l_reasoning + 0.5);
          matchedCriteria.push(`Reasoning: ${crit}`);
        }
      }

      // If concepts are missing, assess missing prerequisite
      if (conceptCoverageRatio < 0.3 && node.prerequisites.length > 0) {
        l_prereq = 0.7;
        matchedCriteria.push(
          `Prerequisite deficit: review parent nodes (${node.prerequisites.join(", ")})`
        );
      }
    }

    const totalLoss = Number(
      (
        l_concept * this.weights.concept +
        l_prereq * this.weights.prereq +
        l_notation * this.weights.notation +
        l_strategy * this.weights.strategy +
        l_reasoning * this.weights.reasoning
      ).toFixed(4)
    );

    const converged = totalLoss <= 0.05;

    // Determine primary classification
    let primary: DiagnosticLossResult["primaryClassification"] = "zero_loss";
    if (!converged) {
      const components = [
        { type: "concept_gap", val: l_concept * this.weights.concept },
        { type: "missing_prerequisite", val: l_prereq * this.weights.prereq },
        { type: "notation_breakdown", val: l_notation * this.weights.notation },
        { type: "method_choice", val: l_strategy * this.weights.strategy },
        { type: "reasoning_bug", val: l_reasoning * this.weights.reasoning },
      ];
      components.sort((a, b) => b.val - a.val);
      primary = components[0].type as DiagnosticLossResult["primaryClassification"];
    }

    const justification = converged
      ? "Forward pass matches target causal schema with negligible error."
      : `Primary divergence stems from ${primary.replace("_", " ")}. Matched ${matchedCriteria.length} diagnostic signals.`;

    return {
      totalLoss,
      converged,
      primaryClassification: primary,
      lossVector: {
        conceptGap: Number(l_concept.toFixed(3)),
        missingPrerequisite: Number(l_prereq.toFixed(3)),
        notationBreakdown: Number(l_notation.toFixed(3)),
        methodChoice: Number(l_strategy.toFixed(3)),
        reasoningBug: Number(l_reasoning.toFixed(3)),
      },
      justification,
      matchedCriteria,
    };
  }
}
