// Human Gradient Descent (HGD) - Reference Headless UI Controller
import { initFormatters } from "./rich-formatter.js";
import {
  updateTimerUI,
  renderActiveNode,
  renderLoss,
  revealHint,
  resetLossDisplay,
  showSuccessMessage,
  showWarningMessage,
  showRollbackAlert,
  renderFrontierList,
  renderStats,
} from "./ui-renderer.js";
import {
  renderHeatmap,
  renderUILABlocks,
  renderSubwayMap,
} from "./uila-renderer.js";

let currentManifest = null;
let currentShards = new Map();
let activeNode = null;
let learnerState = {
  theta: {},
  attempts: {},
  mastered: new Set(),
  activeFrontier: [],
  divergenceCount: 0,
};

let timerInterval = null;
let timeLeftSeconds = 60;
let isTimeBounded = true;
let currentPhase = "phase_a";

const CURRICULA = {
  quantum: {
    manifest: "../sample-curriculum/curriculum-manifest.json",
    basePath: "../sample-curriculum/",
  },
  law: {
    manifest: "../sample-law-curriculum/curriculum-manifest.json",
    basePath: "../sample-law-curriculum/",
  },
  uring: {
    manifest: "../sample-uring-curriculum/curriculum-manifest.json",
    basePath: "../sample-uring-curriculum/",
  },
};

let activeCurriculumKey = "quantum";

export async function initApp() {
  initFormatters();
  setupEventListeners();
  await loadCurriculum(activeCurriculumKey);
}

async function loadCurriculum(key) {
  try {
    const config = CURRICULA[key];
    const res = await fetch(config.manifest);
    currentManifest = await res.json();

    learnerState = {
      theta: {},
      attempts: {},
      mastered: new Set(),
      activeFrontier: [],
      divergenceCount: 0,
    };

    const firstShardFile = currentManifest.shards[0].filePath;
    const sRes = await fetch(`${config.basePath}${firstShardFile}`);
    const shardData = await sRes.json();
    currentShards.set(shardData.shardId, shardData);

    recomputeFrontier();
    selectNode(learnerState.activeFrontier[0]);
    updateFrontierView();
    updateStatsView();
    renderHeatmap(learnerState, "heatmap-card");
  } catch (err) {
    console.error("Failed to load curriculum:", err);
  }
}

function recomputeFrontier() {
  const allNodes = currentManifest.dag.nodes;
  const edges = currentManifest.dag.edges;
  const frontier = [];

  for (const n of allNodes) {
    if (learnerState.mastered.has(n.id)) continue;
    const prereqs = edges.filter((e) => e.to === n.id);
    const allMet = prereqs.every((e) => learnerState.mastered.has(e.from));
    if (allMet) frontier.push(n.id);
  }
  learnerState.activeFrontier = frontier;
}

async function getNodeById(nodeId) {
  const dagNode = currentManifest.dag.nodes.find((n) => n.id === nodeId);
  if (!dagNode) return null;

  if (!currentShards.has(dagNode.shardId)) {
    const shardEntry = currentManifest.shards.find((s) => s.shardId === dagNode.shardId);
    const config = CURRICULA[activeCurriculumKey];
    const res = await fetch(`${config.basePath}${shardEntry.filePath}`);
    const shardData = await res.json();
    currentShards.set(dagNode.shardId, shardData);
  }

  const shard = currentShards.get(dagNode.shardId);
  return shard.nodes.find((n) => n.id === nodeId) || null;
}

async function selectNode(nodeId) {
  if (!nodeId) return;
  activeNode = await getNodeById(nodeId);
  if (!activeNode) return;

  renderActiveNode(activeNode, (opt, card) => handleOptionSelected(opt, card));
  renderUILABlocks(activeNode, "uila-container", () => setPhase("phase_b"));
  renderSubwayMap(activeNode, "subway-map-container");
  renderHeatmap(learnerState, "heatmap-card");
  resetLossDisplay();
  setPhase("phase_a");
  updateFrontierView();
}

