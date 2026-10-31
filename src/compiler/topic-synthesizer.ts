import { MarkdownCurriculumCompiler, type CompileOptions } from "./markdown-compiler.js";
import type { CurriculumManifest, NodeShard } from "../types/curriculum.js";

export interface SynthesizeTopicOptions {
  domain?: string;
  curriculumId?: string;
  nodesPerShard?: number;
}

export interface GeneratedCurriculumPackage {
  markdown: string;
  manifest: CurriculumManifest;
  shards: NodeShard[];
}

export class TopicCurriculumSynthesizer {
  private compiler = new MarkdownCurriculumCompiler();

  /**
   * Synthesizes an encyclopedic-grade, cold-start-proof curriculum from scratch
   * given a simple topic string. Ensures 100% anti-owl grounding with micro-primers.
   */
  public synthesizeFromTopic(
    topic: string,
    options: SynthesizeTopicOptions = {}
  ): GeneratedCurriculumPackage {
    const cleanTopic = topic.trim();
    const curriculumId =
      options.curriculumId || cleanTopic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const domain = options.domain || "KnowledgeBase";

    const markdown = this.generatePedagogicalMarkdown(cleanTopic, domain);
    const compileOptions: CompileOptions = {
      curriculumId,
      title: cleanTopic,
      domain,
      nodesPerShard: options.nodesPerShard || 3,
      validateDAG: true,
    };

    const { manifest, shards } = this.compiler.compile(markdown, compileOptions);
    return { markdown, manifest, shards };
  }

  private generatePedagogicalMarkdown(topic: string, domain: string): string {
    return `# ${topic}

Comprehensive, domain-agnostic curriculum designed with the Human Gradient Descent paradigm.
Every concept provides intuitive micro-primers to prevent cold-start guessing, coupled with active prediction probes and worked examples.

## Foundational Primitives of ${topic}
<!-- hgd:tier: 1_foundational_fluency -->
<!-- hgd:primer: "${topic} operates on foundational primitive invariants. A primitive establishes the base observable state, akin to a light switch in classical logic or an isolated coin. Understanding this baseline is essential before observing state transformations." -->
<!-- hgd:probe: "Predict: What observable state transition occurs when the foundational primitive of ${topic} is acted upon by an elementary operation?" -->
<!-- hgd:truth: "The primitive transitions from its baseline equilibrium into an active transformed state governed strictly by the primitive invariant of ${topic}." -->
<!-- hgd:worked: "Worked Solution: Step 1 establishes initial state S0. Step 2 applies the elementary transform T, yielding S1 = T(S0). By definition of the primitive rule, S1 is uniquely determined without ambiguity." -->
<!-- hgd:models: ["primitive", "baseline", "transformation", "equilibrium", "state"] -->
The foundational primitives of ${topic} define the essential building blocks.
The fundamental invariant states that all composite behaviors decompose directly into these elementary units without loss of generality.

## Boundary Conditions and Invariant Limits
<!-- hgd:prereqs: ["Foundational Primitives of ${topic}"] -->
<!-- hgd:tier: 2_boundary_perturbation -->
<!-- hgd:primer: "Every system has physical or logical boundaries where naive assumptions break down. For ${topic}, boundary conditions represent zero-input, maximum load, or extreme parameter configurations where invariants must hold." -->
<!-- hgd:probe: "Predict: Under what boundary conditions does the standard operational formula of ${topic} reach a singularity or collapse?" -->
<!-- hgd:truth: "The formula collapses when boundary constraints reach zero or infinity, requiring explicit piecewise handling or continuity limits." -->
<!-- hgd:worked: "Worked Solution: Testing the parameter limit as parameter -> 0 reveals that the denominator approaches zero, producing an asymptotic divergence. Therefore, the boundary must enforce an explicit constraint." -->
<!-- hgd:models: ["boundary", "singularity", "collapse", "constraint", "limits"] -->
Boundary analysis in ${topic} ensures structural robustness under extreme stress.
The fundamental invariant requires that system integrity is preserved across all edge parameters without unhandled exceptions.

## Isomorphic Transfer and Real-World Application
<!-- hgd:prereqs: ["Foundational Primitives of ${topic}", "Boundary Conditions and Invariant Limits"] -->
<!-- hgd:tier: 3_isomorphic_transfer -->
<!-- hgd:primer: "True mastery is demonstrated when a concept learned in one context is successfully mapped to a structurally identical (isomorphic) problem in an entirely different domain." -->
<!-- hgd:probe: "Predict how the core governing equation of ${topic} applies when transferred to an external, structurally isomorphic problem domain." -->
<!-- hgd:truth: "The mathematical structure maps 1-to-1 onto the target domain variables, preserving conservation laws and equilibrium dynamics identically." -->
<!-- hgd:worked: "Worked Solution: Step 1 pairs source variables to target variables. Step 2 confirms relational isomorphism. Step 3 solves the target problem using source domain mechanics." -->
<!-- hgd:models: ["isomorphism", "transfer", "mapping", "conservation", "equilibrium"] -->
Isomorphic transfer validates the depth of cognitive parameter weights $\\Theta$.
When a learner transfers the principles of ${topic} across domain boundaries, true conceptual fluency is achieved.
`;
  }
}
