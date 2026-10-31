// High-Performance KaTeX & Mermaid Rich Formatter for HGD Reference UI

export function initFormatters() {
  if (typeof window !== "undefined" && window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
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

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatMarkdown(text) {
  if (!text) return "";
  let out = escapeHtml(text);

  // Restore LaTeX math delimiters that were escaped
  out = out.replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  // Bold **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic *text*
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Inline code `code`
  out = out.replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>");

  return out;
}

export function isMermaidCode(content) {
  if (!content) return false;
  const trimmed = content.trim();
  return /^(graph\s+(TD|TB|BT|RL|LR)|flowchart\s+(TD|TB|BT|RL|LR)|sequenceDiagram|stateDiagram|erDiagram|classDiagram|gantt)/m.test(trimmed);
}

export async function renderFormulaOrDiagram(content, containerEl) {
  if (!containerEl || !content) return;
  const trimmed = content.trim();

  // 1. Mermaid diagram branch
  if (isMermaidCode(trimmed) && window.mermaid) {
    containerEl.className = "mermaid-diagram-box";
    const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    try {
      const { svg } = await window.mermaid.render(uniqueId, trimmed);
      containerEl.innerHTML = svg;
      return;
    } catch (err) {
      console.warn("Mermaid render error:", err);
      containerEl.innerHTML = `<pre class="fallback-code">${escapeHtml(trimmed)}</pre>`;
      return;
    }
  }

  // 2. KaTeX Mathematical Formula branch
  containerEl.className = "formula-display-box";
  if (window.katex) {
    try {
      window.katex.render(trimmed, containerEl, {
        displayMode: true,
        throwOnError: false,
        strict: false
      });
      return;
    } catch (err) {
      console.warn("KaTeX render error:", err);
    }
  }

  // 3. Fallback code styling
  containerEl.innerHTML = `<code class="fallback-formula">${escapeHtml(trimmed)}</code>`;
}

export function typesetMathInElement(rootEl) {
  if (!rootEl) return;
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
