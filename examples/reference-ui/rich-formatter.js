// High-Performance KaTeX & Mermaid Rich Formatter for HGD Reference UI

export function initFormatters() {
  if (typeof window !== "undefined" && window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        htmlLabels: true,
        suppressErrorRendering: true,
        themeCSS: ".node foreignObject { overflow: visible !important; } .edgeLabel foreignObject { overflow: visible !important; }",
        fontFamily: "Google Sans, sans-serif",
        themeVariables: {
          darkMode: true,
          background: "#0b1329",
          primaryColor: "#1e293b",
          primaryTextColor: "#f1f5f9",
          primaryBorderColor: "#00dc82",
          lineColor: "#38bdf8",
          secondaryColor: "#0f172a",
          tertiaryColor: "#1e293b"
        }
      });
    } catch (e) {
      console.warn("Mermaid init warning:", e);
    }
  }
}

export function stripQuotes(str) {
  if (!str || typeof str !== "string") return "";
  let clean = str.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
}

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function preprocessMathTokens(text) {
  if (!text) return "";
  let s = text;

  // Transform raw ket notations outside of existing $...$
  s = s.replace(/\|([0-9a-zA-Z\s+\-]+)>/g, "$\\lvert $1 \\rangle$");

  // Transform common amplitude fractions and square formulas
  s = s.replace(/1\/sqrt\(2\)/g, "$\\frac{1}{\\sqrt{2}}$");
  s = s.replace(/\|1\/sqrt\(2\)\|\^2/g, "$\\lvert\\frac{1}{\\sqrt{2}}\\rvert^2$");
  s = s.replace(/\|alpha\|\^2/g, "$\\lvert\\alpha\\rvert^2$");
  s = s.replace(/\|beta\|\^2/g, "$\\lvert\\beta\\rvert^2$");
  s = s.replace(/\balpha\|0\>/g, "$\\alpha\\lvert 0 \\rangle$");
  s = s.replace(/\bbeta\|1\>/g, "$\\beta\\lvert 1 \\rangle$");

  return s;
}

export function formatRichText(rawText) {
  if (!rawText) return "";
  let text = stripQuotes(rawText);

  // 1. Extract and preserve fenced Mermaid code blocks
  const mermaidBlocks = [];
  text = text.replace(/```mermaid\s*([\s\S]*?)```/g, (_, code) => {
    const idx = mermaidBlocks.length;
    mermaidBlocks.push(code.trim());
    return `<!--MERMAID_BLOCK_${idx}-->`;
  });

  // 2. Preprocess quantum and mathematical tokens
  text = preprocessMathTokens(text);

  // 3. Markdown Formatting
  // Bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic *text*
  text = text.replace(/(^|[^\*])\*([^*]+)\*([^\*]|$)/g, "$1<em>$2</em>$3");

  // Inline code `code`
  text = text.replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>");

  // 4. Restore Mermaid blocks as renderable containers
  text = text.replace(/<!--MERMAID_BLOCK_(\d+)-->/g, (_, idx) => {
    const code = mermaidBlocks[parseInt(idx, 10)] || "";
    return `<div class="mermaid-diagram-box" data-mermaid="${encodeURIComponent(code)}"></div>`;
  });

  return text;
}

export function isMermaidCode(content) {
  if (!content) return false;
  const trimmed = content.trim();
  return /^(graph\s+(TD|TB|BT|RL|LR)|flowchart\s+(TD|TB|BT|RL|LR)|sequenceDiagram|stateDiagram|erDiagram|classDiagram|gantt)/m.test(trimmed);
}

