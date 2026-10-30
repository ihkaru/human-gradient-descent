import type {
  CurriculumManifest,
  NodeShard,
  CompetencyNode,
  CognitiveLevel,
} from "../types/curriculum.js";

export interface CompileOptions {
  curriculumId: string;
  title: string;
  domain: string;
  version?: string;
  nodesPerShard?: number;
}

export class MarkdownCurriculumCompiler {
  /**
   * Compiles raw markdown text into a sharded HGD curriculum.
   */
  public compile(
    markdownContent: string,
    options: CompileOptions
  ): { manifest: CurriculumManifest; shards: NodeShard[] } {
    const rawNodes = this.extractNodesFromMarkdown(markdownContent, options);
    const nodesPerShard = options.nodesPerShard || 25;
    const shards: NodeShard[] = [];
    const shardCatalog: CurriculumManifest["shards"] = [];
    const dagNodes: CurriculumManifest["dag"]["nodes"] = [];
    const dagEdges: CurriculumManifest["dag"]["edges"] = [];

    // Chunk nodes into shards
    for (let i = 0; i < rawNodes.length; i += nodesPerShard) {
      const shardIndex = Math.floor(i / nodesPerShard) + 1;
      const shardId = `shard_${String(shardIndex).padStart(3, "0")}`;
      const chunk = rawNodes.slice(i, i + nodesPerShard);

      const shard: NodeShard = {
        shardId,
        curriculumId: options.curriculumId,
        nodes: chunk,
      };

      shards.push(shard);
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
          dagEdges.push({
            from: p,
            to: node.id,
            relationType: "prerequisite",
          });
        }
      }
    }

    const manifest: CurriculumManifest = {
      schemaVersion: "2026.1",
      curriculumId: options.curriculumId,
      title: options.title,
      domain: options.domain,
      version: options.version || "1.0.0",
      license: "MIT",
      authors: ["ihkaru"],
      scale: {
        totalNodes: rawNodes.length,
        totalShards: shards.length,
        approxWordCount: markdownContent.split(/\s+/).length,
        estimatedLearningHours: Number((rawNodes.length * 0.35).toFixed(1)),
      },
      shards: shardCatalog,
      dag: {
        nodes: dagNodes,
        edges: dagEdges,
      },
    };

    return { manifest, shards };
  }

  private extractNodesFromMarkdown(
    content: string,
    options: CompileOptions
  ): CompetencyNode[] {
    const lines = content.split("\n");
    const nodes: CompetencyNode[] = [];
    let currentTitle = "";
    let currentBody: string[] = [];
    let nodeIndex = 0;

    const flushNode = () => {
      if (currentTitle && currentBody.length > 0) {
        nodeIndex++;
        const id = `hgd://${options.domain.toLowerCase()}/${options.curriculumId}/node-${String(nodeIndex).padStart(3, "0")}`;
        const bodyText = currentBody.join("\n").trim();
        const prevId =
          nodes.length > 0 ? [nodes[nodes.length - 1].id] : [];

        nodes.push(this.synthesizeNode(id, currentTitle, bodyText, prevId, nodeIndex));
      }
      currentTitle = "";
      currentBody = [];
    };

    for (const line of lines) {
      if (line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### ")) {
        flushNode();
        currentTitle = line.replace(/^#+\s*/, "").trim();
      } else {
        currentBody.push(line);
      }
    }
    flushNode();

    // Fallback if no markdown headers were detected
    if (nodes.length === 0 && content.trim().length > 0) {
      const id = `hgd://${options.domain.toLowerCase()}/${options.curriculumId}/node-001`;
      nodes.push(this.synthesizeNode(id, options.title, content.trim(), [], 1));
    }

    return nodes;
  }

  private synthesizeNode(
    id: string,
    title: string,
    body: string,
    prereqs: string[],
    index: number
  ): CompetencyNode {
    const cognitiveLevels: CognitiveLevel[] = [
      "understand",
      "apply",
      "analyze",
      "evaluate",
    ];
    const cognitiveLevel = cognitiveLevels[(index - 1) % cognitiveLevels.length];
    const excerpt = body.slice(0, 300).trim();

    return {
      id,
      title,
      cognitiveLevel,
      prerequisites: prereqs,
      conceptSummary: body.slice(0, 1000).trim(),
      forwardPass: {
        probeType: "prediction_what_if",
        readingContext: excerpt,
        prompt: `Based on your understanding of ${title}, predict: If the fundamental constraint or input parameters were inverted, how does the system behave, and why?`,
        expectedMentalModel: [
          title.toLowerCase(),
          "invariant",
          "mechanism",
        ],
        groundTruth: `${title} operates via core invariants preserving stability and state.`,
      },
      lossRubric: {
        conceptGapCriteria: [
          "Fails to identify the core invariant mechanism",
          "Confuses cause and effect in state transitions",
        ],
        missingPrerequisiteMap: prereqs.length > 0 ? { [prereqs[0]]: "Parent foundational concept" } : undefined,
        notationCriteria: ["Uses non-standard terminology", "Confuses variables"],
        strategyCriteria: ["Suggests an invalid or brute-force approach"],
        reasoningCriteria: ["Off-by-one or boundary omission in prediction"],
      },
      backwardPass: {
        learningRate: 0.25,
        hintLadder: {
          level0Reflective: `Re-examine your premise regarding ${title}: what underlying invariant was assumed?`,
          level1Directional: `Focus on how ${title} handles boundary conditions and resource constraints.`,
          level2Constraint: `Eliminate linear unconstrained assumptions. Consider conservation laws or state gates.`,
          level3WorkedExample: `Consider an isomorphic case: when input X increases, mechanism M bounds output Y to invariant Z.`,
        },
        microRemediations: {
          conceptGap: `Key Invariant: ${title} fundamentally ensures causal state continuity.`,
          missingPrerequisite: prereqs.length > 0 ? `Review prerequisite concept: ${prereqs[0]}` : undefined,
          notationBreakdown: `Ensure accurate notation when describing system parameters.`,
          methodChoice: `Select deductive causal tracing rather than empirical guessing.`,
          reasoningBug: `Trace the boundary edge cases step-by-step.`,
        },
      },
      sources: [
        {
          sourceRef: "markdown-source",
          locationTag: `Section: ${title}`,
          verbatimQuote: excerpt.slice(0, 120),
        },
      ],
    };
  }
}
