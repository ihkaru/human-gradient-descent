import type {
  CurriculumManifest,
  NodeShard,
  CompetencyNode,
  CognitiveLevel,
  PacingMode,
  DomainType,
  DifficultyTier,
  ConceptualVariant,
} from "../types/curriculum.js";
import { DAGCycleDetector } from "../validator/dag-cycle-detector.js";

export interface CompileOptions {
  curriculumId: string;
  title: string;
  domain: string;
  domainType?: DomainType;
  version?: string;
  nodesPerShard?: number;
  defaultPacingMode?: PacingMode;
  validateDAG?: boolean;
}

interface RawSection {
  title: string;
  body: string;
  annotations: Record<string, string>;
}

export class MarkdownCurriculumCompiler {
  public compile(
    markdownContent: string,
    options: CompileOptions
  ): { manifest: CurriculumManifest; shards: NodeShard[] } {
    const { docTitle, docDesc, sections } = this.parseMarkdown(markdownContent, options);
    const titleToIdMap = new Map<string, string>();

    sections.forEach((s, idx) => {
      const id = `hgd://${options.domain.toLowerCase()}/${options.curriculumId}/node-${String(idx + 1).padStart(3, "0")}`;
      titleToIdMap.set(s.title.toLowerCase(), id);
    });

    const rawNodes = sections.map((s, idx) =>
      this.synthesizeNode(s, idx, options, titleToIdMap)
    );

    const nodesPerShard = options.nodesPerShard || 3;
    const shards: NodeShard[] = [];
    const shardCatalog: CurriculumManifest["shards"] = [];
    const dagNodes: CurriculumManifest["dag"]["nodes"] = [];
    const dagEdges: CurriculumManifest["dag"]["edges"] = [];

    for (let i = 0; i < rawNodes.length; i += nodesPerShard) {
      const shardIndex = Math.floor(i / nodesPerShard) + 1;
      const shardId = `shard_${String(shardIndex).padStart(3, "0")}`;
      const chunk = rawNodes.slice(i, i + nodesPerShard);

      shards.push({ shardId, curriculumId: options.curriculumId, nodes: chunk });
      shardCatalog.push({
        shardId,
        filePath: `shards/${shardId}.json`,
        nodeCount: chunk.length,
        nodeIds: chunk.map((n) => n.id),
      });

      for (const node of chunk) {
        dagNodes.push({
          id: node.id,
          shardId,
          title: node.title,
          cognitiveLevel: node.cognitiveLevel,
        });

        for (const p of node.prerequisites) {
          dagEdges.push({ from: p, to: node.id, relationType: "prerequisite" });
        }
      }
    }

    const checkpoints = rawNodes
      .filter((_, idx) => (idx + 1) % 2 === 0 || idx === rawNodes.length - 1)
      .map((n, idx) => ({
        checkpointId: `cp-${String(idx + 1).padStart(2, "0")}`,
        title: `Milestone Checkpoint: ${n.title}`,
        milestoneNodeId: n.id,
        requiredMasteryTheta: 0.9,
      }));

    const manifest: CurriculumManifest = {
      schemaVersion: "2026.1",
      curriculumId: options.curriculumId,
      title: docTitle || options.title,
      description: docDesc || undefined,
      domain: options.domain,
      domainType: options.domainType || "general",
      compositionalPrimitives: rawNodes.map((n) => n.title.toLowerCase()),
      version: options.version || "1.0.0",
      license: "MIT",
      authors: ["ihkaru"],
      scale: {
        totalNodes: rawNodes.length,
        totalShards: shards.length,
        approxWordCount: markdownContent.split(/\s+/).length,
        estimatedLearningHours: Number((rawNodes.length * 0.35).toFixed(1)),
      },
      pacing: {
        defaultMode: options.defaultPacingMode || "time_bounded",
        timeBoundedConfig: {
          defaultNodeTimeoutSeconds: 60,
          totalCurriculumBudgetMinutes: Math.max(15, Math.ceil(rawNodes.length * 2.5)),
          autoEscalateHintOnTimeout: true,
          stagnationWarningSeconds: 25,
        },
        checkpoints,
      },
      shards: shardCatalog,
      dag: { nodes: dagNodes, edges: dagEdges },
    };

    if (options.validateDAG !== false) {
      const cycleDetector = new DAGCycleDetector();
      const dagResult = cycleDetector.validateManifest(manifest);
      if (!dagResult.isValid) {
        throw new Error(
          `Curriculum DAG validation failed:\n${dagResult.diagnostics.join("\n")}`
        );
      }
    }

    return { manifest, shards };
  }

