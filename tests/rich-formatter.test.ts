import { describe, it, expect } from "bun:test";
import {
  stripQuotes,
  escapeHtml,
  preprocessMathTokens,
  formatRichText,
  isMermaidCode,
  sanitizeMermaidCode,
} from "../examples/reference-ui/rich-formatter.js";

describe("Rich Formatter & Parser Suite (Reference UI)", () => {
  describe("stripQuotes", () => {
    it("strips double quotes from wrapped string", () => {
      expect(stripQuotes('"A classical bit is strictly 0 or 1."')).toBe(
        "A classical bit is strictly 0 or 1."
      );
    });

    it("strips single quotes from wrapped string", () => {
      expect(stripQuotes("'A classical bit is strictly 0 or 1.'")).toBe(
        "A classical bit is strictly 0 or 1."
      );
    });

    it("preserves internal quotes without removing them", () => {
      expect(stripQuotes('This has "internal" quotes.')).toBe(
        'This has "internal" quotes.'
      );
    });

    it("handles null, undefined, and empty string safely", () => {
      expect(stripQuotes("")).toBe("");
      expect(stripQuotes(null as any)).toBe("");
      expect(stripQuotes(undefined as any)).toBe("");
    });
  });

  describe("escapeHtml", () => {
    it("escapes special HTML entities", () => {
      expect(escapeHtml("<script>alert('xss')</script> & \"test\"")).toBe(
        "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt; &amp; &quot;test&quot;"
      );
    });
  });

  describe("preprocessMathTokens", () => {
    it("converts raw quantum bra-kets to LaTeX format", () => {
      const input = "Measuring |0> and |1> in state |psi>";
      const output = preprocessMathTokens(input);
      expect(output).toContain("$\\lvert 0 \\rangle$");
      expect(output).toContain("$\\lvert 1 \\rangle$");
      expect(output).toContain("$\\lvert psi \\rangle$");
    });

    it("converts amplitude fractions and powers", () => {
      const input = "Probability amplitude is 1/sqrt(2) and |alpha|^2 + |beta|^2 = 1";
      const output = preprocessMathTokens(input);
      expect(output).toContain("$\\frac{1}{\\sqrt{2}}$");
      expect(output).toContain("$\\lvert\\alpha\\rvert^2$");
      expect(output).toContain("$\\lvert\\beta\\rvert^2$");
    });
  });

  describe("formatRichText", () => {
    it("formats markdown bold, italic, and inline code", () => {
      const input = "Here is **bold**, *italic*, and `code` text.";
      const output = formatRichText(input);
      expect(output).toContain("<strong>bold</strong>");
      expect(output).toContain("<em>italic</em>");
      expect(output).toContain('<code class="inline-code">code</code>');
    });

    it("extracts and preserves fenced mermaid diagram blocks", () => {
      const input = [
        "Before diagram",
        "```mermaid",
        "graph LR",
        "  A --> B",
        "```",
        "After diagram",
      ].join("\n");

      const output = formatRichText(input);
      expect(output).toContain('class="mermaid-diagram-box"');
      expect(output).toContain("data-mermaid=");
      expect(output).toContain("Before diagram");
      expect(output).toContain("After diagram");
    });
  });

  describe("isMermaidCode", () => {
    it("identifies valid Mermaid chart types", () => {
      expect(isMermaidCode("flowchart TD\n  A --> B")).toBe(true);
      expect(isMermaidCode("graph LR\n  A --> B")).toBe(true);
      expect(isMermaidCode("sequenceDiagram\n  Alice->>Bob: Hi")).toBe(true);
      expect(isMermaidCode("stateDiagram-v2\n  [*] --> Still")).toBe(true);
      expect(isMermaidCode("erDiagram\n  CUSTOMER ||--o{ ORDER : places")).toBe(true);
    });

    it("rejects non-Mermaid text or raw mathematical formulas", () => {
      expect(isMermaidCode("H|0\\rangle = \\frac{1}{\\sqrt{2}}|0\\rangle")).toBe(false);
      expect(isMermaidCode("Just normal explanation text")).toBe(false);
    });
  });

  describe("sanitizeMermaidCode", () => {
    it("wraps raw LaTeX commands in Mermaid node labels into $$ delimiters", () => {
      const input = 'K1["Kernel Trap Barrier (\\tau_{trap})"]';
      const output = sanitizeMermaidCode(input);
      expect(output).toContain("$$");
      expect(output).toBe('K1["Kernel Trap Barrier ($$\\tau_{trap}$$)"]');
    });

    it("preserves labels already properly wrapped in $$", () => {
      const input = 'Sup["$$\\lvert \\psi \\rangle$$"]';
      const output = sanitizeMermaidCode(input);
      expect(output).toBe('Sup["$$\\lvert \\psi \\rangle$$"]');
    });
  });
});
