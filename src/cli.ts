#!/usr/bin/env bun
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { SchemaValidator } from "./validator/schema-validator.js";
import { DAGCycleDetector } from "./validator/dag-cycle-detector.js";
import { MarkdownCurriculumCompiler } from "./compiler/markdown-compiler.js";
import { TopicCurriculumSynthesizer } from "./compiler/topic-synthesizer.js";
import { ForwardPassEngine } from "./engine/forward-pass.js";
import { LossEngine } from "./engine/loss-engine.js";
import { BackwardPassEngine } from "./engine/backward-pass.js";
import { LearnerStateTracker } from "./engine/state-tracker.js";
import type { CurriculumManifest, NodeShard, LearnerState } from "./types/curriculum.js";

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
🧠 Human Gradient Descent (HGD) CLI v1.0.0

Usage:
  hgd generate "<topic>" -o <output_dir>  Synthesize complete grounded curriculum from scratch
  hgd compile <input.md> -o <output_dir>   Compile markdown into sharded curriculum
  hgd validate <curriculum_dir>            Validate curriculum and shards against schema
  hgd check-dag <curriculum_dir>           Run Tarjan SCC acyclicity and DAG integrity check
  hgd learn <curriculum_dir> [--node <id>] Start interactive learning session
  hgd status <curriculum_dir>              Inspect learner weights and active frontier

Options:
  --help, -h       Show help
  --json           Output raw machine-readable JSON (agent mode)
