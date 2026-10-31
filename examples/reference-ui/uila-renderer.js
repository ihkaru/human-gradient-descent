// UILA & Heatmap Renderer Module

export function renderHeatmap(state, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const log = state?.dailyActivityLog || {};
  const totalEpochs = Object.values(log).reduce((acc, c) => acc + (c.epochs || 0), 0) || (state?.masteredNodes?.length || 0) * 3 + 2;
  const masteredCount = state?.masteredNodes?.length || 0;
  const streakDays = Math.min(7, Math.max(1, masteredCount + 1));

  // Generate 35 cells (5 rows x 7 cols)
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

export function renderUILABlocks(node, containerId) {
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

  let contrastingRows = "";
  if (b3?.contrastingCases) {
    for (const c of b3.contrastingCases) {
      contrastingRows += `
        <tr>
          <td class="td-wrong">${c.beginnerMisconception}</td>
          <td class="td-right">${c.physicalReality}</td>
        </tr>
      `;
    }
  }

  let notationChips = "";
  if (b4?.termsDeconstruction) {
    for (const t of b4.termsDeconstruction) {
      notationChips += `
        <div class="notation-chip">
          <strong>${t.symbol}:</strong> ${t.physicalMeaning}
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="uila-block b1">
      <div class="uila-block-title">Blok 1: Pangkal Anomali (The Ground State & Inadequacy)</div>
      <div class="uila-body">${b1?.breakdownPoint || "Skenario kegagalan pemahaman lama."}</div>
    </div>

    <div class="uila-block b2">
      <div class="uila-block-title">Blok 2: Prototipe Intuitif (Isomorphic Sandbox)</div>
      <div class="uila-body">
        <strong>${b2?.physicalObject || "Model Fisik"}:</strong>
        ${b2?.isomorphicMapping || "Analogi relasional yang memecahkan anomali."}
      </div>
    </div>

    <div class="uila-block b3">
      <div class="uila-block-title">Blok 3: Invarian & Operasi Inti (Core Mechanics)</div>
      <div class="uila-body">
        <div>Hukum Kekekalan: <strong>${b3?.invariantProperty || "Invarian Sistem"}</strong></div>
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

    <div class="uila-block b4">
      <div class="uila-block-title">Blok 4: Notasi Sebagai Kontrak (Minimal Formalization)</div>
      <div class="uila-body">
        <code style="font-family: var(--font-mono); color: var(--accent-amber);">${b4?.formulaOrCode || ""}</code>
        <p style="margin: 0.35rem 0 0 0; font-size: 0.8rem; color: var(--text-muted);">${b4?.minimalFormalization || ""}</p>
        ${notationChips ? `<div class="notation-chips">${notationChips}</div>` : ""}
      </div>
    </div>
  `;
}

export function renderSubwayMap(node, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const pathways = node?.expansionPathways;
  let branchHtml = "";
  if (pathways?.branches) {
    for (const b of pathways.branches) {
      branchHtml += `
        <div class="subway-track">
          <div class="subway-bullet branch"></div>
          <div>
            <div style="font-weight: 600; color: var(--accent-amber);">${b.trackName}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${b.description || ""}</div>
          </div>
        </div>
      `;
    }
  }

  let bridgeHtml = "";
  if (pathways?.isomorphicBridges) {
    for (const br of pathways.isomorphicBridges) {
      bridgeHtml += `
        <div class="subway-track">
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
      Curriculum Subway Map & Pathways
    </div>
    <div class="subway-map">
      <div class="subway-track">
        <div class="subway-bullet core"></div>
        <div>
          <div style="font-weight: 600; color: var(--accent-cyan);">Core Track: ${node?.title || "Active"}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Level 1 Foundational Fluency</div>
        </div>
      </div>
      <div class="subway-track">
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
}
