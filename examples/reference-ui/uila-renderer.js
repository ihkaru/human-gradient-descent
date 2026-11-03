// UILA, Heatmap & Subway Map Renderer Module
import { formatRichText, renderDisplayFormula, renderAllRichElements, stripQuotes } from "./rich-formatter.js";
import { attachGlossaryBadges, renderGlossaryPanel, setupGlossaryListeners } from "./glossary-popover.js";

let activeStep = 0; // 0 = show all, 1 = b1, 2 = b2, 3 = b3, 4 = b4
let isReadingCollapsed = false;

function formatBlockNarrative(text, glossary) {
  if (!text) return "";
  const rich = formatRichText(text);
  const badged = attachGlossaryBadges(rich, glossary);
  const paras = badged.split(/\n\s*\n/).filter(Boolean);
  if (paras.length <= 1) {
    return `<div class="uila-narrative">${badged}</div>`;
  }
  return `<div class="uila-narrative">${paras.map((p) => `<p class="uila-paragraph">${p.trim()}</p>`).join("")}</div>`;
}

export function renderHeatmap(state, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const log = state?.dailyActivityLog || {};
  const totalEpochs = Object.values(log).reduce((acc, c) => acc + (c.epochs || 0), 0) || (state?.masteredNodes?.length || 0) * 3 + 2;
  const masteredCount = state?.masteredNodes?.length || 0;
  const streakDays = Math.min(7, Math.max(1, masteredCount + 1));

  let cellsHtml = "";
  for (let i = 0; i < 35; i++) {
    let lvl = 0;
    if (i > 30) lvl = 4;
    else if (i > 25) lvl = 3;
    else if (i > 18) lvl = 2;
    else if (i > 10) lvl = 1;
    cellsHtml += `<div class="heatmap-cell lvl-${lvl}" title="Day -${35 - i}: Activity level ${lvl}"></div>`;
  }

  container.innerHTML = `
    <div class="heatmap-header">
      <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--accent-emerald);">
        Cognitive Convergence Heatmap
      </span>
      <div class="heatmap-stats">
        <span>Streak: <strong style="color: var(--text-color);">${streakDays} Days</strong></span>
        <span>Epochs: <strong style="color: var(--text-color);">${totalEpochs}</strong></span>
        <span>Invariants Mastered: <strong style="color: var(--accent-emerald);">${masteredCount}</strong></span>
      </div>
    </div>
    <div class="heatmap-grid">${cellsHtml}</div>
  `;
}