function setPhase(phase) {
  currentPhase = phase;
  const badge = document.getElementById("phase-indicator");
  const timerElem = document.getElementById("timer-display");
  if (!badge) return;
  if (phase === "phase_a") {
    badge.className = "phase-badge phase-a";
    badge.textContent = "Phase 1: Untimed Primer";
    clearInterval(timerInterval);
    if (timerElem) timerElem.textContent = "UNTIMED";
  } else {
    badge.className = "phase-badge phase-b";
    badge.textContent = "Phase 2: Timed Sprint";
    startTimer(activeNode?.pacing?.timeLimitSeconds || 60);
  }
}

function handleOptionSelected(opt, card) {
  if (!activeNode) return;
  if (currentPhase !== "phase_b") setPhase("phase_b");

  document.querySelectorAll(".option-card").forEach((c) => {
    c.classList.remove("selected-correct", "selected-incorrect");
  });

  const currentAttempts = (learnerState.attempts[activeNode.id] || 0) + 1;
  learnerState.attempts[activeNode.id] = currentAttempts;

  if (opt.isCorrect) {
    card.classList.add("selected-correct");
    const zeroVector = { lConcept: 0.0, lPrereq: 0.0, lNotation: 0.0, lStrategy: 0.0, lReasoning: 0.0 };
    renderLoss(0.0, zeroVector);

    learnerState.mastered.add(activeNode.id);
    learnerState.theta[activeNode.id] = 0.95;
    learnerState.divergenceCount = 0;
    clearInterval(timerInterval);

    showSuccessMessage(opt.causalRationale);
    recomputeFrontier();
    updateFrontierView();
    updateStatsView();
    renderHeatmap(learnerState, "heatmap-card");

    setTimeout(() => {
      if (learnerState.activeFrontier.length > 0) {
        selectNode(learnerState.activeFrontier[0]);
      }
    }, 1200);
  } else {
    card.classList.add("selected-incorrect");
    const axis = opt.diagnosticAxis || "conceptGap";
    const vector = {
      lConcept: axis === "conceptGap" ? 1.0 : 0.2,
      lPrereq: axis === "missingPrerequisite" ? 1.0 : 0.1,
      lNotation: axis === "notationBreakdown" ? 1.0 : 0.1,
      lStrategy: axis === "methodChoice" ? 1.0 : 0.2,
      lReasoning: axis === "reasoningBug" ? 1.0 : 0.2,
    };
    const totalLoss = Number(
      (0.35 * vector.lConcept + 0.2 * vector.lPrereq + 0.15 * vector.lNotation + 0.15 * vector.lStrategy + 0.15 * vector.lReasoning).toFixed(2)
    );

    renderLoss(totalLoss, vector);
    revealHint(Math.min(currentAttempts, 3), activeNode.backwardPass.hintLadder);

    const rem = opt.specificRemediation ? ` ${opt.specificRemediation}` : "";
    showWarningMessage(`${opt.causalRationale}${rem}`);

    if (currentAttempts >= 3) {
      learnerState.divergenceCount++;
      showRollbackAlert(activeNode, (rollbackId) => selectNode(rollbackId));
    }
  }
}

function startTimer(seconds) {
  clearInterval(timerInterval);
  timeLeftSeconds = seconds;
  updateTimerUI(isTimeBounded, timeLeftSeconds);

  if (!isTimeBounded) return;

  timerInterval = setInterval(() => {
    timeLeftSeconds--;
    updateTimerUI(isTimeBounded, timeLeftSeconds);

    if (timeLeftSeconds <= 0) {
      clearInterval(timerInterval);
      revealHint(1, activeNode?.backwardPass?.hintLadder);
    }
  }, 1000);
}

