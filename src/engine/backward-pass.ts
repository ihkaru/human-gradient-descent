import type {
  CompetencyNode,
  BackwardPassScaffold,
} from "../types/curriculum.js";
import type { DiagnosticLossResult } from "./loss-engine.js";

export interface BackwardPassIntervention {
  hintLevel: number;
  hintText: string;
  remediationSnippet: string;
  learningRateAlpha: number;
  deltaTheta: number;
  feedbackMessage: string;
}

export class BackwardPassEngine {
  private hintPenalties: Record<number, number> = {
    0: 0.0,
    1: 0.15,
    2: 0.35,
    3: 0.6,
  };

  /**
   * Generates the backward pass scaffolding intervention.
   */
  public generateIntervention(
    node: CompetencyNode,
    lossResult: DiagnosticLossResult,
    attemptNumber: number
  ): BackwardPassIntervention {
    const scaffold: BackwardPassScaffold = node.backwardPass;
    const baseAlpha = scaffold.learningRate || 0.25;

    if (lossResult.converged) {
      const deltaTheta = Number((baseAlpha * (1.0 - lossResult.totalLoss)).toFixed(4));
      return {
        hintLevel: 0,
        hintText: "",
        remediationSnippet: "",
        learningRateAlpha: baseAlpha,
        deltaTheta,
        feedbackMessage: "🎉 Convergence Achieved! Mental model aligned with ground truth.",
      };
    }

    // Determine hint level by attempt number:
    // Attempt 1 -> Tier 0 (Reflective)
    // Attempt 2 -> Tier 1 (Directional)
    // Attempt 3 -> Tier 2 (Constraint)
    // Attempt 4+ -> Tier 3 (Worked Example)
    const hintLevel = Math.min(3, Math.max(0, attemptNumber - 1));
    const penalty = this.hintPenalties[hintLevel] || 0.0;

    let hintText = "";
    switch (hintLevel) {
      case 0:
        hintText = scaffold.hintLadder.level0Reflective;
        break;
      case 1:
        hintText = scaffold.hintLadder.level1Directional;
        break;
      case 2:
        hintText = scaffold.hintLadder.level2Constraint;
        break;
      case 3:
      default:
        hintText = scaffold.hintLadder.level3WorkedExample;
        break;
    }

    // Select targeted micro-remediation by primary failure axis
    let remediation = "";
    switch (lossResult.primaryClassification) {
      case "concept_gap":
        remediation = scaffold.microRemediations.conceptGap;
        break;
      case "missing_prerequisite":
        remediation =
          scaffold.microRemediations.missingPrerequisite ||
          `Prerequisite review needed for parent nodes: ${node.prerequisites.join(", ")}`;
        break;
      case "notation_breakdown":
        remediation = scaffold.microRemediations.notationBreakdown;
        break;
      case "method_choice":
        remediation = scaffold.microRemediations.methodChoice;
        break;
      case "reasoning_bug":
        remediation = scaffold.microRemediations.reasoningBug;
        break;
      default:
        remediation = scaffold.microRemediations.conceptGap;
    }

    // Negative gradient update with hint penalty
    const efficiency = 1.0 - penalty;
    const deltaTheta = Number(
      (baseAlpha * (1.0 - lossResult.totalLoss) * efficiency - baseAlpha * lossResult.totalLoss * 0.5).toFixed(4)
    );

    const feedbackMessage = `⚠️ Loss: ${lossResult.totalLoss} [${lossResult.primaryClassification}]. Escalated to Hint Tier ${hintLevel}.`;

    return {
      hintLevel,
      hintText,
      remediationSnippet: remediation,
      learningRateAlpha: baseAlpha,
      deltaTheta,
      feedbackMessage,
    };
  }

  /**
   * Formats terminal display for the backward pass intervention.
   */
  public formatTerminalDisplay(intervention: BackwardPassIntervention): string {
    const lines: string[] = [
      "───────────────────────────────────────────────────────────────────────",
      `🔄 BACKWARD PASS INTERVENTION [TIER ${intervention.hintLevel}]`,
      `📢 ${intervention.feedbackMessage}`,
      "───────────────────────────────────────────────────────────────────────",
    ];

    if (intervention.hintText) {
      lines.push(`\n🧭 Scaffolding Hint (Tier ${intervention.hintLevel}):`);
      lines.push(`  ${intervention.hintText}`);
    }

    if (intervention.remediationSnippet) {
      lines.push("\n🩹 Targeted Micro-Remediation:");
      lines.push(
        intervention.remediationSnippet
          .split("\n")
          .map((l) => `  ${l}`)
          .join("\n")
      );
    }

    lines.push(`\n📊 Weight Gradient Step (Δθ): ${intervention.deltaTheta >= 0 ? "+" : ""}${intervention.deltaTheta}`);
    lines.push("👉 Revise your prediction and submit your next forward pass:\n");
    return lines.join("\n");
  }
}
