import type { CurriculumManifest, LearnerState, DagNodeSummary } from "../types/curriculum.js";

export class DAGExporter {
  public exportMermaid(
    manifest: CurriculumManifest,
    state?: LearnerState
  ): string {
    const lines: string[] = ["flowchart TD"];

    // Class definitions with enterprise dark theme palette
    lines.push(
      "  classDef mastered fill:#064e3b,stroke:#00dc82,stroke-width:2px,color:#f1f5f9;",
      "  classDef frontier fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#f1f5f9;",
      "  classDef locked fill:#1e293b,stroke:#475569,stroke-width:1px,color:#94a3b8;",
      "  classDef defaultNode fill:#1e293b,stroke:#38bdf8,stroke-width:1.5px,color:#f1f5f9;"
    );

    const masteredSet = new Set(state?.masteredNodes || []);
    const frontierSet = new Set(state?.activeFrontier || []);

    // Nodes
    for (const node of manifest.dag.nodes) {
      const sanitizedId = this.sanitizeId(node.id);
      const label = this.formatNodeLabel(node, state);
      let styleClass = "defaultNode";

      if (state) {
        if (masteredSet.has(node.id)) {
          styleClass = "mastered";
        } else if (frontierSet.has(node.id)) {
          styleClass = "frontier";
        } else {
          styleClass = "locked";
        }
      }

      lines.push(`  ${sanitizedId}["${label}"]:::${styleClass}`);
    }

    lines.push("");

    // Edges
    for (const edge of manifest.dag.edges) {
      const fromId = this.sanitizeId(edge.from);
      const toId = this.sanitizeId(edge.to);
      const relationLabel = edge.relationType && edge.relationType !== "prerequisite"
        ? `|${edge.relationType}|`
        : "";
      lines.push(`  ${fromId} -->${relationLabel} ${toId}`);
    }

    return lines.join("\n");
  }

  public exportMarkdownReport(
    manifest: CurriculumManifest,
    state?: LearnerState
  ): string {
    const mermaidDiagram = this.exportMermaid(manifest, state);
    const masteredCount = state?.masteredNodes?.length || 0;
    const frontierCount = state?.activeFrontier?.length || 0;
    const totalNodes = manifest.scale.totalNodes;

    const lines: string[] = [
      `# Curriculum DAG Architecture: ${manifest.title}`,
      "",
      `> Domain: \`${manifest.domain}\` | Total Nodes: \`${totalNodes}\` | Total Edges: \`${manifest.dag.edges.length}\``,
    ];

    if (state) {
      lines.push(
        `> Mastery: \`${(state.globalMastery * 100).toFixed(1)}%\` (\`${masteredCount}/${totalNodes}\`) | Active Frontier: \`${frontierCount}\``
      );
    }

    lines.push(
      "",
      "## 1. Topological Prerequisite Flowchart",
      "",
      "```mermaid",
      mermaidDiagram,
      "```",
      "",
      "## 2. Competency Node Inventory",
      "",
      "| Node ID | Title | Cognitive Level | Prerequisites | Status |",
      "| :--- | :--- | :--- | :--- | :--- |"
    );

    for (const node of manifest.dag.nodes) {
      const prereqs = manifest.dag.edges
        .filter((e) => e.to === node.id)
        .map((e) => `\`${e.from}\``)
        .join(", ") || "*(Root Anchor)*";

      let status = "Ready";
      if (state) {
        if (state.masteredNodes.includes(node.id)) {
          status = "Mastered";
        } else if (state.activeFrontier.includes(node.id)) {
          status = "Active Frontier";
        } else {
          status = "Locked";
        }
      }

      lines.push(
        `| \`${node.id}\` | ${node.title} | \`${node.cognitiveLevel}\` | ${prereqs} | ${status} |`
      );
    }

    return lines.join("\n");
  }

  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, "_");
  }

  private formatNodeLabel(node: DagNodeSummary, state?: LearnerState): string {
    const safeTitle = node.title.replace(/"/g, "'");
    if (!state) {
      return `${safeTitle} (${node.cognitiveLevel})`;
    }
    if (state.masteredNodes.includes(node.id)) {
      const theta = state.weights[node.id]?.theta;
      const thetaStr = theta !== undefined ? ` [θ=${theta.toFixed(2)}]` : "";
      return `[OK] ${safeTitle}${thetaStr}`;
    }
    if (state.activeFrontier.includes(node.id)) {
      return `[>] ${safeTitle} (Ready)`;
    }
    return `[#] ${safeTitle} (Locked)`;
  }
}
