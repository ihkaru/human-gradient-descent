import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SchemaValidator } from "./schema-validator.js";
import { DAGCycleDetector } from "./dag-cycle-detector.js";
import type {
  CurriculumManifest, NodeShard, CompetencyNode,
  AuditViolation, CurriculumAuditReport,
} from "../types/curriculum.js";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "as", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "if", "then", "else", "when",
  "where", "why", "how", "all", "any", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "can", "will", "just", "should", "now", "predict",
  "select", "which", "what", "because", "outcome", "state", "under", "equal",
  "inverting", "searching", "measuring", "applying", "suppose", "given", "assume",
  "using", "between", "during", "after", "before", "equating", "since", "thus",
  "therefore", "here", "there", "step", "then", "into", "versus", "across",
  "neither", "either", "without", "instead", "while", "along", "toward", "about",
  "party", "parties", "cannot", "unenforceable", "enforceable", "recovery",
  "recover", "damages", "breach", "contract", "agreement", "valid", "invalid",
  "claim", "liable", "liability", "brand", "action", "remedy", "notice"
]);

const PHYSICAL_ANCHORS = [
  "lever", "coin", "fluid", "scale", "box", "switch", "tube", "valve", "wheel",
  "spring", "pipe", "gear", "ball", "balance", "physical", "spinning", "table",
  "weight", "container", "chamber", "clock", "wire", "flow", "mirror", "pulley"
];

export class CurriculumAuditor {
  private schemaValidator = new SchemaValidator();

  public audit(
    target: string | { manifest: CurriculumManifest; shards: NodeShard[] },
    options: { strict?: boolean } = {}
  ): CurriculumAuditReport {
    let manifest: CurriculumManifest;
    let shards: NodeShard[] = [];
    const violations: AuditViolation[] = [];
    const passedRules: string[] = [];

    if (typeof target === "string") {
      const manifestPath = join(target, "curriculum-manifest.json");
      if (!existsSync(manifestPath)) {
        violations.push({
          nodeId: "ROOT", ruleId: "MISSING_MANIFEST", severity: "ERROR", tier: 1,
          message: `Manifest not found at ${manifestPath}`,
          remediation: "Ensure curriculum-manifest.json exists in directory.",
        });
        return this.buildReport(violations, passedRules, 0);
      }
      manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
      const shardsDir = join(target, "shards");
      if (existsSync(shardsDir)) {
        for (const file of readdirSync(shardsDir).filter(f => f.endsWith(".json"))) {
          shards.push(JSON.parse(readFileSync(join(shardsDir, file), "utf-8")));
        }
      }
    } else {
      manifest = target.manifest;
      shards = target.shards;
    }

    this.checkStructuralIntegrity(manifest, shards, violations, passedRules);

    const allNodes: CompetencyNode[] = [];
    for (const shard of shards) {
      for (const node of shard.nodes || []) {
        allNodes.push(node);
        this.auditNode(node, violations, passedRules, options.strict);
      }
    }

    return this.buildReport(violations, passedRules, allNodes.length);
  }

  public auditNode(
    node: CompetencyNode,
    violations: AuditViolation[] = [],
    passedRules: string[] = [],
    strict = false
  ): AuditViolation[] {
    this.checkTier1Node(node, violations, passedRules, strict);
    this.checkTier2Node(node, violations, passedRules);
    return violations;
  }

  private checkStructuralIntegrity(
    manifest: CurriculumManifest,
    shards: NodeShard[],
    violations: AuditViolation[],
    passedRules: string[]
  ): void {
    const manifestRes = this.schemaValidator.validateManifest(manifest);
    if (!manifestRes.valid) {
      violations.push({
        nodeId: manifest.curriculumId || "ROOT", ruleId: "SCHEMA_MANIFEST_INVALID",
        severity: "ERROR", tier: 1,
        message: `Manifest schema violation: ${manifestRes.errors?.join("; ")}`,
        remediation: "Fix manifest fields to adhere to curriculum-manifest.schema.json",
      });
    } else {
      passedRules.push("TIER1_SCHEMA_MANIFEST_VALID");
    }

    for (const shard of shards) {
      const shardRes = this.schemaValidator.validateShard(shard);
      if (!shardRes.valid) {
        violations.push({
          nodeId: shard.shardId || "UNKNOWN_SHARD", ruleId: "SCHEMA_SHARD_INVALID",
          severity: "ERROR", tier: 1,
          message: `Shard ${shard.shardId} invalid: ${shardRes.errors?.join("; ")}`,
          remediation: "Fix shard fields to adhere to node-shard.schema.json",
        });
      }
    }

    const dagDetector = new DAGCycleDetector();
    const dagRes = dagDetector.validateManifest(manifest);
    if (!dagRes.isValid) {
      for (const err of dagRes.diagnostics) {
        violations.push({
          nodeId: "DAG", ruleId: "DAG_ACYCLICITY_VIOLATION", severity: "ERROR", tier: 1,
          message: err, remediation: "Resolve circular dependencies or missing prerequisite node IDs.",
        });
      }
    } else {
      passedRules.push("TIER1_DAG_ACYCLICITY_VALID");
    }
  }

