// Interactive Glossary Popover & High School (SMA) Concept Grounding Module

/**
 * Decorates rendered HTML content with interactive clickable glossary badges.
 */
export function attachGlossaryBadges(htmlContent, glossary) {
  if (!htmlContent || !Array.isArray(glossary) || glossary.length === 0) {
    return htmlContent;
  }

  const sortedTerms = [...glossary].sort((a, b) => b.term.length - a.term.length);
  let processed = htmlContent;

  for (const item of sortedTerms) {
    if (!item.term || item.term.length < 2) continue;

    const escaped = item.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match term outside tags
    const regex = new RegExp(`(?<![<\\/\\w\\d_\\-\\."=])(${escaped})(?![\\w\\d_\\-]*[>"])`, "gi");

    let count = 0;
    processed = processed.replace(regex, (match) => {
      count++;
      if (count > 4) return match;
      const termKey = encodeURIComponent(item.term.toLowerCase());
      return `<span class="glossary-term-badge" data-term-key="${termKey}" tabindex="0" role="button" aria-haspopup="dialog" title="Klik untuk penjelasan & analogi SMA: ${item.term}">${match}</span>`;
    });
  }

  return processed;
}

/**
 * Renders a collapsible bottom panel with all glossary terms & High School anchors.
 */
export function renderGlossaryPanel(glossary) {
  if (!Array.isArray(glossary) || glossary.length === 0) return "";

  let itemsHtml = "";
  for (const item of glossary) {
    const anchorHtml = item.highSchoolAnchor
      ? `<div class="glossary-panel-anchor">
           <span class="glossary-anchor-tag">Jembatan SMA</span>
           <span>${item.highSchoolAnchor}</span>
         </div>`
      : "";

    itemsHtml += `
      <div class="glossary-panel-item" data-term-key="${encodeURIComponent(item.term.toLowerCase())}">
        <div class="glossary-panel-term">
          <strong>${item.term}</strong>
        </div>
        <div class="glossary-panel-def">${item.definition}</div>
        ${anchorHtml}
      </div>
    `;
  }

  return `
    <details class="glossary-accordion" open>
      <summary class="glossary-accordion-header">
        <span class="glossary-accordion-title">
          Jembatan Konsep SMA & Glosarium (${glossary.length} Istilah Terindeks)
        </span>
        <span class="glossary-accordion-hint">Klik untuk melipat / membuka</span>
      </summary>
      <div class="glossary-panel-grid">
        ${itemsHtml}
      </div>
    </details>
  `;
}

/**
 * Displays an interactive modal popup explaining the term with high school analogy.
 */
export function showGlossaryModal(termObj) {
  const modal = document.getElementById("subway-modal");
  if (!modal) return;

  const anchorHtml = termObj.highSchoolAnchor
    ? `
      <div class="glossary-modal-anchor-box">
        <div class="glossary-modal-anchor-title">Jembatan Konsep Dasar SMA</div>
        <div class="glossary-modal-anchor-text">${termObj.highSchoolAnchor}</div>
      </div>
    `
    : "";

  modal.innerHTML = `
    <div class="modal-card glossary-modal-card">
      <div class="modal-header">
        <div>
          <span class="phase-badge phase-a" style="margin-bottom: 0.25rem;">Istilah Teknis</span>
          <div style="font-weight: 700; font-size: 1.15rem; color: var(--accent-cyan); margin-top: 0.25rem;">
            ${termObj.term}
          </div>
        </div>
        <button id="modal-close-btn" class="modal-close" type="button" aria-label="Close">&times;</button>
      </div>

      <div style="margin: 0.75rem 0;">
        <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">
          Definisi Formal
        </div>
        <div style="font-size: 0.9rem; line-height: 1.5; color: var(--text-color);">
          ${termObj.definition}
        </div>
      </div>

      ${anchorHtml}

      <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
        <button id="modal-ack-btn" class="badge cyan" style="cursor: pointer; padding: 0.4rem 0.9rem; font-size: 0.85rem;">
          Paham & Lanjutkan
        </button>
      </div>
    </div>
  `;

  modal.style.display = "flex";
  const close = () => { modal.style.display = "none"; };
  document.getElementById("modal-close-btn")?.addEventListener("click", close);
  document.getElementById("modal-ack-btn")?.addEventListener("click", close);
  modal.onclick = (e) => { if (e.target === modal) close(); };
}

/**
 * Attaches click and keyboard listeners to glossary badges and panel items.
 */
export function setupGlossaryListeners(container, glossary) {
  if (!container || !Array.isArray(glossary) || glossary.length === 0) return;

  const termMap = new Map();
  for (const item of glossary) {
    termMap.set(item.term.toLowerCase(), item);
  }

  const triggerModal = (termKey) => {
    const decoded = decodeURIComponent(termKey || "").toLowerCase();
    const item = termMap.get(decoded);
    if (item) {
      showGlossaryModal(item);
    }
  };

  container.querySelectorAll(".glossary-term-badge").forEach((badge) => {
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      triggerModal(badge.getAttribute("data-term-key"));
    });

    badge.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        triggerModal(badge.getAttribute("data-term-key"));
      }
    });
  });

  container.querySelectorAll(".glossary-panel-item").forEach((itemEl) => {
    itemEl.addEventListener("click", () => {
      triggerModal(itemEl.getAttribute("data-term-key"));
    });
  });
}
