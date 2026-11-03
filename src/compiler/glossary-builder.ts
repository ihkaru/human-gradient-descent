import type { GlossaryTerm } from "../types/curriculum.js";

/**
 * Extracts and synthesizes interactive glossary terms and High School (SMA)
 * conceptual grounding anchors from markdown content and annotations.
 */
export function parseGlossaryTerms(
  content: string,
  annotations: Record<string, string>,
  title: string
): GlossaryTerm[] | undefined {
  // 1. Check explicit JSON annotation
  if (annotations.glossary) {
    try {
      const parsed = JSON.parse(annotations.glossary);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(
          (item) => typeof item.term === "string" && typeof item.definition === "string"
        ) as GlossaryTerm[];
      }
    } catch {
      // Fall through to markdown parsing if invalid JSON
    }
  }

  const terms: GlossaryTerm[] = [];

  // 2. Parse Markdown section: Glosarium, Jembatan Konsep SMA, or Glossary
  const sectionMatch = content.match(
    /###\s*(?:[0-9.]+\s*)?(?:Glosarium|Istilah Penting|Jembatan Konsep SMA|Glossary)[\s\S]*?(?=###|##|$)/i
  );

  if (sectionMatch) {
    const rawSection = sectionMatch[0];
    const lines = rawSection.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Check table rows (skip header and separator)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (
          trimmed.includes("---") ||
          trimmed.toLowerCase().includes("istilah") ||
          trimmed.toLowerCase().includes("term")
        ) {
          continue;
        }

        const cols = trimmed
          .split(/(?<!\\)\|/)
          .map((c) => c.replace(/\\\|/g, "|").trim())
          .filter((_, i, arr) => i > 0 && i < arr.length - 1);

        if (cols.length >= 2) {
          const term = cleanTerm(cols[0]);
          const definition = cols[1];
          const highSchoolAnchor = cols.length >= 3 ? cols[2] : undefined;

          if (term && definition) {
            terms.push({ term, definition, highSchoolAnchor });
          }
        }
      } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Bullet point: - **Term**: Definition. *Jembatan SMA*: Anchor
        const bulletMatch = trimmed.match(/^[-*]\s+\*\*([^*]+)\*\*:\s*(.*)$/);
        if (bulletMatch) {
          const term = cleanTerm(bulletMatch[1]);
          const rest = bulletMatch[2];

          let definition = rest;
          let highSchoolAnchor: string | undefined;

          const anchorMatch = rest.match(/[*_]*(?:Jembatan SMA|Analogi SMA|High School Anchor)[*_]*:\s*(.*)$/i);
          if (anchorMatch) {
            highSchoolAnchor = anchorMatch[1].replace(/[*_]/g, "").trim();
            definition = rest.slice(0, anchorMatch.index).replace(/[*_]/g, "").trim();
          }

          if (term && definition) {
            terms.push({ term, definition, highSchoolAnchor });
          }
        }
      }
    }
  }

  // 3. Fallback: if no explicit glossary section was found, check if there are Block 4 notation terms
  if (terms.length === 0) {
    const block4Terms = extractFallbackFromBlock4(content);
    if (block4Terms.length > 0) {
      return block4Terms;
    }
  }

  return terms.length > 0 ? terms : undefined;
}

function cleanTerm(raw: string): string {
  return raw.replace(/[`*]/g, "").trim();
}

function extractFallbackFromBlock4(content: string): GlossaryTerm[] {
  const match = content.match(
    /###\s*(?:4[.)]?\s*)?(?:Notasi Sebagai Kontrak|Notation as Contract|Minimal Formalization)([\s\S]*?)(?=###|##|$)/i
  );
  if (!match) return [];

  const rawText = match[1];
  const terms: GlossaryTerm[] = [];
  const lines = rawText.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx > 0) {
        const term = cleanTerm(trimmed.slice(1, colonIdx));
        const definition = trimmed.slice(colonIdx + 1).trim();
        if (term.length > 0 && definition.length > 0) {
          terms.push({
            term,
            definition,
            highSchoolAnchor: `Analogi dasar SMA: bayangkan ${term} sebagai komponen variabel penyeimbang dalam sistem.`,
          });
        }
      }
    }
  }

  return terms;
}
