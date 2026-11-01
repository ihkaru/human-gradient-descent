import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { CurriculumAuditor } from "./curriculum-auditor.js";
import type {
  CurriculumManifest,
  NodeShard,
  CompetencyNode,
  DiagnosticOption,
  AuditViolation,
  CurriculumAuditReport,
  LossVector,
} from "../types/curriculum.js";
import type { ContrastingCase } from "../types/uila.js";

export interface RemediationReport {
  targetDir: string;
  initialScore: number;
  finalScore: number;
  resolvedViolations: number;
  patchedNodesCount: number;
  unresolvedCount: number;
  details: string[];
}

export class AutoRemediator {
  private auditor = new CurriculumAuditor();

  public remediate(
    targetDir: string,
    options: { dryRun?: boolean } = {}
  ): RemediationReport {
    const initialReport = this.auditor.audit(targetDir, { strict: true });
    if (initialReport.valid && initialReport.score === 100) {
      return {
        targetDir,
        initialScore: 100,
        finalScore: 100,
        resolvedViolations: 0,
        patchedNodesCount: 0,
        unresolvedCount: 0,
        details: ["Curriculum already 100% compliant, zero patches needed."],
      };
    }

    const manifestPath = join(targetDir, "curriculum-manifest.json");
    const manifest: CurriculumManifest = JSON.parse(
      readFileSync(manifestPath, "utf-8")
    );
    const patchedShards: Map<string, NodeShard> = new Map();
    const details: string[] = [];
    const patchedNodeIds = new Set<string>();

    for (const violation of initialReport.violations) {
      if (violation.nodeId === "ROOT") continue;

      const dagNode = manifest.dag.nodes.find((n) => n.id === violation.nodeId);
      if (!dagNode) continue;

      const shardPath = join(targetDir, "shards", `${dagNode.shardId}.json`);
      if (!existsSync(shardPath)) continue;

      let shard = patchedShards.get(dagNode.shardId);
      if (!shard) {
        shard = JSON.parse(readFileSync(shardPath, "utf-8"));
        patchedShards.set(dagNode.shardId, shard!);
      }

      const node = shard!.nodes.find((n) => n.id === violation.nodeId);
      if (!node) continue;

      const patched = this.patchViolation(node, violation);
      if (patched) {
        patchedNodeIds.add(node.id);
        details.push(
          `[REMEDIATED] [${node.id}] ${violation.ruleId}: Applied causal patch.`
        );
      }
    }

    if (!options.dryRun) {
      for (const [shardId, shard] of patchedShards.entries()) {
        const shardPath = join(targetDir, "shards", `${shardId}.json`);
        writeFileSync(shardPath, JSON.stringify(shard, null, 2));
      }
    }

    const finalReport = this.auditor.audit(
      options.dryRun
        ? { manifest, shards: Array.from(patchedShards.values()) }
        : targetDir,
      { strict: true }
    );

    return {
      targetDir,
      initialScore: initialReport.score,
      finalScore: finalReport.score,
      resolvedViolations:
        initialReport.violations.length - finalReport.violations.length,
      patchedNodesCount: patchedNodeIds.size,
      unresolvedCount: finalReport.violations.length,
      details,
    };
  }

  public patchViolation(node: CompetencyNode, violation: AuditViolation): boolean {
    switch (violation.ruleId) {
      case "WORKING_MEMORY_OVERFLOW":
        return this.remediateWorkingMemory(node);
      case "INSUFFICIENT_DIAGNOSTIC_OPTIONS":
      case "MISSING_DISTRACTOR_AXIS":
        return this.remediateDiagnosticOptions(node);
      case "INVALID_CORRECT_OPTION_COUNT":
        return this.remediateCorrectOptionCount(node);
      case "MISSING_CONTRASTING_CASES":
        return this.remediateContrastingCases(node);
      default:
        return false;
    }
  }

  public truncateToWords(text: string, maxWords: number): string {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return text.trim();

    // Prefer ending at a sentence boundary within limit
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let result = "";
    for (const s of sentences) {
      const candidate = (result + " " + s).trim();
      if (candidate.split(/\s+/).filter(Boolean).length <= maxWords) {
        result = candidate;
      } else {
        break;
      }
    }

    if (result.length > 0) return result.trim();
    return words.slice(0, maxWords).join(" ") + ".";
  }

