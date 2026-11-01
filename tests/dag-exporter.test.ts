import { describe, it, expect } from "bun:test";
import { DAGExporter } from "../src/validator/dag-exporter.js";
import type { CurriculumManifest, LearnerState } from "../src/types/curriculum.js";

describe("DAGExporter Suite (Mermaid Flowchart & Topology Reports)", () => {
  const exporter = new DAGExporter();

  const mockManifest: CurriculumManifest = {
    curriculumId: "quantum-basics",
    title: "Quantum Computing Basics",
    domain: "stem",
    version: "1.0.0",
    schemaVersion: "2026.1",
    scale: {
      totalNodes: 3,
      totalShards: 1,
      estimatedLearningHours: 2,
    },
    pacing: {
      defaultMode: "self_paced",
    },
    dag: {
      nodes: [
        { id: "node_1", title: "Qubits and Superposition", cognitiveLevel: "understand", shardId: "shard_001" },
        { id: "node_2", title: "Quantum Logic Gates", cognitiveLevel: "apply", shardId: "shard_001" },
        { id: "node_3", title: "Quantum Entanglement", cognitiveLevel: "analyze", shardId: "shard_001" },
      ],
      edges: [
        { from: "node_1", to: "node_2", relationType: "prerequisite" },
        { from: "node_2", to: "node_3", relationType: "prerequisite" },
      ],
    },
    shards: [{ shardId: "shard_001", filePath: "shards/shard_001.json", nodeCount: 3, nodeIds: ["node_1", "node_2", "node_3"] }],
  };

  const mockState: LearnerState = {
    learnerId: "test_student",
    curriculumId: "quantum-basics",
    lastUpdated: "2026-11-01T08:00:00Z",
    globalMastery: 0.33,
    activeFrontier: ["node_2"],
    masteredNodes: ["node_1"],
    weights: {
      node_1: { theta: 0.95, confidence: 0.9, lastLoss: 0.05, attempts: 1 },
      node_2: { theta: 0.2, confidence: 0.2, lastLoss: 0.8, attempts: 0 },
      node_3: { theta: 0.0, confidence: 0.0, lastLoss: 1.0, attempts: 0 },
    },
    dailyActivityLog: {},
  };

  it("exports valid Mermaid flowchart with classes and edges without state", () => {
    const mermaid = exporter.exportMermaid(mockManifest);
    expect(mermaid).toContain("flowchart TD");
    expect(mermaid).toContain("node_1[\"Qubits and Superposition (understand)\"]:::defaultNode");
    expect(mermaid).toContain("node_2[\"Quantum Logic Gates (apply)\"]:::defaultNode");
    expect(mermaid).toContain("node_1 --> node_2");
    expect(mermaid).toContain("node_2 --> node_3");
  });

  it("applies dynamic learner mastery classes when state is supplied", () => {
    const mermaid = exporter.exportMermaid(mockManifest, mockState);
    expect(mermaid).toContain("node_1[\"[OK] Qubits and Superposition [θ=0.95]\"]:::mastered");
    expect(mermaid).toContain("node_2[\"[>] Quantum Logic Gates (Ready)\"]:::frontier");
    expect(mermaid).toContain("node_3[\"[#] Quantum Entanglement (Locked)\"]:::locked");
  });

  it("generates markdown report containing summary table and mermaid block", () => {
    const report = exporter.exportMarkdownReport(mockManifest, mockState);
    expect(report).toContain("# Curriculum DAG Architecture: Quantum Computing Basics");
    expect(report).toContain("```mermaid");
    expect(report).toContain("flowchart TD");
    expect(report).toContain("| `node_1` | Qubits and Superposition | `understand` | *(Root Anchor)* | Mastered |");
    expect(report).toContain("| `node_2` | Quantum Logic Gates | `apply` | `node_1` | Active Frontier |");
    expect(report).toContain("| `node_3` | Quantum Entanglement | `analyze` | `node_2` | Locked |");
  });
});