  private parseMarkdown(
    content: string,
    options: CompileOptions
  ): { docTitle?: string; docDesc?: string; sections: RawSection[] } {
    const lines = content.split("\n");
    let docTitle = "";
    let docDescLines: string[] = [];
    const sections: RawSection[] = [];
    let currentTitle = "";
    let currentBody: string[] = [];
    let isIntro = true;

    const flush = () => {
      if (currentTitle && currentBody.length > 0) {
        const bodyRaw = currentBody.join("\n").trim();
        const annotations: Record<string, string> = {};
        const cleanedBodyLines: string[] = [];

        for (const line of bodyRaw.split("\n")) {
          const m = line.match(/<!--\s*hgd:([a-zA-Z0-9_-]+):\s*(.*?)\s*-->/);
          if (m) {
            annotations[m[1]] = m[2];
          } else {
            cleanedBodyLines.push(line);
          }
        }

        sections.push({
          title: currentTitle,
          body: cleanedBodyLines.join("\n").trim(),
          annotations,
        });
      }
      currentTitle = "";
      currentBody = [];
    };

    for (const line of lines) {
      if (line.startsWith("# ") && isIntro) {
        docTitle = line.replace(/^#\s*/, "").trim();
      } else if (line.startsWith("## ") || line.startsWith("### ")) {
        isIntro = false;
        flush();
        currentTitle = line.replace(/^#+\s*/, "").trim();
      } else if (isIntro && line.trim().length > 0) {
        docDescLines.push(line.trim());
      } else {
        currentBody.push(line);
      }
    }
    flush();

    return {
      docTitle: docTitle || options.title,
      docDesc: docDescLines.join(" "),
      sections,
    };
  }

  private synthesizeNode(
    s: RawSection,
    idx: number,
    options: CompileOptions,
    titleMap: Map<string, string>
  ): CompetencyNode {
    const id = `hgd://${options.domain.toLowerCase()}/${options.curriculumId}/node-${String(idx + 1).padStart(3, "0")}`;
    const ann = s.annotations;

    const cognitiveLevels: CognitiveLevel[] = ["understand", "apply", "analyze", "evaluate"];
    const cognitiveLevel = cognitiveLevels[idx % cognitiveLevels.length];

    const difficultyTier: DifficultyTier = (ann.tier as DifficultyTier) ||
      (idx === 0 ? "1_foundational_fluency" : (idx % 2 === 1 ? "2_boundary_perturbation" : "3_isomorphic_transfer"));

    let prereqs: string[] = [];
    if (ann.prereqs) {
      try {
        const parsed = JSON.parse(ann.prereqs);
        if (Array.isArray(parsed)) {
          prereqs = parsed.map((t) => titleMap.get(String(t).toLowerCase()) || t).filter(Boolean);
        }
      } catch {
        prereqs = [];
      }
    } else if (idx > 0) {
      const prevId = `hgd://${options.domain.toLowerCase()}/${options.curriculumId}/node-${String(idx).padStart(3, "0")}`;
      prereqs = [prevId];
    }

    const invariantSentence = this.extractInvariantSentence(s.body) || `${s.title} defines the fundamental system invariant.`;
    const prompt = ann.probe || `Predict: Under what conditions does the core invariant of ${s.title} collapse?`;
    const groundTruth = ann.truth || invariantSentence;
    const microPrimer = ann.primer || this.extractMicroPrimer(s.body) || `${s.title} introduces the fundamental grounding concepts and primitive definitions.`;

    let mentalModels = [s.title.toLowerCase(), "invariant", "boundary"];
    if (ann.models) {
      try {
        const parsed = JSON.parse(ann.models);
        if (Array.isArray(parsed)) mentalModels = parsed;
      } catch {}
    }

    const formulaMatch = s.body.match(/\$\$([\s\S]*?)\$\$/);
    const conceptualVariants: ConceptualVariant[] = [
      { representationType: "verbal", content: invariantSentence },
    ];
    if (formulaMatch) {
      conceptualVariants.push({ representationType: "symbolic" as const, content: formulaMatch[1].trim() });
    }

    return {
      id,
      title: s.title,
      cognitiveLevel,
      difficultyTier,
      workingMemoryBudget: { wordCount: prompt.split(/\s+/).length, estimatedReadingSeconds: 3 },
      prerequisites: prereqs,
      conceptSummary: s.body.slice(0, 1000).trim(),
      pacing: {
        timeLimitSeconds: 60,
        recommendedEpochs: 3,
        isCheckpoint: (idx + 1) % 2 === 0,
        rollbackNodeId: prereqs[0],
      },
      variationProbes: {
        conceptualVariants,
        proceduralPerturbations: [
          {
            parameter: "boundary_condition",
            perturbation: "inverse_constraint",
            probe: `If boundary inputs invert, how does ${s.title} preserve state?`,
            expectedBoundaryBehavior: groundTruth,
          },
        ],
      },
      forwardPass: {
        probeType: "prediction_what_if",
        microPrimer,
        readingContext: s.body.slice(0, 500).trim(),
        prompt,
        expectedMentalModel: mentalModels,
        groundTruth,
      },
      lossRubric: {
        conceptGapCriteria: [
          `Fails to identify core mechanism: ${invariantSentence}`,
          "Confuses cause and effect in state transitions",
        ],
        missingPrerequisiteMap: prereqs.length > 0 ? { [prereqs[0]]: "Foundational upstream concept" } : undefined,
        notationCriteria: ["Uses ambiguous notation", "Confuses variables"],
        strategyCriteria: ["Applies inapplicable heuristics"],
        reasoningCriteria: ["Off-by-one or boundary condition omission"],
      },
      backwardPass: {
        learningRate: 0.25,
        hintLadder: {
          level0Reflective: ann.hint0 || `Reflective: What fundamental invariant governs ${s.title}?`,
          level1Directional: ann.hint1 || `Directional Clue: Examine how ${s.title} handles boundary conditions: ${invariantSentence}`,
          level2Constraint: ann.hint2 || `Constraint: Eliminate unconstrained assumptions. Ground truth: ${groundTruth}`,
          level3WorkedExample: ann.worked || `Worked Solution: ${groundTruth}. Applying this rule resolves the challenge step-by-step.`,
        },
        microRemediations: {
          conceptGap: `Core Invariant: ${groundTruth}`,
          missingPrerequisite: prereqs.length > 0 ? `Review prerequisite: ${prereqs[0]}` : undefined,
          notationBreakdown: `Ensure accurate notation and units for ${s.title}.`,
          methodChoice: "Apply deductive causal reasoning rather than guessing.",
          reasoningBug: "Trace boundary edge cases step-by-step.",
        },
      },
      sources: [{ sourceRef: "markdown-source", locationTag: `Section: ${s.title}`, verbatimQuote: s.body.slice(0, 100) }],
    };
  }

  private extractMicroPrimer(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (!sentences[0]) return "";
    let primer = sentences[0].trim();
    if (sentences.length > 1 && primer.length < 80) {
      primer += " " + sentences[1].trim();
    }
    return primer.slice(0, 280);
  }

  private extractInvariantSentence(text: string): string | undefined {
    const sentences = text.split(/(?<=[.!?])\s+/);
    for (const sent of sentences) {
      const lower = sent.toLowerCase();
      if (lower.includes("invariant") || lower.includes("states that") || lower.includes("requires") || lower.includes("fundamental")) {
        return sent.trim();
      }
    }
    return sentences[0]?.trim();
  }
}
