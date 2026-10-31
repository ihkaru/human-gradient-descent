import { describe, it, expect } from "bun:test";
import { parseUILABlocks } from "../src/compiler/uila-builder.js";
import { parseExpansionPathways } from "../src/compiler/expansion-builder.js";
import { SchemaValidator } from "../src/validator/schema-validator.js";
import type { NodeShard, LearnerState } from "../src/types/curriculum.js";

describe("UILA & Curriculum Expansion Suite", () => {
  const validator = new SchemaValidator("./schemas");

  it("extracts all 4 foundational UILA blocks from markdown headings", () => {
    const rawMarkdown = `
### 1. Pangkal Anomali
Cara lama biner meledak pada 2^N. Saklar klasik tidak mampu memproses ruang paralel.

### 2. Prototipe Intuitif
Koin logam yang berputar kencang di atas meja.

### 3. Invarian & Operasi Inti
Kekekalan probabilitas 1.0.
| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
| Qubit bernilai 0 dan 1 sekaligus saat dilihat | Qubit runtuh saat diukur |

### 4. Notasi Sebagai Kontrak
|psi> = alpha|0> + beta|1>
* |psi>: Status koin berputar
* alpha: Amplitudo 0
    `;

    const uila = parseUILABlocks(rawMarkdown, {}, "Qubits");
    expect(uila.block1_anomaly?.breakdownPoint).toContain("meledak pada 2^N");
    expect(uila.block2_intuitivePrototype?.isomorphicMapping).toContain("Koin logam");
    expect(uila.block3_coreMechanics?.contrastingCases.length).toBeGreaterThan(0);
    expect(uila.block4_notationContract?.termsDeconstruction.length).toBeGreaterThan(0);
  });

  it("builds multidimensional expansion pathways with depth spiral and isomorphic bridges", () => {
    const pathways = parseExpansionPathways({}, "Distributed Consensus", "hgd://cs/consensus/001");
    expect(pathways.depthLevel).toBe(1);
    expect(pathways.deeperSpiralNodeId).toContain("deep-spiral");
    expect(pathways.branches?.length).toBe(2);
    expect(pathways.isomorphicBridges?.length).toBe(1);
    expect(pathways.isomorphicBridges?.[0].sharedInvariant).toBeDefined();
  });

  it("validates NodeShard containing UILA and expansion pathways against Draft 2020-12 schema", () => {
    const shard: NodeShard = {
      shardId: "shard_uila_test",
      curriculumId: "quantum-test",
      nodes: [
        {
          id: "hgd://quantum/test/node-001",
          title: "Qubit Test",
          cognitiveLevel: "understand",
          prerequisites: [],
          conceptSummary: "Test summary",
          uila: {
            block1_anomaly: {
              groundState: "State",
              oldWay: "Old way",
              breakdownPoint: "Failure point",
            },
            block2_intuitivePrototype: {
              physicalObject: "Coin",
              isomorphicMapping: "Spinning coin",
              deadlockResolution: "Simultaneous states",
            },
            block3_coreMechanics: {
              invariantProperty: "Conservation of 1.0",
              variableComponents: ["Alpha", "Beta"],
              contrastingCases: [
                {
                  beginnerMisconception: "Both 0 and 1 measured",
                  physicalReality: "Collapses to one",
                },
              ],
            },
            block4_notationContract: {
              formulaOrCode: "|psi> = a|0> + b|1>",
              minimalFormalization: "Dirac notation",
              termsDeconstruction: [
                { symbol: "|psi>", physicalMeaning: "State" },
              ],
            },
          },
          expansionPathways: {
            depthLevel: 1,
            branches: [
              { trackName: "Rigor", targetNodeId: "hgd://quantum/test/node-001-rigor" },
            ],
            isomorphicBridges: [
              { domain: "Physics", targetNodeId: "hgd://phys/001", sharedInvariant: "Energy conservation" },
            ],
          },
          forwardPass: {
            probeType: "prediction_what_if",
            prompt: "Predict outcome",
            expectedMentalModel: ["hadamard"],
            groundTruth: "50% each",
          },
          lossRubric: {
            conceptGapCriteria: ["Gap"],
            notationCriteria: ["Notation"],
            strategyCriteria: ["Strategy"],
            reasoningCriteria: ["Reasoning"],
          },
          backwardPass: {
            hintLadder: {
              level0Reflective: "T0",
              level1Directional: "T1",
              level2Constraint: "T2",
              level3WorkedExample: "T3",
            },
            microRemediations: {
              conceptGap: "Fix gap",
              notationBreakdown: "Fix notation",
              methodChoice: "Fix method",
              reasoningBug: "Fix bug",
            },
          },
        },
      ],
    };

    const res = validator.validateShard(shard);
    expect(res.valid).toBe(true);
  });

  it("validates LearnerState containing dailyActivityLog for GitHub-style heatmap against schema", () => {
    const state: LearnerState = {
      learnerId: "learner_001",
      curriculumId: "quantum-test",
      lastUpdated: new Date().toISOString(),
      globalMastery: 0.85,
      weights: {
        "node-001": { theta: 0.95, confidence: 0.9, lastLoss: 0.0, attempts: 1 },
      },
      activeFrontier: ["node-002"],
      masteredNodes: ["node-001"],
      dailyActivityLog: {
        "2026-10-30": { epochs: 6, nodesMastered: 2, intensity: 3 },
        "2026-10-31": { epochs: 12, nodesMastered: 4, intensity: 4 },
      },
    };

    const res = validator.validateState(state);
    expect(res.valid).toBe(true);
  });
});
