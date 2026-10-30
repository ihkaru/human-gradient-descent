import type {
  CompetencyNode,
  VariationProbes,
  ConceptualVariant,
  ProceduralPerturbation,
  DifficultyTier,
} from "../types/curriculum.js";

export interface ActiveVariationChallenge {
  nodeId: string;
  difficultyTier: DifficultyTier;
  primaryPrompt: string;
  activeVariant?: ConceptualVariant;
  activePerturbation?: ProceduralPerturbation;
  boundaryRule?: string;
}

export class VariationEngine {
  /**
   * Generates a Bianshi variation challenge for a node based on target difficulty tier.
   */
  public generateVariationChallenge(
    node: CompetencyNode,
    requestedTier?: DifficultyTier
  ): ActiveVariationChallenge {
    const tier = requestedTier || node.difficultyTier || "1_foundational_fluency";
    const variations: VariationProbes = node.variationProbes || {};

    let activeVariant: ConceptualVariant | undefined;
    let activePerturbation: ProceduralPerturbation | undefined;

    if (tier === "2_boundary_perturbation" || tier === "4_adversarial_dilemma") {
      const perts = variations.proceduralPerturbations || [];
      if (perts.length > 0) {
        // Pick primary perturbation or adversarial dilemma
        activePerturbation =
          tier === "4_adversarial_dilemma" ? perts[perts.length - 1] : perts[0];
      }
    }

    if (tier === "3_isomorphic_transfer") {
      const variants = variations.conceptualVariants || [];
      if (variants.length > 0) {
        activeVariant = variants[0];
      }
    }

    let prompt = node.forwardPass.prompt;
    if (activePerturbation) {
      prompt = `[BOUNDARY PROBE: ${activePerturbation.parameter} -> ${activePerturbation.perturbation}]\n${activePerturbation.probe}`;
    }

    return {
      nodeId: node.id,
      difficultyTier: tier,
      primaryPrompt: prompt,
      activeVariant,
      activePerturbation,
      boundaryRule: activePerturbation?.expectedBoundaryBehavior,
    };
  }

  /**
   * Formats terminal display for the variation challenge.
   */
  public formatTerminalDisplay(challenge: ActiveVariationChallenge): string {
    const lines: string[] = [
      "───────────────────────────────────────────────────────────────────────",
      `🔬 BIANSHI VARIATION PROBE [TIER: ${challenge.difficultyTier.toUpperCase()}]`,
      "───────────────────────────────────────────────────────────────────────",
    ];

    if (challenge.activeVariant) {
      lines.push(
        `\n🎭 Alternative Representation [${challenge.activeVariant.representationType.toUpperCase()}]:`
      );
      lines.push(
        challenge.activeVariant.content
          .split("\n")
          .map((l) => `  ${l}`)
          .join("\n")
      );
    }

    lines.push("\n🎯 Challenge Query:");
    lines.push(
      challenge.primaryPrompt
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n")
    );

    if (challenge.boundaryRule) {
      lines.push("\n⚠️ Invariant Boundary Warning:");
      lines.push(`  Observe how changing conditions stress the underlying invariant.`);
    }

    lines.push("");
    return lines.join("\n");
  }
}
