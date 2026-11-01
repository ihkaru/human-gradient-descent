import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DAGCycleDetector } from "../validator/dag-cycle-detector.js";
import { ForwardPassEngine } from "../engine/forward-pass.js";
import { LossEngine } from "../engine/loss-engine.js";
import { BackwardPassEngine } from "../engine/backward-pass.js";
import { LearnerStateTracker } from "../engine/state-tracker.js";
import type { CurriculumManifest, NodeShard, LearnerState } from "../types/curriculum.js";

export function handleCheckDAG(args: string[]) {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");

  if (!existsSync(manifestPath)) {
    console.error(`[ERROR] Missing curriculum-manifest.json in ${currDir}`);
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
    console.log(`[OK] DAG Integrity Verified: ${manifest.dag.nodes.length} nodes, ${manifest.dag.edges.length} edges.`);
    console.log(`     Acyclic: YES (0 cycles) | Strongly Connected Components: ${res.sccCount}`);
    if (res.topologicalOrder && res.topologicalOrder.length > 0) {
      console.log(`     Topological Root: ${res.topologicalOrder[0]}`);
      console.log(`     Topological Leaf: ${res.topologicalOrder[res.topologicalOrder.length - 1]}`);
    }
  } else {
    console.error(`[ERROR] DAG Integrity Check Failed (${res.cycles.length} cycle(s)):`);
    for (const diag of res.diagnostics) {
      console.error(`     - ${diag}`);
    }
    process.exit(1);
  }
}

export function handleStatus(args: string[]) {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");
  const statePath = join(currDir, "learner-state.json");

  if (!existsSync(manifestPath)) {
    console.error(`[ERROR] Missing curriculum-manifest.json in ${currDir}`);
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

  console.log("\n=======================================================================");
  console.log(`[STATUS] LEARNER COGNITIVE CONVERGENCE: ${manifest.title}`);
  console.log("=======================================================================");
  console.log(`Global Mastery: ${(state.globalMastery * 100).toFixed(1)}%`);
  console.log(`Mastered Nodes: ${state.masteredNodes.length} / ${manifest.scale.totalNodes}`);
  console.log(`Active Frontier (${state.activeFrontier.length} ready):`);
  for (const f of state.activeFrontier.slice(0, 10)) {
    const node = manifest.dag.nodes.find((n) => n.id === f);
    console.log(`  > [${node?.cognitiveLevel || "node"}] ${node?.title || f} (${f})`);
  }
  console.log("=======================================================================\n");
}

export async function handleLearn(args: string[]) {
  const currDir = args[1] || ".";
  const manifestPath = join(currDir, "curriculum-manifest.json");
  const statePath = join(currDir, "learner-state.json");

  if (!existsSync(manifestPath)) {
    console.error(`[ERROR] Missing curriculum-manifest.json in ${currDir}`);
    process.exit(1);
  }

  const manifest: CurriculumManifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const tracker = new LearnerStateTracker();
  let state: LearnerState = existsSync(statePath)
    ? JSON.parse(readFileSync(statePath, "utf-8"))
    : tracker.initializeState("learner-default", manifest);

  tracker.recomputeFrontier(state, manifest);

  if (state.activeFrontier.length === 0) {
    console.log("[CONVERGED] All nodes in this curriculum have been mastered!");
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

  process.stdout.write("[INPUT] Enter your prediction / causal explanation: ");
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
      console.log(`\n[CONVERGED] Loss: ${lossResult.totalLoss}. Node mastered (theta=${state.weights[node.id].theta}).`);
      break;
    } else {
      console.log(bpEngine.formatTerminalDisplay(intervention));
      process.stdout.write("[INPUT] Enter revised prediction: ");
    }
  }
}
