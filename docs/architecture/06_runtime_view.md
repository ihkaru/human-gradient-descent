# 6. Runtime View

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `a4b86ba`
> - **Verified Timestamp**: `2026-10-31T20:31:00+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

This section details the dynamic execution flows for fast-paced training epochs, hint ladder escalations, and checkpoint rollbacks.

---

## 6.1 Fast-Paced Timed Epoch & Convergence Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Human Learner
    participant UI as Headless UI / CLI
    participant Pacing as PacingController
    participant FP as ForwardPassEngine
    participant Loss as LossEngine
    participant BP as BackwardPassEngine
    participant State as LearnerStateTracker

    UI->>Pacing: StartNode(nodeId, mode: "time_bounded")
    Pacing->>UI: StartCountdown(60s)
    UI->>FP: RequestChallenge(node)
    FP-->>UI: Return ForwardPassProbe
    UI->>Learner: Display Probe & Countdown Timer

    Learner->>UI: SubmitPrediction(ŷ) [within 45s]
    UI->>Pacing: StopCountdown()
    UI->>Loss: EvaluateLoss(node, ŷ)
    Loss-->>UI: DiagnosticLossResult (Loss=0.03, ZeroLoss)

    UI->>BP: GenerateIntervention(LossResult)
    BP-->>UI: DeltaTheta (+0.25), Converged=true
    UI->>State: UpdateWeight(nodeId, DeltaTheta)
    State->>State: RecomputeFrontier()
    UI->>Learner: Render "🎉 Converged! Next Node Unlocked"
```

---

## 6.2 Divergence Detection & Checkpoint Rollback Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Human Learner
    participant UI as Headless UI / CLI
    participant Loss as LossEngine
    participant CM as CheckpointManager
    participant State as LearnerStateTracker

    Learner->>UI: SubmitPrediction(ŷ) [Attempt 3]
    UI->>Loss: EvaluateLoss(node, ŷ)
    Loss-->>UI: LossResult (Loss=0.88, MissingPrereq, PrereqLoss=0.90)

    UI->>CM: EvaluateDivergence(node, LossResult)
    CM->>CM: DetectCatastrophicMisconception()
    CM->>State: GetNearestCheckpoint(node.id)
    State-->>CM: Checkpoint "CP-02: Foundational Arrays"

    CM->>State: RollbackFrontier(targetCheckpoint: "CP-02")
    State->>State: ResetActiveFrontier("CP-02")
    CM-->>UI: RollbackTriggeredEvent(fromNode, targetCheckpoint, reason)
    UI->>Learner: Render "⚠️ Divergence detected in prerequisites. Rolling back to Checkpoint CP-02 for reinforcement."
```