`);
}

function handleGenerate() {
  const topic = args[1];
  const outIdx = args.indexOf("-o");
  const outDir = outIdx !== -1 ? args[outIdx + 1] : "./curriculum-output";

  if (!topic) {
    console.error("❌ Please provide a topic: hgd generate \"<topic>\" -o <output_dir>");
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

  console.log(`✅ Synthesized curriculum for '${topic}' from scratch!`);
  console.log(`   Generated ${manifest.scale.totalNodes} nodes across ${manifest.scale.totalShards} shards into ${outDir}`);
}

function handleCompile() {
  const inputFile = args[1];
  const outIdx = args.indexOf("-o");
  const outDir = outIdx !== -1 ? args[outIdx + 1] : "./curriculum-output";

  if (!inputFile || !existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
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

  writeFileSync(
    join(outDir, "curriculum-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  for (const shard of shards) {
    writeFileSync(
      join(shardsDir, `${shard.shardId}.json`),
      JSON.stringify(shard, null, 2)
    );
  }

  console.log(`✅ Compiled ${manifest.scale.totalNodes} nodes across ${manifest.scale.totalShards} shards into ${outDir}`);
}

function handleValidate() {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");

  if (!existsSync(manifestPath)) {
    console.error(`❌ Missing curriculum-manifest.json in ${currDir}`);
    process.exit(1);
  }

  const validator = new SchemaValidator(resolve("./schemas"));
  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const mRes = validator.validateManifest(manifest);

  if (!mRes.valid) {
    console.error(`❌ Manifest validation failed:\n${mRes.errors?.join("\n")}`);
    process.exit(1);
  }

  console.log(`✓ Manifest ${manifest.curriculumId} is valid.`);

  let totalValidShards = 0;
  for (const entry of manifest.shards) {
    const shardPath = join(currDir, entry.filePath);
    if (!existsSync(shardPath)) {
      console.error(`❌ Missing shard file: ${shardPath}`);
      process.exit(1);
    }
    const shardData = JSON.parse(readFileSync(shardPath, "utf-8"));
    const sRes = validator.validateShard(shardData);
    if (!sRes.valid) {
      console.error(`❌ Shard ${entry.shardId} failed validation:\n${sRes.errors?.join("\n")}`);
      process.exit(1);
    }
    totalValidShards++;
  }

  console.log(`✅ All ${totalValidShards} shards successfully validated against Draft 2020-12 schema.`);
}

function handleCheckDAG() {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");

  if (!existsSync(manifestPath)) {
    console.error(`❌ Missing curriculum-manifest.json in ${currDir}`);
    process.exit(1);
  }

  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const detector = new DAGCycleDetector();
  const res = detector.validateManifest(manifest);

  if (args.includes("--json")) {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.isValid ? 0 : 1);
  }

  if (res.isValid) {
    console.log(`✅ DAG Integrity Verified: ${manifest.dag.nodes.length} nodes, ${manifest.dag.edges.length} edges.`);
    console.log(`   Acyclic: YES (0 cycles) | Strongly Connected Components: ${res.sccCount}`);
    if (res.topologicalOrder && res.topologicalOrder.length > 0) {
      console.log(`   Topological Root: ${res.topologicalOrder[0]}`);
      console.log(`   Topological Leaf: ${res.topologicalOrder[res.topologicalOrder.length - 1]}`);
    }
  } else {
    console.error(`❌ DAG Integrity Check Failed (${res.cycles.length} cycle(s)):`);
    for (const diag of res.diagnostics) {
      console.error(`   - ${diag}`);
    }
    process.exit(1);
  }
}

function handleStatus() {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");
  const statePath = join(currDir, "learner-state.json");

  if (!existsSync(manifestPath)) {
    console.error(`❌ Missing curriculum-manifest.json in ${currDir}`);
    process.exit(1);
  }

  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const tracker = new LearnerStateTracker();
  let state: LearnerState;

  if (existsSync(statePath)) {
    state = JSON.parse(readFileSync(statePath, "utf-8"));
    tracker.recomputeFrontier(state, manifest);
  } else {
    state = tracker.initializeState("learner-default", manifest);
  }

  if (args.includes("--json")) {
    console.log(JSON.stringify(state, null, 2));
    return;
  }

  console.log("\n═══════════════════════════════════════════════════════════════════════");
  console.log(`📊 LEARNER COGNITIVE STATUS: ${manifest.title}`);
  console.log("═══════════════════════════════════════════════════════════════════════");
  console.log(`🎓 Global Mastery: ${(state.globalMastery * 100).toFixed(1)}%`);
  console.log(`🏆 Mastered Nodes: ${state.masteredNodes.length} / ${manifest.scale.totalNodes}`);
  console.log(`🚀 Active Frontier (${state.activeFrontier.length} ready):`);
  for (const f of state.activeFrontier.slice(0, 10)) {
    const node = manifest.dag.nodes.find((n) => n.id === f);
    console.log(`   ▶ [${node?.cognitiveLevel || "node"}] ${node?.title || f} (${f})`);
  }
  console.log("═══════════════════════════════════════════════════════════════════════\n");
}

async function handleLearn() {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");
  const statePath = join(currDir, "learner-state.json");

  if (!existsSync(manifestPath)) {
    console.error(`❌ Missing curriculum-manifest.json in ${currDir}`);
    process.exit(1);
  }

  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const tracker = new LearnerStateTracker();
  let state: LearnerState = existsSync(statePath)
    ? JSON.parse(readFileSync(statePath, "utf-8"))
    : tracker.initializeState("learner-default", manifest);

  tracker.recomputeFrontier(state, manifest);

  if (state.activeFrontier.length === 0) {
    console.log("🎉 Congratulations! All nodes in this curriculum have been mastered!");
    return;
  }

  const targetNodeId = state.activeFrontier[0];
  const dagNode = manifest.dag.nodes.find((n) => n.id === targetNodeId);
  const shardPath = join(currDir, `shards/${dagNode?.shardId}.json`);
  const shard: NodeShard = JSON.parse(readFileSync(shardPath, "utf-8"));
  const node = shard.nodes.find((n) => n.id === targetNodeId)!;

  const fpEngine = new ForwardPassEngine();
  const challenge = fpEngine.generateChallenge(node);
  console.log(fpEngine.formatTerminalDisplay(challenge));

  process.stdout.write("✍️  Enter your prediction / causal explanation: ");
  for await (const line of console) {
    const answer = line.trim();
    const lossEngine = new LossEngine();
    const lossResult = lossEngine.evaluateLoss(node, answer);
    const bpEngine = new BackwardPassEngine();
    const attempt = (state.weights[node.id]?.attempts || 0) + 1;
    const intervention = bpEngine.generateIntervention(node, lossResult, attempt);

    tracker.updateWeight(state, node.id, intervention.deltaTheta, lossResult.totalLoss, lossResult.lossVector, manifest);
    writeFileSync(statePath, JSON.stringify(state, null, 2));

    if (lossResult.converged) {
      console.log(`\n🎉 CONVERGED! Loss: ${lossResult.totalLoss}. Node mastered (θ=${state.weights[node.id].theta}).`);
      break;
    } else {
      console.log(bpEngine.formatTerminalDisplay(intervention));
      process.stdout.write("✍️  Enter revised prediction: ");
    }
  }
}

switch (command) {
  case "generate":
    handleGenerate();
    break;
  case "compile":
    handleCompile();
    break;
  case "validate":
    handleValidate();
    break;
  case "check-dag":
    handleCheckDAG();
    break;
  case "status":
    handleStatus();
    break;
  case "learn":
    handleLearn();
    break;
  case "--help":
  case "-h":
  default:
    printHelp();
    break;
}