function evaluatePrediction(userAnswer) {
  if (!activeNode) return;
  if (currentPhase !== "phase_b") setPhase("phase_b");
  const lowerAns = userAnswer.toLowerCase();

  const isColdStart = ["don't know", "dont know", "idk", "tidak tahu", "belum tahu", "blank", ""].some((s) => lowerAns.includes(s));
  if (isColdStart) {
    renderLoss(0.72, { lConcept: 1.0, lPrereq: 1.0, lNotation: 0.4, lStrategy: 0.4, lReasoning: 0.4 });
    revealHint(3, activeNode.backwardPass.hintLadder);
    showWarningMessage("Cold-Start Activated: Foundation primer triggered. Study the worked solution below, then test your understanding on the probe.");
    return;
  }

  const models = activeNode.forwardPass.expectedMentalModel || [];

  let matched = 0;
  for (const m of models) {
    if (lowerAns.includes(m.toLowerCase())) matched++;
  }

  const modelRecall = models.length > 0 ? matched / models.length : 0.5;
  const lConcept = Number((1.0 - modelRecall).toFixed(2));
  const lPrereq = lConcept > 0.6 ? 0.4 : 0.0;
  const lNotation = lowerAns.length < 15 ? 0.3 : 0.0;
  const lStrategy = lConcept > 0.4 ? 0.2 : 0.0;
  const lReasoning = lowerAns.includes("because") || lowerAns.includes("invariant") ? 0.0 : 0.25;

  const totalLoss = Number(
    (0.35 * lConcept + 0.2 * lPrereq + 0.15 * lNotation + 0.15 * lStrategy + 0.15 * lReasoning).toFixed(2)
  );

  const currentAttempts = (learnerState.attempts[activeNode.id] || 0) + 1;
  learnerState.attempts[activeNode.id] = currentAttempts;

  renderLoss(totalLoss, { lConcept, lPrereq, lNotation, lStrategy, lReasoning });

  if (totalLoss <= 0.15) {
    learnerState.mastered.add(activeNode.id);
    learnerState.theta[activeNode.id] = 0.95;
    learnerState.divergenceCount = 0;
    clearInterval(timerInterval);

    showSuccessMessage(`Node Mastered (Theta = 0.95). Unlocking downstream competencies.`);
    recomputeFrontier();
    updateFrontierView();
    updateStatsView();
    renderHeatmap(learnerState, "heatmap-card");

    setTimeout(() => {
      if (learnerState.activeFrontier.length > 0) {
        selectNode(learnerState.activeFrontier[0]);
      }
    }, 1200);
  } else {
    revealHint(Math.min(currentAttempts, 3), activeNode.backwardPass.hintLadder);
    if (currentAttempts >= 3) {
      learnerState.divergenceCount++;
      showRollbackAlert(activeNode, (rollbackId) => selectNode(rollbackId));
    }
  }
}

function updateFrontierView() {
  renderFrontierList(
    currentManifest.dag.nodes,
    learnerState,
    activeNode,
    (id) => selectNode(id)
  );
}

function updateStatsView() {
  renderStats(currentManifest.scale.totalNodes, learnerState.mastered.size);
}

function setupEventListeners() {
  document.getElementById("select-curriculum")?.addEventListener("change", (e) => {
    activeCurriculumKey = e.target.value;
    loadCurriculum(activeCurriculumKey);
  });

  document.getElementById("select-pacing")?.addEventListener("change", (e) => {
    isTimeBounded = e.target.value === "time_bounded";
    startTimer(activeNode?.pacing?.timeLimitSeconds || 60);
  });

  document.getElementById("user-prediction")?.addEventListener("focus", () => {
    if (currentPhase !== "phase_b") setPhase("phase_b");
  });

  document.getElementById("btn-submit")?.addEventListener("click", () => {
    const ans = document.getElementById("user-prediction")?.value.trim();
    if (ans) evaluatePrediction(ans);
  });

  document.getElementById("btn-coldstart")?.addEventListener("click", () => {
    evaluatePrediction("don't know");
  });

  document.getElementById("user-prediction")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const ans = e.target.value.trim();
      if (ans) evaluatePrediction(ans);
    }
  });

  for (let i = 0; i <= 3; i++) {
    document.getElementById(`hint-header-${i}`)?.addEventListener("click", () => {
      const b = document.getElementById(`hint-body-${i}`);
      if (b && b.textContent.trim()) {
        b.style.display = b.style.display === "none" ? "block" : "none";
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", initApp);
