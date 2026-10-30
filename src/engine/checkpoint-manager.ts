import type {
  CurriculumManifest,
  LearnerState,
  CompetencyNode,
  RollbackEntry,
} from "../types/curriculum.js";
import type { DiagnosticLossResult } from "./loss-engine.js";

export interface DivergenceCheckResult {
  diverged: boolean;
  reason?: string;
  rollbackCheckpointId?: string;
  rollbackNodeId?: string;
}

export class CheckpointManager {
  /**
   * Assesses whether a learner's attempt constitutes catastrophic divergence.
   */
  public evaluateDivergence(
    node: CompetencyNode,
    lossResult: DiagnosticLossResult,
    consecutiveFails: number,
    manifest: CurriculumManifest
  ): DivergenceCheckResult {
    // Check 1: Severe prerequisite deficit
    if (lossResult.lossVector.missingPrerequisite >= 0.7) {
      const cp = this.findNearestCheckpoint(node.id, manifest);
      return {
        diverged: true,
        reason: `Severe prerequisite deficit (${lossResult.lossVector.missingPrerequisite}). Missing foundation in parent nodes.`,
        rollbackCheckpointId: cp?.checkpointId,
        rollbackNodeId: cp?.milestoneNodeId,
      };
    }

    // Check 2: Repeated failure (3+ consecutive non-convergent attempts)
    if (consecutiveFails >= 3 && lossResult.totalLoss > 0.4) {
      const cp = this.findNearestCheckpoint(node.id, manifest);
      return {
        diverged: true,
        reason: `Repeated cognitive divergence (${consecutiveFails} failed epochs, loss ${lossResult.totalLoss}).`,
        rollbackCheckpointId: cp?.checkpointId,
        rollbackNodeId: cp?.milestoneNodeId,
      };
    }

    return { diverged: false };
  }

  /**
   * Finds the nearest upstream checkpoint milestone in the curriculum manifest.
   */
  public findNearestCheckpoint(
    activeNodeId: string,
    manifest: CurriculumManifest
  ) {
    const checkpoints = manifest.pacing?.checkpoints || [];
    if (checkpoints.length === 0) return undefined;

    // Find upstream checkpoints
    for (let i = checkpoints.length - 1; i >= 0; i--) {
      const cp = checkpoints[i];
      if (cp.milestoneNodeId !== activeNodeId) {
        return cp;
      }
    }
    return checkpoints[0];
  }

  /**
   * Executes a state rollback to a designated checkpoint.
   */
  public executeRollback(
    state: LearnerState,
    fromNodeId: string,
    checkpointId: string,
    targetNodeId: string,
    reason: string
  ): RollbackEntry {
    const entry: RollbackEntry = {
      timestamp: new Date().toISOString(),
      fromNodeId,
      toCheckpointId: checkpointId,
      reason,
    };

    state.pacingState = state.pacingState || {
      activeMode: "self_paced",
      rollbackCount: 0,
      rollbackHistory: [],
    };

    state.pacingState.rollbackCount = (state.pacingState.rollbackCount || 0) + 1;
    state.pacingState.rollbackHistory = state.pacingState.rollbackHistory || [];
    state.pacingState.rollbackHistory.push(entry);

    // Reset active frontier to target rollback node
    if (!state.activeFrontier.includes(targetNodeId)) {
      state.activeFrontier.unshift(targetNodeId);
    }

    return entry;
  }
}
