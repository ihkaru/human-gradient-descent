import type { GlossaryTerm } from "../../src/types/curriculum.js";

export declare function attachGlossaryBadges(
  htmlContent: string,
  glossary?: GlossaryTerm[]
): string;

export declare function renderGlossaryPanel(glossary?: GlossaryTerm[]): string;

export declare function showGlossaryModal(termObj: GlossaryTerm): void;

export declare function setupGlossaryListeners(
  container: HTMLElement,
  glossary?: GlossaryTerm[]
): void;
