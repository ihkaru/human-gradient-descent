export declare function initFormatters(): void;
export declare function stripQuotes(str?: string | null): string;
export declare function escapeHtml(str?: string | null): string;
export declare function preprocessMathTokens(text?: string | null): string;
export declare function formatRichText(rawText?: string | null): string;
export declare function isMermaidCode(content: string): boolean;
export declare function renderDisplayFormula(rawFormula: string, containerEl: HTMLElement): void;
export declare function renderAllRichElements(rootEl: HTMLElement): Promise<void>;
