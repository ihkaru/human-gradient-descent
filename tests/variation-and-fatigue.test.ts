import { describe, expect, it } from "bun:test";
import { VariationEngine } from "../src/engine/variation-engine.js";
import { FatigueGovernor } from "../src/engine/fatigue-governor.js";
import { MarkdownCurriculumCompiler } from "../src/compiler/markdown-compiler.js";
import { SchemaValidator } from "../src/validator/schema-validator.js";
import type { CompetencyNode, LearnerState } from "../src/types/curriculum.js";
import type { DiagnosticLossResult } from "../src/engine/loss-engine.js";

describe("Bianshi Variation & Fatigue Governor Suite", () => {
  const variationEngine = new VariationEngine();
  const fatigueGovernor = new FatigueGovernor();
  const compiler = new MarkdownCurriculumCompiler();
  const validator = new SchemaValidator("./schemas");

  const sampleNode: CompetencyNode = {
    id: "hgd://law/contracts/offer-acceptance",
    title: "Objective Mutual Assent",
    cognitiveLevel: "apply",
    difficultyTier: "2_boundary_perturbation",
    workingMemoryBudget: { wordCount: 15, estimatedReadingSeconds: 2 },
    prerequisites: [],
    conceptSummary: "Mutual assent is judged by reasonable objective manifestation.",
    variationProbes: {
      conceptualVariants: [
        {
          representationType: "verbal",
          content: "Objective test: what a reasonable person in the offeree's shoes would conclude.",
        },
        {
          representationType: "symbolic",
          content: "Assent(A, B) = Manifestation(A) == Agreement && Manifestation(B) == Agreement",
        },
      ],
      proceduralPerturbations: [
        {
          parameter: "subjective_joke",
          perturbation: "party_secretly_joking",
          probe: "Predict: Party A signs a contract believing it is an elaborate joke. Is the contract binding?",
          expectedBoundaryBehavior: "Binding if reasonable person would understand it as serious (Lucy v. Zehmer).",
        },
      ],
    },
    forwardPass: {
      probeType: "prediction_what_if",
      prompt: "Predict contract validity when outward behavior contradicts secret intent.",
      expectedMentalModel: ["objective", "reasonable person", "outward manifestation"],
      groundTruth: "Objective manifestation of assent binds parties regardless of secret unexpressed intent.",
    },
    lossRubric: {
      conceptGapCriteria: ["Relies on subjective meeting of the minds"],
      notationCriteria: ["Confuses offer with invitation to treat"],
      strategyCriteria: ["Applies tort principles rather than contract rules"],
      reasoningCriteria: ["Subjective intent misinterpretation"],
    },
    backwardPass: {
      learningRate: 0.25,
      hintLadder: {
        level0Reflective: "Does the court read minds or inspect outward words and signatures?",
        level1Directional: "Look at the objective manifestation standard.",
        level2Constraint: "Secret unexpressed reservations do not defeat outward written assent.",
        level3WorkedExample: "In Lucy v Zehmer, writing a deal on a napkin while allegedly drunk still formed a binding contract.",
      },
      microRemediations: {
        conceptGap: "The objective theory of contracts prioritizes external manifestation over internal belief.",
        notationBreakdown: "Ensure proper legal terms: assent, offer, acceptance.",
        methodChoice: "Apply objective reasonable person test.",
        reasoningBug: "Distinguish between outward words and undisclosed intentions.",
      },
    },
  };

  it("VariationEngine generates boundary perturbation challenge correctly", () => {
    const challenge = variationEngine.generateVariationChallenge(
      sampleNode,
      "2_boundary_perturbation"
    );

    expect(challenge.difficultyTier).toBe("2_boundary_perturbation");
    expect(challenge.activePerturbation).toBeDefined();
    expect(challenge.activePerturbation?.parameter).toBe("subjective_joke");
    expect(challenge.primaryPrompt).toContain("BOUNDARY PROBE");
  });

  it("FatigueGovernor detects hurried slips and triggers anti-involution cooldown", () => {
    const state: LearnerState = {
      learnerId: "exhausted-learner",
      curriculumId: "law-contracts",
      lastUpdated: new Date().toISOString(),
      globalMastery: 0.2,
      weights: {},
      activeFrontier: [sampleNode.id],
      masteredNodes: [],
    };

    const badLoss: DiagnosticLossResult = {
      totalLoss: 0.9,
      converged: false,
      primaryClassification: "concept_gap",
      lossVector: { conceptGap: 1.0, missingPrerequisite: 0.5, notationBreakdown: 0.2, methodChoice: 0.8, reasoningBug: 0.8 },
      justification: "Complete miss on objective assent.",
      matchedCriteria: ["Subjective intent misinterpretation"],
    };

    // Simulate 3 consecutive rushed guesses (< 2s each)
    fatigueGovernor.evaluateFatigue(state, 1.2, badLoss, "time_bounded");
    fatigueGovernor.evaluateFatigue(state, 1.0, badLoss, "time_bounded");
    const assessment = fatigueGovernor.evaluateFatigue(state, 0.8, badLoss, "time_bounded");

    expect(assessment.consecutiveHurriedSlips).toBe(3);
    expect(assessment.fatigueScore).toBeGreaterThanOrEqual(0.7);
    expect(assessment.cooldownTriggered).toBe(true);
    expect(assessment.recommendedMode).toBe("self_paced");
    expect(state.fatigueMetrics?.cooldownActive).toBe(true);
  });

  it("compiles domain-agnostic Contract Law into valid manifest and shards", () => {
    const rawMarkdown = `
# Contract Law Foundations
## Offer and Mutual Assent
Mutual assent requires an objective offer and acceptance.
## Consideration
Enforceable promises require bargained-for exchange.
`;
    const { manifest, shards } = compiler.compile(rawMarkdown, {
      curriculumId: "contract-law",
      title: "Contract Law",
      domain: "Law",
      domainType: "law",
      nodesPerShard: 2,
    });

    expect(manifest.domainType).toBe("law");
    expect(manifest.compositionalPrimitives?.length).toBeGreaterThan(0);

    const mRes = validator.validateManifest(manifest);
    expect(mRes.valid).toBe(true);

    for (const shard of shards) {
      const sRes = validator.validateShard(shard);
      expect(sRes.valid).toBe(true);
    }
  });
});