export function renderUILABlocks(node, containerId, onFocusTest) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const uila = node?.uila;
  if (!uila) {
    container.innerHTML = "";
    return;
  }

  const b1 = uila.block1_anomaly;
  const b2 = uila.block2_intuitivePrototype;
  const b3 = uila.block3_coreMechanics;
  const b4 = uila.block4_notationContract;

  if (isReadingCollapsed) {
    container.innerHTML = `
      <div class="uila-block b3" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--accent-emerald);">Invariant Grounded</span>
          <div style="font-size: 0.85rem; font-weight: 600;">${formatRichText(b3?.invariantProperty || "System Invariant Active")}</div>
        </div>
        <button id="btn-toggle-reading" class="btn-focus-mode" type="button">Expand Full Reading</button>
      </div>
    `;
    document.getElementById("btn-toggle-reading")?.addEventListener("click", () => {
      isReadingCollapsed = false;
      renderUILABlocks(node, containerId, onFocusTest);
    });
    return;
  }

  let contrastingRows = "";
  if (b3?.contrastingCases) {
    for (const c of b3.contrastingCases) {
      contrastingRows += `
        <tr>
          <td class="td-wrong">${formatRichText(c.beginnerMisconception)}</td>
          <td class="td-right">${formatRichText(c.physicalReality)}</td>
        </tr>
      `;
    }
  }

  let notationChips = "";
  if (b4?.termsDeconstruction) {
    for (const t of b4.termsDeconstruction) {
      notationChips += `
        <div class="notation-chip">
          <strong>${formatRichText(t.symbol)}:</strong> ${formatRichText(t.physicalMeaning)}
        </div>
      `;
    }
  }

  const showB1 = activeStep === 0 || activeStep === 1;
  const showB2 = activeStep === 0 || activeStep === 2;
  const showB3 = activeStep === 0 || activeStep === 3;
  const showB4 = activeStep === 0 || activeStep === 4;

  container.innerHTML = `
    <div class="uila-header-controls">
      <div class="uila-stepper">
        <button class="stepper-pill ${activeStep === 0 ? "active" : ""}" data-step="0">All</button>
        <button class="stepper-pill ${activeStep === 1 ? "active" : ""}" data-step="1">1. Anomali</button>
        <button class="stepper-pill ${activeStep === 2 ? "active" : ""}" data-step="2">2. Prototipe</button>
        <button class="stepper-pill ${activeStep === 3 ? "active" : ""}" data-step="3">3. Invarian</button>
        <button class="stepper-pill ${activeStep === 4 ? "active" : ""}" data-step="4">4. Notasi</button>
      </div>
      <button id="btn-toggle-reading" class="btn-focus-mode" type="button">Focus on Test Mode</button>
    </div>

    ${showB1 ? `
      <div class="uila-block b1">
        <div class="uila-block-title">Blok 1: Pangkal Anomali (The Ground State & Inadequacy)</div>
        <div class="uila-body">${formatBlockNarrative(b1?.breakdownPoint || "Skenario kegagalan pemahaman lama.", node?.glossary)}</div>
      </div>
    ` : ""}

    ${showB2 ? `
      <div class="uila-block b2">
        <div class="uila-block-title">Blok 2: Prototipe Intuitif (Isomorphic Sandbox)</div>
        <div class="uila-body">${formatBlockNarrative(b2?.isomorphicMapping || "Analogi relasional yang memecahkan anomali.", node?.glossary)}</div>
      </div>
    ` : ""}

    ${showB3 ? `
      <div class="uila-block b3">
        <div class="uila-block-title">Blok 3: Invarian & Operasi Inti (Core Mechanics)</div>
        <div class="uila-body">
          ${formatBlockNarrative(b3?.invariantProperty || "Invarian Sistem", node?.glossary)}
          ${contrastingRows ? `
            <table class="contrasting-table">
              <thead>
                <tr>
                  <th class="th-wrong">Apa yang Dipikirkan Pemula (Salah)</th>
                  <th class="th-right">Apa yang Sebenarnya Terjadi</th>
                </tr>
              </thead>
              <tbody>${contrastingRows}</tbody>
            </table>
          ` : ""}
        </div>
      </div>
    ` : ""}

    ${showB4 ? `
      <div class="uila-block b4">
        <div class="uila-block-title">Blok 4: Notasi Sebagai Kontrak (Minimal Formalization)</div>
        <div class="uila-body">
          <div id="uila-formula-container" class="formula-display-box"></div>
          ${formatBlockNarrative(b4?.minimalFormalization || "", node?.glossary)}
          ${notationChips ? `<div class="notation-chips">${notationChips}</div>` : ""}
        </div>
      </div>
    ` : ""}

    ${renderGlossaryPanel(node?.glossary)}
  `;

  if (showB4) {
    const formulaBox = container.querySelector("#uila-formula-container");
    if (formulaBox && b4?.formulaOrCode) {
      renderDisplayFormula(b4.formulaOrCode, formulaBox);
    }
  }

  renderAllRichElements(container);
  setupGlossaryListeners(container, node?.glossary);

  container.querySelectorAll(".stepper-pill").forEach((pill) => {
    pill.addEventListener("click", (e) => {
      activeStep = parseInt(e.target.getAttribute("data-step") || "0", 10);
      renderUILABlocks(node, containerId, onFocusTest);
    });
  });

  document.getElementById("btn-toggle-reading")?.addEventListener("click", () => {
    isReadingCollapsed = true;
    renderUILABlocks(node, containerId, onFocusTest);
    if (onFocusTest) onFocusTest();
  });
}

