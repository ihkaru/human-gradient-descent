export interface ContrastingCase {
  beginnerMisconception: string;
  physicalReality: string;
}

export interface NotationDeconstructionTerm {
  symbol: string;
  calloutLabel?: string;
  physicalMeaning: string;
}

export interface Block1Anomaly {
  groundState: string;
  oldWay: string;
  breakdownPoint: string;
}

export interface Block2IntuitivePrototype {
  physicalObject: string;
  isomorphicMapping: string;
  deadlockResolution: string;
}

export interface Block3CoreMechanics {
  invariantProperty: string;
  variableComponents: string[];
  contrastingCases: ContrastingCase[];
}

export interface Block4NotationContract {
  formulaOrCode: string;
  minimalFormalization: string;
  termsDeconstruction: NotationDeconstructionTerm[];
}

export interface UILABlocks {
  block1_anomaly?: Block1Anomaly;
  block2_intuitivePrototype?: Block2IntuitivePrototype;
  block3_coreMechanics?: Block3CoreMechanics;
  block4_notationContract?: Block4NotationContract;
}

export interface ExpansionBranch {
  trackName: string;
  targetNodeId: string;
  description?: string;
}

export interface IsomorphicBridge {
  domain: string;
  targetNodeId: string;
  sharedInvariant: string;
}

export interface ExpansionPathways {
  depthLevel?: number;
  deeperSpiralNodeId?: string;
  branches?: ExpansionBranch[];
  isomorphicBridges?: IsomorphicBridge[];
}

export interface DailyActivityRecord {
  epochs: number;
  nodesMastered: number;
  intensity: number;
}

export type DailyActivityLog = Record<string, DailyActivityRecord>;
