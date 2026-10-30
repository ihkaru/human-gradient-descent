import type { CompetencyNode, LossVector } from "../types/curriculum.js";

export interface CodeTraceChallenge {
  nodeId: string;
  language: string;
  codeSnippet: string;
  inputs: Record<string, unknown>;
  tracingTarget: "return_value" | "intermediate_state" | "branch_taken" | "exception";
  prompt: string;
  expectedOutput: string;
  diagnosticTraps: {
    trapName: string;
    incorrectPrediction: string;
    axisAffected: keyof LossVector;
    remediation: string;
  }[];
}

export interface TraceEvaluationResult {
  isCorrect: boolean;
  totalLoss: number;
  detectedTrap?: string;
  lossVector: LossVector;
  feedback: string;
}

export class MentalTraceEngine {
  /**
   * Generates a code execution mental tracing challenge from code snippet and target state.
   */
  public generateTraceChallenge(params: {
    node: CompetencyNode;
    language: string;
    codeSnippet: string;
    inputs: Record<string, unknown>;
    tracingTarget: CodeTraceChallenge["tracingTarget"];
    expectedOutput: string;
    diagnosticTraps?: CodeTraceChallenge["diagnosticTraps"];
  }): CodeTraceChallenge {
    const inputStr = Object.entries(params.inputs)
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join(", ");

    const prompt = `Mental Tracing Challenge: Given the inputs (${inputStr}), simulate execution mentally. What is the ${params.tracingTarget.replace("_", " ")}?`;

    return {
      nodeId: params.node.id,
      language: params.language,
      codeSnippet: this.addLineNumbers(params.codeSnippet.trim()),
      inputs: params.inputs,
      tracingTarget: params.tracingTarget,
      prompt,
      expectedOutput: String(params.expectedOutput).trim(),
      diagnosticTraps: params.diagnosticTraps || [
        {
          trapName: "off_by_one",
          incorrectPrediction: "boundary_off_by_one",
          axisAffected: "reasoningBug",
          remediation: "Check loop termination condition (< vs <=).",
        },
        {
          trapName: "variable_shadowing",
          incorrectPrediction: "outer_scope_leak",
          axisAffected: "conceptGap",
          remediation: "Verify variable scope across inner block closures.",
        },
      ],
    };
  }

  /**
   * Evaluates a learner's mental execution prediction against ground truth and known cognitive traps.
   */
  public evaluateTrace(
    challenge: CodeTraceChallenge,
    userPrediction: string
  ): TraceEvaluationResult {
    const cleanUser = userPrediction.trim().toLowerCase();
    const cleanExpected = challenge.expectedOutput.toLowerCase();

    if (cleanUser === cleanExpected) {
      return {
        isCorrect: true,
        totalLoss: 0.0,
        lossVector: {
          conceptGap: 0.0,
          missingPrerequisite: 0.0,
          notationBreakdown: 0.0,
          methodChoice: 0.0,
          reasoningBug: 0.0,
        },
        feedback: "Exact execution match. Mental simulation converged.",
      };
    }

    // Check for specific diagnostic traps
    for (const trap of challenge.diagnosticTraps) {
      if (cleanUser.includes(trap.incorrectPrediction.toLowerCase())) {
        const lossVector: LossVector = {
          conceptGap: trap.axisAffected === "conceptGap" ? 0.7 : 0.1,
          missingPrerequisite: trap.axisAffected === "missingPrerequisite" ? 0.6 : 0.0,
          notationBreakdown: trap.axisAffected === "notationBreakdown" ? 0.5 : 0.1,
          methodChoice: trap.axisAffected === "methodChoice" ? 0.5 : 0.1,
          reasoningBug: trap.axisAffected === "reasoningBug" ? 0.7 : 0.2,
        };

        const totalLoss = Number(
          (
            0.35 * lossVector.conceptGap +
            0.2 * lossVector.missingPrerequisite +
            0.15 * lossVector.notationBreakdown +
            0.15 * lossVector.methodChoice +
            0.15 * lossVector.reasoningBug
          ).toFixed(2)
        );

        return {
          isCorrect: false,
          totalLoss,
          detectedTrap: trap.trapName,
          lossVector,
          feedback: `Diagnostic Trap Detected: ${trap.trapName}. ${trap.remediation}`,
        };
      }
    }

    // Generic tracing error
    const genericLossVector: LossVector = {
      conceptGap: 0.4,
      missingPrerequisite: 0.0,
      notationBreakdown: 0.2,
      methodChoice: 0.3,
      reasoningBug: 0.6,
    };

    return {
      isCorrect: false,
      totalLoss: 0.45,
      lossVector: genericLossVector,
      feedback: "Simulation mismatch. Re-trace variable mutation step-by-step.",
    };
  }

  private addLineNumbers(code: string): string {
    const lines = code.split("\n");
    const padSize = String(lines.length).length;
    return lines
      .map((line, idx) => `${String(idx + 1).padStart(padSize, " ")} | ${line}`)
      .join("\n");
  }
}
