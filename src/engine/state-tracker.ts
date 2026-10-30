import type {
  LearnerState,
  NodeWeight,
  CurriculumManifest,
  LossVector,
} from "../types/curriculum.js";

export class LearnerStateTracker {
  /**
   * Initializes a fresh learner state for a curriculum.
   */
  public initializeState(
    learnerId: string,
    manifest: CurriculumManifest
  ): LearnerState {
    const state: LearnerState = {
      learnerId,
      curriculumId: manifest.curriculumId,
      lastUpdated: new Date().toISOString(),
      globalMastery: 0.0,
      learningRateAlpha: 0.25,
      weights: {},
      activeFrontier: [],
      masteredNodes: [],
      lossHistory: [],
    };

    this.recomputeFrontier(state, manifest);
    return state;
  }

  /**
   * Applies an iteration weight update delta and records loss history.
   */
  public updateWeight(
    state: LearnerState,
    nodeId: string,
    deltaTheta: number,
    totalLoss: number,
    lossVector: LossVector,
    manifest: CurriculumManifest
  ): NodeWeight {
    const now = new Date().toISOString();
    const existing = state.weights[nodeId] || {
      theta: 0.0,
      confidence: 0.1,
      lastLoss: 1.0,
      attempts: 0,
      consecutiveCorrect: 0,
      lastReviewTimestamp: now,
      halfLifeHours: 72.0,
    };

    const newTheta = Math.min(1.0, Math.max(0.0, Number((existing.theta + deltaTheta).toFixed(4))));
    const isSuccess = totalLoss <= 0.05;
    const consecutiveCorrect = isSuccess ? (existing.consecutiveCorrect || 0) + 1 : 0;
    const newHalfLife = isSuccess
      ? Number(((existing.halfLifeHours || 72.0) * 1.5).toFixed(1))
      : existing.halfLifeHours || 72.0;

    const updatedWeight: NodeWeight = {
      theta: newTheta,
      confidence: Math.min(1.0, Number((0.5 + 0.5 * newTheta).toFixed(3))),
      lastLoss: totalLoss,
      attempts: existing.attempts + 1,
      consecutiveCorrect,
      lastReviewTimestamp: now,
      halfLifeHours: newHalfLife,
    };

    state.weights[nodeId] = updatedWeight;
    state.lastUpdated = now;

    // Record loss history
    state.lossHistory = state.lossHistory || [];
    state.lossHistory.push({
      timestamp: now,
      nodeId,
      totalLoss,
      lossVector,
    });

    this.recomputeFrontier(state, manifest);
    return updatedWeight;
  }

  /**
   * Recomputes active frontier and mastered nodes from DAG topology.
   */
  public recomputeFrontier(
    state: LearnerState,
    manifest: CurriculumManifest
  ): void {
    const mastered = new Set<string>();
    const frontier: string[] = [];
    const nodeMap = new Map(manifest.dag.nodes.map((n) => [n.id, n]));

    // Find mastered nodes (theta >= 0.95)
    for (const [id, weight] of Object.entries(state.weights)) {
      if (weight.theta >= 0.95 && (weight.consecutiveCorrect || 0) >= 1) {
        mastered.add(id);
      }
    }

    // Build prerequisite map from edges
    const prereqMap = new Map<string, string[]>();
    for (const edge of manifest.dag.edges) {
      if (edge.relationType === "prerequisite") {
        const list = prereqMap.get(edge.to) || [];
        list.push(edge.from);
        prereqMap.set(edge.to, list);
      }
    }

    // A node is in active frontier if not mastered and all prerequisites are mastered
    for (const node of manifest.dag.nodes) {
      if (mastered.has(node.id)) continue;

      const prereqs = prereqMap.get(node.id) || [];
      const allPrereqsMet = prereqs.every((pId) => mastered.has(pId));

      if (allPrereqsMet) {
        frontier.push(node.id);
      }
    }

    state.masteredNodes = Array.from(mastered);
    state.activeFrontier = frontier;
    state.globalMastery = Number(
      (manifest.dag.nodes.length > 0
        ? state.masteredNodes.length / manifest.dag.nodes.length
        : 0.0
      ).toFixed(4)
    );
  }

  /**
   * Applies Ebbinghaus forgetting decay to all node weights based on elapsed hours.
   */
  public applyTemporalDecay(
    state: LearnerState,
    manifest: CurriculumManifest,
    simulatedNow: Date = new Date()
  ): number {
    let decayedCount = 0;

    for (const [nodeId, weight] of Object.entries(state.weights)) {
      if (!weight.lastReviewTimestamp) continue;
      const lastReview = new Date(weight.lastReviewTimestamp);
      const elapsedHours = Math.max(
        0,
        (simulatedNow.getTime() - lastReview.getTime()) / (1000 * 60 * 60)
      );

      if (elapsedHours > 0) {
        const halfLife = weight.halfLifeHours || 72.0;
        const decayFactor = Math.pow(2, -elapsedHours / halfLife);
        const decayedTheta = Number((weight.theta * decayFactor).toFixed(4));

        if (decayedTheta < weight.theta) {
          weight.theta = decayedTheta;
          decayedCount++;
        }
      }
    }

    if (decayedCount > 0) {
      this.recomputeFrontier(state, manifest);
    }
    return decayedCount;
  }
}