  private checkTier1Node(
    node: CompetencyNode,
    violations: AuditViolation[],
    passedRules: string[],
    strict: boolean
  ): void {
    const primer = node.forwardPass?.microPrimer || node.conceptSummary || "";
    const words = primer.trim().split(/\s+/).filter(Boolean).length;
    if (words > 50) {
      violations.push({
        nodeId: node.id, ruleId: "WORKING_MEMORY_OVERFLOW",
        severity: strict ? "ERROR" : "WARNING", tier: 1,
        message: `Concept primer word count (${words}) exceeds phonological limit (<= 50 words).`,
        remediation: "Condense preliminary primer text to <= 50 words.",
      });
    } else {
      passedRules.push(`TIER1_WORD_BUDGET_${node.id}`);
    }

    const options = node.forwardPass?.options || [];
    if (options.length < 3) {
      violations.push({
        nodeId: node.id, ruleId: "INSUFFICIENT_DIAGNOSTIC_OPTIONS", severity: "ERROR", tier: 1,
        message: `Node has ${options.length} options, minimum 3 required (1 correct, >= 2 distractors).`,
        remediation: "Add distinct diagnostic distractors mapped to 5-axis loss errors.",
      });
    } else {
      const correct = options.filter(o => o.isCorrect);
      if (correct.length !== 1) {
        violations.push({
          nodeId: node.id, ruleId: "INVALID_CORRECT_OPTION_COUNT", severity: "ERROR", tier: 1,
          message: `Node has ${correct.length} correct options, exactly 1 required.`,
          remediation: "Mark exactly one hypothesis with isCorrect: true.",
        });
      }
      for (const opt of options.filter(o => !o.isCorrect)) {
        if (!opt.diagnosticAxis || !opt.causalRationale) {
          violations.push({
            nodeId: node.id, ruleId: "INCOMPLETE_DISTRACTOR_RATIONALE", severity: "ERROR", tier: 1,
            message: `Distractor '${opt.optionId}' missing diagnosticAxis or causalRationale.`,
            remediation: "Specify diagnosticAxis and causalRationale explaining the misconception.",
          });
        }
      }
    }

    this.checkCausalClosure(node, violations, passedRules);

    const cc = node.uila?.block3_coreMechanics?.contrastingCases;
    if (!cc || cc.length === 0) {
      violations.push({
        nodeId: node.id, ruleId: "MISSING_CONTRASTING_CASES",
        severity: strict ? "ERROR" : "WARNING", tier: 1,
        message: "Block 3 missing contrasting cases (beginner misconception vs physical reality).",
        remediation: "Add contrasting cases contrasting superficial thinking with actual mechanics.",
      });
    } else {
      passedRules.push(`TIER1_CONTRASTING_CASES_${node.id}`);
    }
  }

  private checkCausalClosure(
    node: CompetencyNode,
    violations: AuditViolation[],
    passedRules: string[]
  ): void {
    const probe = node.forwardPass;
    if (!probe) return;

    const probeText = `${probe.prompt || ""} ${(probe.options || []).map(o => o.text).join(" ")}`;
    const terms = this.extractTechnicalEntities(probeText);

    const grounding = [
      node.conceptSummary, probe.microPrimer,
      node.uila?.block1_anomaly?.groundState, node.uila?.block1_anomaly?.oldWay,
      node.uila?.block1_anomaly?.breakdownPoint, node.uila?.block2_intuitivePrototype?.physicalObject,
      node.uila?.block2_intuitivePrototype?.isomorphicMapping, node.uila?.block3_coreMechanics?.invariantProperty,
      (node.uila?.block3_coreMechanics?.variableComponents || []).join(" "),
      (node.uila?.block3_coreMechanics?.contrastingCases || []).map(c => `${c.beginnerMisconception} ${c.physicalReality}`).join(" "),
      node.uila?.block4_notationContract?.formulaOrCode, node.uila?.block4_notationContract?.minimalFormalization,
      (node.uila?.block4_notationContract?.termsDeconstruction || []).map(t => `${t.symbol} ${t.calloutLabel || ""} ${t.physicalMeaning}`).join(" "),
    ].filter(Boolean).join(" ").toLowerCase()
      .replace(/\\rangle/g, ">").replace(/\\langle/g, "<")
      .replace(/\\([a-zA-Z]+)/g, "$1");

    let orphanCount = 0;
    for (const term of terms) {
      if (!grounding.includes(term.toLowerCase())) {
        orphanCount++;
        violations.push({
          nodeId: node.id, ruleId: "ORPHAN_PROBE_ENTITY", severity: "ERROR", tier: 1,
          message: `Probe tests entity '${term}' without prior grounding in Blocks 1-4.`,
          remediation: `Ground '${term}' in Block 2 prototype, Block 3 mechanics, or Block 4 notation before testing.`,
        });
      }
    }
    if (orphanCount === 0) passedRules.push(`TIER1_CAUSAL_CLOSURE_${node.id}`);
  }