export async function renderDisplayFormula(rawFormula, containerEl) {
  if (!containerEl || !rawFormula) return;
  let formula = stripQuotes(rawFormula).trim();

  // Strip wrapping $$ if present
  if (formula.startsWith("$$") && formula.endsWith("$$")) {
    formula = formula.slice(2, -2).trim();
  }

  // 1. Mermaid diagram branch
  if (isMermaidCode(formula)) {
    await renderMermaidElement(formula, containerEl);
    return;
  }

  // 2. KaTeX Mathematical Formula branch
  containerEl.className = "formula-display-box";
  if (window.katex) {
    try {
      window.katex.render(formula, containerEl, {
        displayMode: true,
        throwOnError: false,
        strict: false
      });
      return;
    } catch (err) {
      console.warn("KaTeX render error:", err);
    }
  }

  // Fallback
  containerEl.innerHTML = `<code class="fallback-formula">${escapeHtml(formula)}</code>`;
}

export function sanitizeMermaidCode(rawCode) {
  if (!rawCode) return "";
  let code = rawCode;

  const cleanMathText = (str) => {
    return str
      .replace(/\\tau_?\{?([a-zA-Z0-9]+)\}?/g, "τ_$1")
      .replace(/\\tau/g, "τ")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\psi/g, "ψ")
      .replace(/\\Phi/g, "Φ")
      .replace(/\\dagger/g, "†")
      .replace(/\\neq/g, "≠")
      .replace(/\\approx/g, "≈")
      .replace(/\\frac\{1\}\{\\sqrt\{2\}\}/g, "1/√2")
      .replace(/\\sqrt\{2\}/g, "√2")
      .replace(/\\lvert/g, "|")
      .replace(/\\rangle/g, "⟩")
      .replace(/\\langle/g, "⟨")
      .replace(/\\rvert/g, "|")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\$\$/g, "")
      .replace(/\\/g, "")
      .replace(/\|\s+/g, "|")
      .replace(/\s+⟩/g, "⟩")
      .trim();
  };

  // 1. Sanitize node labels ["..."]
  code = code.replace(/\["([^"]*?)"\]/g, (_, label) => `["${cleanMathText(label)}"]`);

  // 2. Sanitize edge labels |...|
  code = code.replace(/\|([^|\n]+)\|/g, (_, edgeLabel) => `|${cleanMathText(edgeLabel)}|`);

  return code;
}

export async function renderMermaidElement(code, containerEl) {
  if (!containerEl || !code) return;
  containerEl.className = "mermaid-diagram-box";

  // Clean up any stray elements attached to document.body by previous render attempts
  if (typeof document !== "undefined") {
    document.querySelectorAll('[id^="dmermaid-"], [id^="mermaid-"]').forEach((el) => {
      if (el.parentNode === document.body) {
        el.remove();
      }
    });
  }

  if (window.mermaid) {
    const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    const sanitized = sanitizeMermaidCode(code);
    try {
      const { svg } = await window.mermaid.render(uniqueId, sanitized);
      containerEl.innerHTML = svg;
      return;
    } catch (err) {
      console.warn("Mermaid render error:", err);
      if (typeof document !== "undefined") {
        document.querySelectorAll(`[id="d${uniqueId}"], [id="${uniqueId}"]`).forEach((el) => {
          if (el.parentNode === document.body) {
            el.remove();
          }
        });
      }
      containerEl.innerHTML = `<pre class="fallback-code">${escapeHtml(code)}</pre>`;
      return;
    }
  }

  containerEl.innerHTML = `<pre class="fallback-code">${escapeHtml(code)}</pre>`;
}

export async function renderAllRichElements(rootEl) {
  if (!rootEl) return;

  // 1. Render all embedded Mermaid diagrams
  const mermaidNodes = rootEl.querySelectorAll(".mermaid-diagram-box[data-mermaid]");
  for (const node of mermaidNodes) {
    const rawCode = decodeURIComponent(node.getAttribute("data-mermaid") || "");
    if (rawCode) {
      await renderMermaidElement(rawCode, node);
      node.removeAttribute("data-mermaid");
    }
  }

  // 2. Typeset all LaTeX formulas via KaTeX auto-render
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(rootEl, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    } catch (err) {
      console.warn("Auto-render math error:", err);
    }
  }
}
