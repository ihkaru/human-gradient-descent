// Reference UI Renderer & DOM View Manager

export function updateTimerUI(isTimeBounded, timeLeftSeconds) {
  const timerElem = document.getElementById("timer-display");
  if (!timerElem) return;

  if (!isTimeBounded) {
    timerElem.textContent = "Self-Paced";
    timerElem.className = "timer-box";
    return;
  }

  const mins = Math.floor(timeLeftSeconds / 60);
  const secs = timeLeftSeconds % 60;
  timerElem.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (timeLeftSeconds <= 10) {
    timerElem.className = "timer-box timer-danger";
  } else if (timeLeftSeconds <= 25) {
    timerElem.className = "timer-box timer-warning";
  } else {
    timerElem.className = "timer-box";
  }
}

export function renderActiveNode(activeNode) {
  if (!activeNode) return;
  document.getElementById("node-title").textContent = activeNode.title;
  document.getElementById("node-level").textContent = activeNode.cognitiveLevel;
  document.getElementById("node-tier").textContent = activeNode.difficultyTier.replace(/^\d+_/, "");
  document.getElementById("prompt-text").textContent = activeNode.forwardPass.prompt;
  document.getElementById("reading-latency").textContent = `${activeNode.workingMemoryBudget.estimatedReadingSeconds}s read`;
  document.getElementById("word-count").textContent = `${activeNode.workingMemoryBudget.wordCount} words`;
}

export function renderLoss(totalLoss, vector) {
  document.getElementById("loss-total").textContent = totalLoss.toFixed(2);
  const keys = [
    { k: "concept", val: vector.lConcept },
    { k: "prereq", val: vector.lPrereq },
    { k: "notation", val: vector.lNotation },
    { k: "strategy", val: vector.lStrategy },
    { k: "reasoning", val: vector.lReasoning },
  ];
  for (const { k, val } of keys) {
    document.getElementById(`bar-${k}`).style.width = `${val * 100}%`;
    document.getElementById(`val-${k}`).textContent = val.toFixed(2);
  }
}

export function revealHint(tier, ladder) {
  if (!ladder) return;
  const bodies = [
    { el: document.getElementById("hint-body-0"), text: ladder.level0Reflective },
    { el: document.getElementById("hint-body-1"), text: ladder.level1Directional },
    { el: document.getElementById("hint-body-2"), text: ladder.level2Constraint },
    { el: document.getElementById("hint-body-3"), text: ladder.level3WorkedExample },
  ];

  for (let i = 0; i <= 3; i++) {
    if (tier >= i && bodies[i]?.el) {
      bodies[i].el.textContent = bodies[i].text;
      bodies[i].el.style.display = "block";
    }
  }
}

export function resetLossDisplay() {
  document.getElementById("loss-total").textContent = "1.00";
  ["concept", "prereq", "notation", "strategy", "reasoning"].forEach((k) => {
    document.getElementById(`bar-${k}`).style.width = "0%";
    document.getElementById(`val-${k}`).textContent = "0.00";
  });
  for (let i = 0; i <= 3; i++) {
    const el = document.getElementById(`hint-body-${i}`);
    if (el) el.style.display = "none";
  }
  const alertElem = document.getElementById("divergence-alert");
  if (alertElem) alertElem.style.display = "none";
  const userPred = document.getElementById("user-prediction");
  if (userPred) userPred.value = "";
}

export function showSuccessMessage(msg) {
  const alertElem = document.getElementById("divergence-alert");
  if (alertElem) {
    alertElem.innerHTML = `<span>${msg}</span>`;
    alertElem.className = "alert success";
    alertElem.style.display = "flex";
  }
}

export function showRollbackAlert(activeNode, onRollback) {
  const alertElem = document.getElementById("divergence-alert");
  const rollbackNodeId = activeNode.pacing.rollbackNodeId || activeNode.prerequisites[0];
  if (alertElem && rollbackNodeId) {
    alertElem.innerHTML = `
      <span><strong>Divergence Detected!</strong> Loss has stagnated across 3 attempts.</span>
      <button id="btn-rollback" class="badge rose" style="cursor:pointer">Rollback to Prerequisite</button>
    `;
    alertElem.className = "alert warning";
    alertElem.style.display = "flex";

    document.getElementById("btn-rollback")?.addEventListener("click", () => {
      onRollback(rollbackNodeId);
    });
  }
}

export function renderFrontierList(dagNodes, learnerState, activeNode, onSelectNode) {
  const list = document.getElementById("frontier-nodes");
  if (!list) return;
  list.innerHTML = "";

  for (const n of dagNodes) {
    const item = document.createElement("div");
    const isMastered = learnerState.mastered.has(n.id);
    const isActive = activeNode && activeNode.id === n.id;
    const isFrontier = learnerState.activeFrontier.includes(n.id);

    item.className = `node-item ${isActive ? "active" : isMastered ? "mastered" : isFrontier ? "" : "locked"}`;
    item.innerHTML = `
      <span>${n.title}</span>
      <span class="badge ${isMastered ? "emerald" : isActive ? "cyan" : "amber"}">
        ${isMastered ? "Mastered" : isActive ? "Active" : isFrontier ? "Ready" : "Locked"}
      </span>
    `;

    if (isFrontier || isMastered) {
      item.style.cursor = "pointer";
      item.addEventListener("click", () => onSelectNode(n.id));
    }

    list.appendChild(item);
  }
}

export function renderStats(totalNodes, masteredCount) {
  const progressPct = totalNodes > 0 ? (masteredCount / totalNodes) * 100 : 0;
  document.getElementById("stat-progress").textContent = `${progressPct.toFixed(0)}%`;
  document.getElementById("stat-mastered").textContent = `${masteredCount} / ${totalNodes}`;
}
