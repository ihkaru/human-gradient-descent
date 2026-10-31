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

export function renderActiveNode(activeNode, onSelectOption) {
  if (!activeNode) return;
  document.getElementById("node-title").textContent = activeNode.title;
  document.getElementById("node-level").textContent = activeNode.cognitiveLevel;
  document.getElementById("node-tier").textContent = activeNode.difficultyTier.replace(/^\d+_/, "");

  const primer = activeNode.forwardPass.microPrimer || activeNode.forwardPass.readingContext || activeNode.conceptSummary;
  const primerElem = document.getElementById("primer-text");
  if (primerElem) primerElem.textContent = primer;

  document.getElementById("prompt-text").textContent = activeNode.forwardPass.prompt;
  document.getElementById("reading-latency").textContent = `${activeNode.workingMemoryBudget.estimatedReadingSeconds}s read`;
  document.getElementById("word-count").textContent = `${activeNode.workingMemoryBudget.wordCount} words`;

  renderOptions(activeNode.forwardPass.options, onSelectOption);
}

export function renderOptions(options, onSelectOption) {
  const container = document.getElementById("options-list");
  if (!container) return;
  container.innerHTML = "";

  if (!options || options.length === 0) {
    container.innerHTML = "<p style='font-size:0.8rem;color:var(--text-muted);'>No diagnostic hypotheses specified.</p>";
    return;
  }

  const letters = ["A", "B", "C", "D", "E"];
  options.forEach((opt, idx) => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <span class="option-chip">${letters[idx] || String(idx + 1)}</span>
      <span style="overflow-wrap:anywhere;word-break:break-word;">${opt.text}</span>
    `;

    card.addEventListener("click", () => {
      onSelectOption(opt, card);
    });

    container.appendChild(card);
  });
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

const SVG_ALERT = `<svg style="width:16px;height:16px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

export function showSuccessMessage(msg) {
  const alertElem = document.getElementById("divergence-alert");
  if (alertElem) {
    alertElem.innerHTML = `<div style="display:flex;align-items:center;gap:0.5rem;">${SVG_CHECK}<span>${msg}</span></div>`;
    alertElem.className = "alert success";
    alertElem.style.display = "flex";
  }
}

export function showWarningMessage(msg) {
  const alertElem = document.getElementById("divergence-alert");
  if (alertElem) {
    alertElem.innerHTML = `<div style="display:flex;align-items:center;gap:0.5rem;">${SVG_ALERT}<span>${msg}</span></div>`;
    alertElem.className = "alert warning";
    alertElem.style.display = "flex";
  }
}

export function showRollbackAlert(activeNode, onRollback) {
  const alertElem = document.getElementById("divergence-alert");
  const rollbackNodeId = activeNode.pacing.rollbackNodeId || activeNode.prerequisites[0];
  if (alertElem && rollbackNodeId) {
    alertElem.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;">
        ${SVG_ALERT}
        <span><strong>Divergence Detected!</strong> Loss stagnated across 3 attempts.</span>
      </div>
      <button id="btn-rollback" class="badge rose" style="cursor:pointer">Rollback to Prerequisite</button>
    `;
    alertElem.className = "alert warning";
    alertElem.style.display = "flex";

    document.getElementById("btn-rollback")?.addEventListener("click", () => {
      onRollback(rollbackNodeId);
    });
  }
}

const SVG_CHECK = `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const SVG_ACTIVE = `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
const SVG_READY = `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const SVG_LOCK = `<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

export function renderFrontierList(dagNodes, learnerState, activeNode, onSelectNode) {
  const list = document.getElementById("frontier-nodes");
  if (!list) return;
  list.innerHTML = "";

  for (const n of dagNodes) {
    const item = document.createElement("div");
    const isMastered = learnerState.mastered.has(n.id);
    const isActive = activeNode && activeNode.id === n.id;
    const isFrontier = learnerState.activeFrontier.includes(n.id);

    const icon = isMastered ? SVG_CHECK : isActive ? SVG_ACTIVE : isFrontier ? SVG_READY : SVG_LOCK;
    const label = isMastered ? "Mastered" : isActive ? "Active" : isFrontier ? "Ready" : "Locked";
    const color = isMastered ? "emerald" : isActive ? "cyan" : isFrontier ? "amber" : "";

    item.className = `node-item ${isActive ? "active" : isMastered ? "mastered" : isFrontier ? "" : "locked"}`;
    item.innerHTML = `
      <span style="overflow-wrap:anywhere;word-break:break-word;">${n.title}</span>
      <span class="badge ${color}">
        ${icon}
        <span>${label}</span>
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
