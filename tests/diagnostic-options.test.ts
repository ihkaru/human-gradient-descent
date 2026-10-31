import { describe, it, expect } from "bun:test";
import { buildDiagnosticOptions } from "../src/compiler/options-builder";
import { MarkdownCurriculumCompiler } from "../src/compiler/markdown-compiler";
import { SchemaValidator } from "../src/validator/schema-validator.js";

describe("Diagnostic MCQ Options Builder Suite", () => {
  it("builds fallback diagnostic options when no custom options provided", () => {
    const options = buildDiagnosticOptions(
      {},
      "Superposition",
      "Linear combination of states",
      "Measurement collapses superposition"
    );
    expect(options.length).toBe(3);

    const correctOpt = options.find((o) => o.isCorrect);
    expect(correctOpt).toBeDefined();
    expect(correctOpt?.optionId).toBe("opt_a");

    const distractor = options.find((o) => o.diagnosticAxis === "conceptGap");
    expect(distractor).toBeDefined();
    expect(distractor?.isCorrect).toBe(false);
  });

  it("parses custom diagnostic options from annotations", () => {
    const rawOptions = [
      {
        optionId: "opt_1",
        text: "Custom correct hypothesis",
        isCorrect: true,
        causalRationale: "Correct causal justification",
      },
      {
        optionId: "opt_2",
        text: "Custom distractor on notation",
        isCorrect: false,
        causalRationale: "Confuses Dirac notation with vectors",
        diagnosticAxis: "notationBreakdown",
        specificRemediation: "Review ket notation",
      },
    ];

    const annotations = { options: JSON.stringify(rawOptions) };
    const options = buildDiagnosticOptions(
      annotations,
      "Notation",
      "Ket vectors",
      "Invariants"
    );
    expect(options.length).toBe(2);
    expect(options[0].optionId).toBe("opt_1");
    expect(options[1].diagnosticAxis).toBe("notationBreakdown");
  });

  it("compiler emits diagnostic options on generated node shards validating against schema", async () => {
    const sampleMd = `# Test Curriculum\n\n## Section 1: Invariant\nConcept overview.\nThe fundamental invariant is clarity.\n\n### Probe\nPredict the outcome.\n`;
    const compiler = new MarkdownCurriculumCompiler();
    const { manifest, shards } = compiler.compile(sampleMd, {
      curriculumId: "test-curr",
      title: "Test Curriculum",
      domain: "ComputerScience",
      nodesPerShard: 2,
    });

    expect(shards.length).toBeGreaterThan(0);
    const firstNode = shards[0].nodes[0];
    expect(firstNode.forwardPass.options).toBeDefined();
    expect(firstNode.forwardPass.options!.length).toBeGreaterThanOrEqual(2);

    const validator = new SchemaValidator("./schemas");
    const res = validator.validateShard(shards[0]);
    expect(res.valid).toBe(true);
  });
});