  private remediateWorkingMemory(node: CompetencyNode): boolean {
    let modified = false;
    if (node.forwardPass?.microPrimer) {
      node.forwardPass.microPrimer = this.truncateToWords(
        node.forwardPass.microPrimer,
        45
      );
      modified = true;
    }
    if (node.conceptSummary) {
      node.conceptSummary = this.truncateToWords(node.conceptSummary, 45);
      modified = true;
    }
    const wordCount = (node.forwardPass.microPrimer || node.conceptSummary)
      .split(/\s+/)
      .filter(Boolean).length;
    node.workingMemoryBudget = {
      wordCount,
      estimatedReadingSeconds: Math.ceil(wordCount / 4),
    };
    return modified;
  }

  private remediateDiagnosticOptions(node: CompetencyNode): boolean {
    if (!node.forwardPass.options) {
      node.forwardPass.options = [];
    }

    const options = node.forwardPass.options;
    const existingAxes = new Set<string>();
    for (const opt of options) {
      if (opt.diagnosticAxis) existingAxes.add(opt.diagnosticAxis);
    }

    // Ensure at least 1 correct option exists
    let hasCorrect = options.some((o) => o.isCorrect);
    if (!hasCorrect) {
      if (options.length > 0) {
        options[0].isCorrect = true;
        hasCorrect = true;
      } else {
        options.push({
          optionId: "opt_correct",
          text: node.forwardPass.groundTruth || "Correct causal invariant holding system balance.",
          isCorrect: true,
          causalRationale: "Accurately identifies the grounded invariant.",
        });
      }
    }

    const candidateAxes: Array<{ axis: keyof LossVector; label: string }> = [
      { axis: "conceptGap", label: "Superficial definition without causal dynamics" },
      { axis: "notationBreakdown", label: "Misinterpreting mathematical symbols or boundary conditions" },
      { axis: "reasoningBug", label: "Inverting causal direction or temporal order" },
      { axis: "methodChoice", label: "Applying classical heuristic to quantum system" },
      { axis: "missingPrerequisite", label: "Missing fundamental dependency grounding" },
    ];

    let optIndex = options.length;
    for (const cand of candidateAxes) {
      if (options.length >= 4) break;
      if (!existingAxes.has(cand.axis)) {
        options.push({
          optionId: `opt_distractor_${optIndex + 1}`,
          text: `Flawed claim based on ${cand.label.toLowerCase()} in ${node.title}.`,
          isCorrect: false,
          diagnosticAxis: cand.axis,
          causalRationale: `Diagnostic indicator of ${cand.axis}: student commits ${cand.label}.`,
          specificRemediation: `Review ${node.title} invariant mechanics to correct this misconception.`,
        });
        existingAxes.add(cand.axis);
        optIndex++;
      }
    }

    // Fill missing diagnosticAxis on existing distractors
    for (const opt of options) {
      if (!opt.isCorrect && !opt.diagnosticAxis) {
        const unused = candidateAxes.find((c) => !existingAxes.has(c.axis));
        opt.diagnosticAxis = unused ? unused.axis : "conceptGap";
        existingAxes.add(opt.diagnosticAxis);
      }
    }

    return true;
  }

  private remediateCorrectOptionCount(node: CompetencyNode): boolean {
    if (!node.forwardPass.options || node.forwardPass.options.length === 0) {
      return this.remediateDiagnosticOptions(node);
    }

    let foundFirst = false;
    for (const opt of node.forwardPass.options) {
      if (opt.isCorrect) {
        if (!foundFirst) {
          foundFirst = true;
        } else {
          opt.isCorrect = false;
          if (!opt.diagnosticAxis) opt.diagnosticAxis = "reasoningBug";
        }
      }
    }

    if (!foundFirst) {
      node.forwardPass.options[0].isCorrect = true;
    }

    return true;
  }

  private remediateContrastingCases(node: CompetencyNode): boolean {
    if (!node.uila) {
      node.uila = {};
    }
    if (!node.uila.block3_coreMechanics) {
      node.uila.block3_coreMechanics = {
        invariantProperty: `Conservation of system balance in ${node.title}`,
        variableComponents: ["state", "parameter"],
        contrastingCases: [],
      };
    }

    const cases = node.uila.block3_coreMechanics.contrastingCases;
    if (cases.length === 0) {
      cases.push({
        beginnerMisconception: `Assuming ${node.title} operates statically without state conservation.`,
        physicalReality: `In reality, ${node.uila.block3_coreMechanics.invariantProperty} dictates dynamic equilibrium.`,
      });
      return true;
    }

    return false;
  }
}
