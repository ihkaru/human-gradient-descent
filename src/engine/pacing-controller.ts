import type {
  CurriculumManifest,
  CompetencyNode,
  PacingMode,
} from "../types/curriculum.js";

export interface NodePacingContext {
  mode: PacingMode;
  timeLimitSeconds: number;
  stagnationWarningSeconds: number;
  autoEscalateOnTimeout: boolean;
}

export class PacingController {
  /**
   * Resolves the effective pacing configuration for a node.
   */
  public resolveNodePacing(
    node: CompetencyNode,
    manifest: CurriculumManifest,
    requestedMode?: PacingMode
  ): NodePacingContext {
    const mode = requestedMode || manifest.pacing?.defaultMode || "self_paced";
    const cfg = manifest.pacing?.timeBoundedConfig;

    const defaultTimeout = cfg?.defaultNodeTimeoutSeconds || 60;
    const timeLimitSeconds =
      mode === "time_bounded"
        ? node.pacing?.timeLimitSeconds || defaultTimeout
        : 0;

    const stagnationWarningSeconds = cfg?.stagnationWarningSeconds || 30;
    const autoEscalateOnTimeout =
      cfg?.autoEscalateHintOnTimeout !== undefined
        ? cfg.autoEscalateHintOnTimeout
        : true;

    return {
      mode,
      timeLimitSeconds,
      stagnationWarningSeconds,
      autoEscalateOnTimeout,
    };
  }

  /**
   * Checks if elapsed time exceeded timeout in time-bounded mode.
   */
  public checkTimeout(
    elapsedSeconds: number,
    pacingContext: NodePacingContext
  ): { isTimeout: boolean; shouldEscalateHint: boolean } {
    if (pacingContext.mode !== "time_bounded") {
      return { isTimeout: false, shouldEscalateHint: false };
    }

    const isTimeout = elapsedSeconds >= pacingContext.timeLimitSeconds;
    const shouldEscalateHint = isTimeout && pacingContext.autoEscalateOnTimeout;

    return { isTimeout, shouldEscalateHint };
  }
}
