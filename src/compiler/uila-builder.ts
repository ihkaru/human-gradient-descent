import type {
  UILABlocks,
  Block1Anomaly,
  Block2IntuitivePrototype,
  Block3CoreMechanics,
  Block4NotationContract,
  ContrastingCase,
  NotationDeconstructionTerm,
} from "../types/uila.js";

export function parseUILABlocks(
  content: string,
  annotations: Record<string, string>,
  title: string
): UILABlocks {
  if (annotations.uila) {
    try {
      const parsed = JSON.parse(annotations.uila);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as UILABlocks;
      }
    } catch {}
  }

  const block1 = extractBlock1(content, title);
  const block2 = extractBlock2(content, title);
  const block3 = extractBlock3(content, title);
  const block4 = extractBlock4(content, title);

  return {
    block1_anomaly: block1,
    block2_intuitivePrototype: block2,
    block3_coreMechanics: block3,
    block4_notationContract: block4,
  };
}

function extractBlock1(content: string, title: string): Block1Anomaly {
  const match = content.match(/###\s*(?:1[.)]?\s*)?(?:Pangkal Anomali|Anomaly|The Ground State)([\s\S]*?)(?=###|$)/i);
  if (match) {
    const text = match[1].trim();
    return {
      groundState: `Initial state prior to ${title}.`,
      oldWay: "Conventional assumption or baseline approach.",
      breakdownPoint: text || `Breakdown condition where classical handling fails for ${title}.`,
    };
  }
  return {
    groundState: `Standard baseline state before encountering ${title}.`,
    oldWay: "Legacy or naive mental model.",
    breakdownPoint: `Complexity explodes or edge conditions collapse when applying legacy methods to ${title}.`,
  };
}

function extractBlock2(content: string, title: string): Block2IntuitivePrototype {
  const match = content.match(/###\s*(?:2[.)]?\s*)?(?:Prototipe Intuitif|Intuitive Prototype|Mental Sandbox)([\s\S]*?)(?=###|$)/i);
  if (match) {
    const text = match[1].trim();
    return {
      physicalObject: "Physical sandbox model",
      isomorphicMapping: text || `Physical analog mapping to ${title}.`,
      deadlockResolution: "Resolves the deadlock identified in Block 1 through isomorphic interaction.",
    };
  }
  return {
    physicalObject: `Physical dynamic balance analog for ${title}.`,
    isomorphicMapping: `Interactions in this physical model preserve the exact proportional relationships of ${title}.`,
    deadlockResolution: "Bypasses the breakdown point by operating simultaneously across state transitions.",
  };
}

function extractBlock3(content: string, title: string): Block3CoreMechanics {
  const match = content.match(/###\s*(?:3[.)]?\s*)?(?:Invarian & Operasi Inti|Core Mechanics|Invarian)([\s\S]*?)(?=###|$)/i);
  const rawText = match ? match[1].trim() : "";
  const contrastingCases = extractContrastingCases(rawText, title);

  const nonTableLines = rawText.split("\n").filter((l) => !l.includes("|"));
  const invariantProperty = nonTableLines.length > 0
    ? nonTableLines.join("\n").trim()
    : `Conservation of system balance in ${title}.`;

  return {
    invariantProperty,
    variableComponents: ["System inputs", "Observable state amplitudes"],
    contrastingCases,
  };
}

function extractContrastingCases(rawText: string, title: string): ContrastingCase[] {
  const cases: ContrastingCase[] = [];
  const lines = rawText.split("\n");
  for (const line of lines) {
    if (line.includes("|") && !line.includes("---") && !line.toLowerCase().includes("pemula")) {
      const parts = line.split("|").map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        cases.push({
          beginnerMisconception: parts[0],
          physicalReality: parts[1],
        });
      }
    }
  }

  if (cases.length === 0) {
    cases.push({
      beginnerMisconception: `Assumes ${title} behaves like an unconstrained static value.`,
      physicalReality: `In reality, ${title} is governed by conservation laws and boundary collapse.`,
    });
  }
  return cases;
}

function extractBlock4(content: string, title: string): Block4NotationContract {
  const match = content.match(/###\s*(?:4[.)]?\s*)?(?:Notasi Sebagai Kontrak|Notation as Contract|Minimal Formalization)([\s\S]*?)(?=###|$)/i);
  const rawText = match ? match[1].trim() : "";
  const terms: NotationDeconstructionTerm[] = [];

  const bulletLines = rawText.split("\n").filter((l) => l.trim().startsWith("*") || l.trim().startsWith("-"));
  for (const b of bulletLines) {
    const colonIdx = b.indexOf(":");
    if (colonIdx > 0) {
      const sym = b.slice(1, colonIdx).replace(/[`*]/g, "").trim();
      const meaning = b.slice(colonIdx + 1).trim();
      terms.push({ symbol: sym, physicalMeaning: meaning });
    }
  }

  if (terms.length === 0) {
    terms.push({ symbol: "Theta", physicalMeaning: `Internal state representation of ${title}` });
    terms.push({ symbol: "Invariant", physicalMeaning: "Conservation boundary that must hold true" });
  }

  const formulaMatch = rawText.match(/\$\$([\s\S]*?)\$\$/) || rawText.match(/`([^`]+)`/);
  const formulaOrCode = formulaMatch ? formulaMatch[1].trim() : `f(${title}) -> Invariant`;

  const narrativeLines = rawText.split("\n").filter((l) => !l.trim().startsWith("*") && !l.trim().startsWith("-") && !l.includes("$$"));
  const minimalFormalization = narrativeLines.length > 0
    ? narrativeLines.join("\n").trim()
    : `Minimal mathematical contract encoding the physical dynamics of ${title}.`;

  return {
    formulaOrCode,
    minimalFormalization,
    termsDeconstruction: terms,
  };
}
