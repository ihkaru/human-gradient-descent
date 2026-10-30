import type { CompetencyNode, ForwardPassProbe } from "../types/curriculum.js";

export interface ForwardPassChallenge {
  nodeId: string;
  nodeTitle: string;
  probeType: string;
  readingExcerpt?: string;
  prompt: string;
  instructions: string;
}

export class ForwardPassEngine {
  /**
   * Generates the forward pass challenge prompt.
   * Hard Invariant: NEVER leaks the ground truth or explanatory resolution.
   */
  public generateChallenge(node: CompetencyNode): ForwardPassChallenge {
    const probe: ForwardPassProbe = node.forwardPass;

    const instructions =
      "🚨 FORWARD PASS RULE: Formulate your prediction/hypothesis FIRST based on intuition and prior concepts. Do not look up the answer. Generation before explanation primes neuroplastic schema encoding.";

    return {
      nodeId: node.id,
      nodeTitle: node.title,
      probeType: probe.probeType,
      readingExcerpt: probe.readingContext,
      prompt: probe.prompt,
      instructions,
    };
  }

  /**
   * Formats the challenge as terminal output for human learners.
   */
  public formatTerminalDisplay(challenge: ForwardPassChallenge): string {
    const lines: string[] = [
      "═══════════════════════════════════════════════════════════════════════",
      `🔮 FORWARD PASS PROBE [${challenge.probeType.toUpperCase()}]`,
      `🎯 Target Node: ${challenge.nodeTitle} (${challenge.nodeId})`,
      "═══════════════════════════════════════════════════════════════════════",
    ];

    if (challenge.readingExcerpt) {
      lines.push("\n📖 Background Observation / Context Snippet:");
      lines.push(
        challenge.readingExcerpt
          .split("\n")
          .map((l) => `  ${l}`)
          .join("\n")
      );
    }

    lines.push("\n⚡ Your Predictive Challenge:");
    lines.push(
      challenge.prompt
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n")
    );

    lines.push(`\n💡 ${challenge.instructions}\n`);
    return lines.join("\n");
  }
}
