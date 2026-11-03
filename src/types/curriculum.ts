import type {
  UILABlocks,
  ExpansionPathways,
  DailyActivityLog,
} from "./uila.js";

export type CognitiveLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type DomainType =
  | "stem"
  | "humanities"
  | "law"
  | "medicine"
  | "linguistics"
  | "general";

export type DifficultyTier =
  | "1_foundational_fluency"
  | "2_boundary_perturbation"
  | "3_isomorphic_transfer"
  | "4_adversarial_dilemma";

export type ProbeType =
  | "prediction_what_if"
  | "pre_test"
  | "counterfactual"
  | "mechanism_guess"
  | "code_output_prediction";

export type RelationType =
  | "prerequisite"
  | "corequisite"
  | "analogy"
  | "extension";

export type PacingMode = "time_bounded" | "self_paced";

export interface TimeBoundedConfig {
  defaultNodeTimeoutSeconds?: number;
  totalCurriculumBudgetMinutes?: number;
  autoEscalateHintOnTimeout?: boolean;
  stagnationWarningSeconds?: number;
}

export interface CurriculumCheckpoint {
  checkpointId: string;
  title: string;
  milestoneNodeId: string;
  requiredMasteryTheta: number;
}

export interface CurriculumPacing {
  defaultMode: PacingMode;
  timeBoundedConfig?: TimeBoundedConfig;
  checkpoints?: CurriculumCheckpoint[];
}

export interface WorkingMemoryBudget {
  wordCount?: number;
  estimatedReadingSeconds?: number;
}

export interface ConceptualVariant {
  representationType: "code" | "symbolic" | "verbal" | "tabular" | "visual";
  content: string;
}

export interface ProceduralPerturbation {
  parameter: string;
  perturbation: string;
  probe: string;
  expectedBoundaryBehavior: string;
}

export interface VariationProbes {
  conceptualVariants?: ConceptualVariant[];
  proceduralPerturbations?: ProceduralPerturbation[];
}

export interface NodePacing {
  timeLimitSeconds?: number;
  recommendedEpochs?: number;
  isCheckpoint?: boolean;
  rollbackNodeId?: string;
}

export interface DiagnosticOption {
  optionId: string;
  text: string;
  isCorrect: boolean;
  causalRationale: string;
  diagnosticAxis?: keyof LossVector;
  specificRemediation?: string;
}

export interface ForwardPassProbe {
  probeType: ProbeType;
  readingContext?: string;
  microPrimer?: string;
  prompt: string;
  options?: DiagnosticOption[];
  expectedMentalModel: string[];
  groundTruth: string;
}

export interface LossRubric {
  conceptGapCriteria: string[];
  missingPrerequisiteMap?: Record<string, string>;
  notationCriteria: string[];
  strategyCriteria: string[];
  reasoningCriteria: string[];
}

export interface HintLadder {
  level0Reflective: string;
  level1Directional: string;
  level2Constraint: string;
  level3WorkedExample: string;
}

export interface MicroRemediations {
  conceptGap: string;
  missingPrerequisite?: string;
  notationBreakdown: string;
  methodChoice: string;
  reasoningBug: string;
}

export interface BackwardPassScaffold {
  learningRate?: number;
  hintLadder: HintLadder;
  microRemediations: MicroRemediations;
}

export interface SourceCitation {
  sourceRef: string;
  locationTag: string;
  verbatimQuote?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  highSchoolAnchor?: string;
}

export interface CompetencyNode {
  id: string;
  title: string;
  cognitiveLevel: CognitiveLevel;
  difficultyTier?: DifficultyTier;
  workingMemoryBudget?: WorkingMemoryBudget;
  prerequisites: string[];
  conceptSummary: string;
  pacing?: NodePacing;
  variationProbes?: VariationProbes;
  uila?: UILABlocks;
  expansionPathways?: ExpansionPathways;
  forwardPass: ForwardPassProbe;
  lossRubric: LossRubric;
  backwardPass: BackwardPassScaffold;
  sources?: SourceCitation[];
  glossary?: GlossaryTerm[];
}

export interface NodeShard {
  shardId: string;
  curriculumId: string;
  nodes: CompetencyNode[];
}

export interface DagNodeSummary {
  id: string;
  shardId: string;
  title: string;
  cognitiveLevel: CognitiveLevel;
}

export interface DagEdge {
  from: string;
  to: string;
  relationType: RelationType;
}

export interface ShardCatalogEntry {
  shardId: string;
  filePath: string;
  nodeCount: number;
  nodeIds: string[];
}

export interface CurriculumScale {
  totalNodes: number;
  totalShards: number;
  approxWordCount?: number;
  estimatedLearningHours?: number;
}

export interface CurriculumManifest {
  schemaVersion: "2026.1" | "2026.2";
  curriculumId: string;
  title: string;
  description?: string;
  domain: string;
  domainType?: DomainType;
  compositionalPrimitives?: string[];
  version: string;
  license?: string;
  authors?: string[];
  scale: CurriculumScale;
  pacing: CurriculumPacing;
  shards: ShardCatalogEntry[];
  dag: {
    nodes: DagNodeSummary[];
    edges: DagEdge[];
  };
}

export interface NodeWeight {
  theta: number;
  confidence: number;
  lastLoss: number;
  attempts: number;
  consecutiveCorrect?: number;
  lastReviewTimestamp?: string;
  halfLifeHours?: number;
}

export interface LossVector {
  conceptGap: number;
  missingPrerequisite: number;
  notationBreakdown: number;
  methodChoice: number;
  reasoningBug: number;
}

export interface HistoricalLossEntry {
  timestamp: string;
  nodeId: string;
  totalLoss: number;
  lossVector: LossVector;
}

export interface RollbackEntry {
  timestamp: string;
  fromNodeId: string;
  toCheckpointId: string;
  reason: string;
}

export interface PacingState {
  activeMode: PacingMode;
  totalElapsedSeconds?: number;
  activeNodeElapsedSeconds?: number;
  lastCheckpointId?: string;
  checkpointsReached?: string[];
  rollbackCount?: number;
  rollbackHistory?: RollbackEntry[];
}

export interface FatigueMetrics {
  averageLatencySeconds?: number;
  consecutiveHurriedSlips?: number;
  fatigueScore?: number;
  cooldownActive?: boolean;
  cooldownUntil?: string;
  recommendedMode?: PacingMode;
}

export interface LearnerState {
  learnerId: string;
  curriculumId: string;
  lastUpdated: string;
  globalMastery: number;
  learningRateAlpha?: number;
  pacingState?: PacingState;
  fatigueMetrics?: FatigueMetrics;
  weights: Record<string, NodeWeight>;
  activeFrontier: string[];
  masteredNodes: string[];
  dailyActivityLog?: DailyActivityLog;
  lossHistory?: HistoricalLossEntry[];
}

export type AuditSeverity = "ERROR" | "WARNING" | "INFO";

export interface AuditViolation {
  nodeId: string;
  ruleId: string;
  severity: AuditSeverity;
  tier: 1 | 2 | 3;
  message: string;
  remediation: string;
}

export interface CurriculumAuditReport {
  valid: boolean;
  strictValid: boolean;
  score: number;
  totalNodes: number;
  passedRules: string[];
  violations: AuditViolation[];
  summary: {
    errors: number;
    warnings: number;
    tier1Pass: boolean;
    tier2Pass: boolean;
    tier3Pass: boolean;
  };
}
