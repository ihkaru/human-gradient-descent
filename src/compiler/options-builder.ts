import type { DiagnosticOption } from "../types/curriculum.js";

export function buildDiagnosticOptions(
  annotations: Record<string, string>,
  title: string,
  groundTruth: string,
  invariantSentence: string
): DiagnosticOption[] {
  if (annotations.options) {
    try {
      const parsed = JSON.parse(annotations.options);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as DiagnosticOption[];
      }
    } catch {}
  }

  return [
    {
      optionId: "opt_a",
      text: groundTruth,
      isCorrect: true,
      causalRationale: `Correct: ${groundTruth}. This adheres strictly to the governing invariant of ${title}.`,
    },
    {
      optionId: "opt_b",
      text: `The system remains completely unchanged because ${title} acts as an invariant identity operator without state transitions.`,
      isCorrect: false,
      diagnosticAxis: "conceptGap",
      causalRationale: "Misconception: Assumes operations produce zero observable effect, ignoring active transformation.",
      specificRemediation: `Review core mechanism: ${invariantSentence}`,
    },
    {
      optionId: "opt_c",
      text: `The state diverges uncontrollably because boundary conditions are violated immediately.`,
      isCorrect: false,
      diagnosticAxis: "reasoningBug",
      causalRationale: "Reasoning Slip: Assumes instability without verifying whether mathematical bounds are preserved.",
      specificRemediation: "Trace boundary constraints step-by-step.",
    },
  ];
}
