export type CognitiveLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

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

export interface NodePacing {
  timeLimitSeconds?: number;
  recommendedEpochs?: number;
  isCheckpoint?: boolean;
  rollbackNodeId?: string;
}

export interface ForwardPassProbe {
  probeType: ProbeType;
  readingContext?: string;
  prompt: string;
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

export interface CompetencyNode {
  id: string;
  title: string;
  cognitiveLevel: CognitiveLevel;
  prerequisites: string[];
  conceptSummary: string;
  pacing?: NodePacing;
  forwardPass: ForwardPassProbe;
  lossRubric: LossRubric;
  backwardPass: BackwardPassScaffold;
  sources?: SourceCitation[];
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

export interface LearnerState {
  learnerId: string;
  curriculumId: string;
  lastUpdated: string;
  globalMastery: number;
  learningRateAlpha?: number;
  pacingState?: PacingState;
  weights: Record<string, NodeWeight>;
  activeFrontier: string[];
  masteredNodes: string[];
  lossHistory?: HistoricalLossEntry[];
}
