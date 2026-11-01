import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { SchemaValidator } from "../validator/schema-validator.js";
import { CurriculumAuditor } from "../validator/curriculum-auditor.js";
import { AutoRemediator } from "../validator/auto-remediator.js";
import { DAGExporter } from "../validator/dag-exporter.js";
import { MarkdownCurriculumCompiler } from "../compiler/markdown-compiler.js";
import { TopicCurriculumSynthesizer } from "../compiler/topic-synthesizer.js";
import type { CurriculumManifest, LearnerState } from "../types/curriculum.js";

export function handleGenerate(args: string[]) {
  const topic = args[1];
  const outIdx = args.indexOf("-o");
  const outDir = outIdx !== -1 ? args[outIdx + 1] : "./curriculum-output";

  if (!topic) {
    console.error('[ERROR] Please provide a topic: hgd generate "<topic>" -o <output_dir>');
    process.exit(1);
  }

  const synthesizer = new TopicCurriculumSynthesizer();
  const { markdown, manifest, shards } = synthesizer.synthesizeFromTopic(topic);

  const shardsDir = join(outDir, "shards");
  mkdirSync(shardsDir, { recursive: true });

  writeFileSync(join(outDir, "source.md"), markdown);
  writeFileSync(join(outDir, "curriculum-manifest.json"), JSON.stringify(manifest, null, 2));

  for (const shard of shards) {
    writeFileSync(join(shardsDir, `${shard.shardId}.json`), JSON.stringify(shard, null, 2));
  }

  console.log(`[OK] Synthesized curriculum for '${topic}' from scratch!`);
  console.log(`     Generated ${manifest.scale.totalNodes} nodes across ${manifest.scale.totalShards} shards into ${outDir}`);
}

export function handleCompile(args: string[]) {
  const inputFile = args[1];
  const outIdx = args.indexOf("-o");
  const outDir = outIdx !== -1 ? args[outIdx + 1] : "./curriculum-output";

  if (!inputFile || !existsSync(inputFile)) {
    console.error(`[ERROR] Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const content = readFileSync(inputFile, "utf-8");
  const compiler = new MarkdownCurriculumCompiler();
  const title = inputFile.replace(/\.[^/.]+$/, "").split("/").pop() || "Curriculum";

  const { manifest, shards } = compiler.compile(content, {
    curriculumId: title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    title,
    domain: "KnowledgeBase",
    nodesPerShard: 1,
  });

  const shardsDir = join(outDir, "shards");
  mkdirSync(shardsDir, { recursive: true });

  writeFileSync(join(outDir, "curriculum-manifest.json"), JSON.stringify(manifest, null, 2));

  for (const shard of shards) {
    writeFileSync(join(shardsDir, `${shard.shardId}.json`), JSON.stringify(shard, null, 2));
  }

  console.log(`[OK] Compiled ${manifest.scale.totalNodes} nodes across ${manifest.scale.totalShards} shards into ${outDir}`);
}

export function handleValidate(args: string[]) {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");

  if (!existsSync(manifestPath)) {
    console.error(`[ERROR] Missing curriculum-manifest.json in ${currDir}`);
    process.exit(1);
  }

  const validator = new SchemaValidator(resolve("./schemas"));
  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const mRes = validator.validateManifest(manifest);

  if (!mRes.valid) {
    console.error(`[ERROR] Manifest validation failed:\n${mRes.errors?.join("\n")}`);
    process.exit(1);
  }

  console.log(`[OK] Manifest ${manifest.curriculumId} is valid.`);

  let totalValidShards = 0;
  for (const entry of manifest.shards) {
    const shardPath = join(currDir, entry.filePath);
    if (!existsSync(shardPath)) {
      console.error(`[ERROR] Missing shard file: ${shardPath}`);
      process.exit(1);
    }
    const shardData = JSON.parse(readFileSync(shardPath, "utf-8"));
    const sRes = validator.validateShard(shardData);
    if (!sRes.valid) {
      console.error(`[ERROR] Shard ${entry.shardId} failed validation:\n${sRes.errors?.join("\n")}`);
      process.exit(1);
    }
    totalValidShards++;
  }

  console.log(`[OK] All ${totalValidShards} shards successfully validated against Draft 2020-12 schema.`);
}

export function handleAudit(args: string[]) {
  const dir = args[1] || "./curriculum-output";
  const isStrict = args.includes("--strict");
  const isJson = args.includes("--json");
  const auditor = new CurriculumAuditor();
  const report = auditor.audit(dir, { strict: isStrict });

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.valid ? 0 : 1);
  }

  console.log(`\n=== HGD Curriculum Audit: ${dir} ===`);
  console.log(`Overall Score: ${report.score}/100 | Status: ${report.valid ? "PASSED" : "FAILED"}`);
  console.log(`Summary: ${report.summary.errors} errors, ${report.summary.warnings} warnings across ${report.totalNodes} nodes.`);
  if (report.violations.length > 0) {
    console.log(`\nViolations:`);
    for (const v of report.violations) {
      console.log(`  [Tier ${v.tier}] [${v.severity}] [${v.nodeId}] ${v.ruleId}: ${v.message}`);
      console.log(`    Remediation: ${v.remediation}`);
    }
  }
  process.exit(isStrict ? (report.strictValid ? 0 : 1) : (report.valid ? 0 : 1));
}

export function handleRemediate(args: string[]) {
  const dir = args[1] || "./curriculum-output";
  const dryRun = args.includes("--dry-run");
  const isJson = args.includes("--json");

  const remediator = new AutoRemediator();
  const res = remediator.remediate(dir, { dryRun });

  if (isJson) {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.finalScore === 100 ? 0 : 1);
  }

  console.log(`\n=== HGD Auto-Remediation: ${dir} ===`);
  console.log(`Initial Score: ${res.initialScore}/100 -> Final Score: ${res.finalScore}/100`);
  console.log(`Resolved Violations: ${res.resolvedViolations} | Patched Nodes: ${res.patchedNodesCount}`);
  if (res.details.length > 0) {
    for (const d of res.details) {
      console.log(`  ${d}`);
    }
  }
  if (dryRun) {
    console.log("  [INFO] Dry-run active. Shards on disk were not overwritten.");
  }
}

export function handleExportDAG(args: string[]) {
  const dir = args[1] || ".";
  const manifestPath = join(dir, "curriculum-manifest.json");
  const statePath = join(dir, "learner-state.json");

  if (!existsSync(manifestPath)) {
    console.error(`[ERROR] Missing curriculum-manifest.json in ${dir}`);
    process.exit(1);
  }

  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  let state: LearnerState | undefined;
  if (existsSync(statePath)) {
    state = JSON.parse(readFileSync(statePath, "utf-8"));
  }

  const exporter = new DAGExporter();
  const format = args.includes("--format") ? args[args.indexOf("--format") + 1] : "mermaid";

  if (format === "markdown" || format === "md") {
    console.log(exporter.exportMarkdownReport(manifest, state));
  } else {
    console.log(exporter.exportMermaid(manifest, state));
  }
}
