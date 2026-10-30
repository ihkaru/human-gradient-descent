import type {
  LearnerState,
  FatigueMetrics,
  PacingMode,
} from "../types/curriculum.js";
import type { DiagnosticLossResult } from "./loss-engine.js";

export interface FatigueAssessment {
  fatigueScore: number;
  isFatigued: boolean;
  cooldownTriggered: boolean;
  cooldownSeconds: number;
  consecutiveHurriedSlips: number;
  recommendedMode: PacingMode;
  warningMessage?: string;
}

export class FatigueGovernor {
  private hurriedLatencyThreshold = 3.0; // Seconds: under 3s with high loss = blind guess
  private fatigueScoreThreshold = 0.7;

  /**
   * Evaluates response metrics and updates learner fatigue state.
   */
  public evaluateFatigue(
    state: LearnerState,
    elapsedSeconds: number,
    lossResult: DiagnosticLossResult,
    currentMode: PacingMode
  ): FatigueAssessment {
    const metrics: FatigueMetrics = state.fatigueMetrics || {
      averageLatencySeconds: elapsedSeconds,
      consecutiveHurriedSlips: 0,
      fatigueScore: 0.0,
      cooldownActive: false,
      recommendedMode: currentMode,
    };

    // Update moving average latency
    const prevAvg = metrics.averageLatencySeconds || elapsedSeconds;
    const newAvg = Number((prevAvg * 0.7 + elapsedSeconds * 0.3).toFixed(2));
    metrics.averageLatencySeconds = newAvg;

    // Detect hurried slips (guessing under time pressure)
    const isHurriedSlip =
      elapsedSeconds < this.hurriedLatencyThreshold &&
      lossResult.totalLoss > 0.4;

    if (isHurriedSlip) {
      metrics.consecutiveHurriedSlips =
        (metrics.consecutiveHurriedSlips || 0) + 1;
    } else if (lossResult.converged) {
      metrics.consecutiveHurriedSlips = 0;
    }

    // Detect exhaustion (latency drifting > 3x average with rising loss)
    const isExhaustionDrift =
      elapsedSeconds > newAvg * 2.5 && lossResult.totalLoss > 0.5;

    // Calculate fatigue score (0.0 to 1.0)
    let fatigueDelta = 0.0;
    if (isHurriedSlip) fatigueDelta += 0.25;
    if (isExhaustionDrift) fatigueDelta += 0.3;
    if (lossResult.converged) fatigueDelta -= 0.15;

    const currentScore = metrics.fatigueScore || 0.0;
    const newScore = Math.min(1.0, Math.max(0.0, Number((currentScore + fatigueDelta).toFixed(2))));
    metrics.fatigueScore = newScore;

    const isFatigued = newScore >= this.fatigueScoreThreshold;
    let cooldownTriggered = false;
    let cooldownSeconds = 0;
    let warningMessage: string | undefined;

    if (isFatigued) {
      cooldownTriggered = true;
      cooldownSeconds = 180; // 3-minute cooldown
      const cooldownDate = new Date(Date.now() + cooldownSeconds * 1000);
      metrics.cooldownActive = true;
      metrics.cooldownUntil = cooldownDate.toISOString();
      metrics.recommendedMode = "self_paced";

      warningMessage =
        "🛑 Anti-Fatigue Circuit Breaker Triggered: High cognitive thrashing detected. Mandatory 3-minute neural consolidation cooldown activated. Recommended mode: self_paced.";
    } else {
      metrics.cooldownActive = false;
      metrics.cooldownUntil = undefined;
      metrics.recommendedMode = currentMode;
    }

    state.fatigueMetrics = metrics;

    return {
      fatigueScore: newScore,
      isFatigued,
      cooldownTriggered,
      cooldownSeconds,
      consecutiveHurriedSlips: metrics.consecutiveHurriedSlips || 0,
      recommendedMode: metrics.recommendedMode || currentMode,
      warningMessage,
    };
  }
}