export function showSubwayModal(title, subtitle, bodyHtml) {
  const modal = document.getElementById("subway-modal");
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <div style="font-weight: 700; font-size: 1rem; color: var(--text-color);">${title}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${subtitle}</div>
        </div>
        <button id="modal-close-btn" class="modal-close" type="button" aria-label="Close">&times;</button>
      </div>
      <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-color); margin-top: 0.5rem;">
        ${bodyHtml}
      </div>
      <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
        <button id="modal-ack-btn" class="badge cyan" style="cursor: pointer; padding: 0.4rem 0.8rem;">Close Inspector</button>
      </div>
    </div>
  `;

  modal.style.display = "flex";
  const close = () => { modal.style.display = "none"; };
  document.getElementById("modal-close-btn")?.addEventListener("click", close);
  document.getElementById("modal-ack-btn")?.addEventListener("click", close);
  modal.onclick = (e) => { if (e.target === modal) close(); };
  renderAllRichElements(modal);
}

export function renderSubwayMap(node, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const pathways = node?.expansionPathways;
  let branchHtml = "";
  if (pathways?.branches) {
    for (let i = 0; i < pathways.branches.length; i++) {
      const b = pathways.branches[i];
      branchHtml += `
        <div class="subway-track interactive" id="branch-item-${i}">
          <div class="subway-bullet branch"></div>
          <div>
            <div style="font-weight: 600; color: var(--accent-amber);">${b.trackName}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${b.description || "Click to inspect branch"}</div>
          </div>
        </div>
      `;
    }
  }

  let bridgeHtml = "";
  if (pathways?.isomorphicBridges) {
    for (let i = 0; i < pathways.isomorphicBridges.length; i++) {
      const br = pathways.isomorphicBridges[i];
      bridgeHtml += `
        <div class="subway-track interactive" id="bridge-item-${i}">
          <div class="subway-bullet bridge"></div>
          <div>
            <div style="font-weight: 600; color: var(--accent-emerald);">Bridge: ${br.domain}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Shared Invariant: ${br.sharedInvariant}</div>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;">
      Curriculum Subway Map & Pathways (Click to Inspect)
    </div>
    <div class="subway-map">
      <div class="subway-track interactive" id="subway-core">
        <div class="subway-bullet core"></div>
        <div>
          <div style="font-weight: 600; color: var(--accent-cyan);">Core Track: ${node?.title || "Active"}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Level 1 Foundational Fluency</div>
        </div>
      </div>
      <div class="subway-track interactive" id="subway-spiral">
        <div class="subway-bullet spiral"></div>
        <div>
          <div style="font-weight: 600; color: #818cf8;">Depth Spiral Track</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Mathematical Proofs & Edge Rigor</div>
        </div>
      </div>
      ${branchHtml}
      ${bridgeHtml}
    </div>
  `;

  document.getElementById("subway-core")?.addEventListener("click", () => {
    showSubwayModal("Core Foundation Track", node?.title, "This is the active foundational slice. Master this invariant to unblock dependent child competencies.");
  });

  document.getElementById("subway-spiral")?.addEventListener("click", () => {
    showSubwayModal("Depth Spiral Exploration", `${node?.title} (Level 2 Rigor)`, "This pathway re-visits the invariant with formal Hilbert space proofs, matrix decompositions, and noisy physical hardware considerations.");
  });

  if (pathways?.branches) {
    pathways.branches.forEach((b, i) => {
      document.getElementById(`branch-item-${i}`)?.addEventListener("click", () => {
        showSubwayModal("Branch Track", b.trackName, b.description || "Specialization pathway unblocked after core fluency.");
      });
    });
  }

  if (pathways?.isomorphicBridges) {
    pathways.isomorphicBridges.forEach((br, i) => {
      document.getElementById(`bridge-item-${i}`)?.addEventListener("click", () => {
        showSubwayModal("Isomorphic Cross-Domain Bridge", br.domain, `This bridge demonstrates how the mathematical invariant <strong>${br.sharedInvariant}</strong> maps directly to another scientific field.`);
      });
    });
  }
}