  private extractTechnicalEntities(text: string): string[] {
    const tokens = text.match(/[A-Z][a-zA-Z0-9_]{2,}|\|[a-zA-Z0-9_]+\>|[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g) || [];
    const unique = new Set<string>();
    for (const t of tokens) {
      const clean = t.replace(/^[(\s]+|[).\s]+$/g, "");
      if (clean.length > 2 && !STOPWORDS.has(clean.toLowerCase())) unique.add(clean);
    }
    return Array.from(unique);
  }

  private checkTier2Node(
    node: CompetencyNode,
    violations: AuditViolation[],
    passedRules: string[]
  ): void {
    const pObj = `${node.uila?.block2_intuitivePrototype?.physicalObject || ""} ${node.uila?.block2_intuitivePrototype?.isomorphicMapping || ""}`.toLowerCase();
    const hasPhysical = PHYSICAL_ANCHORS.some(a => pObj.includes(a));
    if (!hasPhysical && node.uila?.block2_intuitivePrototype) {
      violations.push({
        nodeId: node.id, ruleId: "WEAK_ISOMORPHIC_PROTOTYPE", severity: "WARNING", tier: 2,
        message: "Block 2 prototype lacks tangible mechanical anchor (e.g. lever, coin, fluid, scale).",
        remediation: "Ground isomorphic model using an interactive physical mechanism.",
      });
    } else {
      passedRules.push(`TIER2_ISOMORPHIC_GROUNDING_${node.id}`);
    }

    const prompt = (node.forwardPass?.prompt || "").toLowerCase();
    const isTransfer = /\b(predict|determine|calculate|observe|infer|if|outcome|what happens)\b/.test(prompt);
    if (!isTransfer && prompt.length > 0) {
      violations.push({
        nodeId: node.id, ruleId: "ROTE_RECALL_PROBE", severity: "WARNING", tier: 2,
        message: "Block 5 probe appears to test rote recall instead of causal state prediction.",
        remediation: "Frame probe as a state prediction challenge: 'If parameter X changes, predict outcome Y'.",
      });
    } else {
      passedRules.push(`TIER2_TRANSFER_PREDICTION_${node.id}`);
    }
  }

  public generateNoviceEvaluationPrompt(node: CompetencyNode): string {
    const b1 = node.uila?.block1_anomaly?.groundState || "";
    const b2 = node.uila?.block2_intuitivePrototype?.isomorphicMapping || "";
    const b3 = node.uila?.block3_coreMechanics?.invariantProperty || "";
    const b4 = node.uila?.block4_notationContract?.minimalFormalization || "";
    const options = (node.forwardPass?.options || []).map((o, i) => `[${String.fromCharCode(65 + i)}] ${o.text}`).join("\n");

    return `SYSTEM: You are an epistemic novice evaluator with ZERO external domain knowledge.
TASK: Determine if the test probe below is solvable SOLELY using the preliminary context.

=== PRELIMINARY CONTEXT ===
Block 1: ${b1}
Block 2: ${b2}
Block 3: ${b3}
Block 4: ${b4}

=== TEST PROBE ===
Question: ${node.forwardPass?.prompt || ""}
Options:
${options}

VERDICT INSTRUCTION: Reply with CAN_DERIVE: YES or NO, and MISSING_AXIOMS: <list>.`;
  }

  private buildReport(violations: AuditViolation[], passedRules: string[], totalNodes: number): CurriculumAuditReport {
    const errors = violations.filter(v => v.severity === "ERROR").length;
    const warnings = violations.filter(v => v.severity === "WARNING").length;
    const score = Math.max(0, 100 - (errors * 20 + warnings * 5));

    return {
      valid: errors === 0,
      strictValid: errors === 0 && warnings === 0,
      score, totalNodes, passedRules, violations,
      summary: {
        errors, warnings,
        tier1Pass: violations.filter(v => v.tier === 1 && v.severity === "ERROR").length === 0,
        tier2Pass: violations.filter(v => v.tier === 2 && v.severity === "ERROR").length === 0,
        tier3Pass: true,
      },
    };
  }
}
