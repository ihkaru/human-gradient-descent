// Human Gradient Descent (HGD) - Reference Headless UI Controller
import {
  updateTimerUI,
  renderActiveNode,
  renderLoss,
  revealHint,
  resetLossDisplay,
  showSuccessMessage,
  showRollbackAlert,
  renderFrontierList,
  renderStats,
} from "./ui-renderer.js";

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

const CURRICULA = {
  quantum: {
    manifest: "../sample-curriculum/curriculum-manifest.json",
    basePath: "../sample-curriculum/",
  },
  law: {
    manifest: "../sample-law-curriculum/curriculum-manifest.json",
    basePath: "../sample-law-curriculum/",
  },
};

let activeCurriculumKey = "quantum";

export async function initApp() {
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

  renderActiveNode(activeNode);
  resetLossDisplay();
  startTimer(activeNode.pacing.timeLimitSeconds || 60);
  updateFrontierView();
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
  const lowerAns = userAnswer.toLowerCase();
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

    showSuccessMessage(`🎉 Node Mastered! θ = 0.95. Unlocking downstream competencies.`);
    recomputeFrontier();
    updateFrontierView();
    updateStatsView();

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

  document.getElementById("btn-submit")?.addEventListener("click", () => {
    const ans = document.getElementById("user-prediction")?.value.trim();
    if (ans) evaluatePrediction(ans);
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
