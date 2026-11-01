#!/usr/bin/env bun
import {
  handleGenerate,
  handleCompile,
  handleValidate,
  handleAudit,
  handleRemediate,
  handleExportDAG,
} from "./cli/author-commands.js";
import {
  handleCheckDAG,
  handleStatus,
  handleLearn,
} from "./cli/learner-commands.js";

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
Human Gradient Descent (HGD) CLI v1.2.0

Usage:
  hgd generate "<topic>" -o <output_dir>          Synthesize complete grounded curriculum from scratch
  hgd compile <input.md> -o <output_dir>           Compile markdown into sharded curriculum
  hgd validate <curriculum_dir>                    Validate curriculum and shards against schema
  hgd audit <curriculum_dir> [--strict] [--json]   Run 3-tier curriculum evaluation & causal closure audit
  hgd remediate <curriculum_dir> [--dry-run]       Auto-patch curriculum audit violations deterministically
  hgd export-dag <curriculum_dir> [--format <fmt>] Export DAG to Mermaid flowchart or Markdown report
  hgd check-dag <curriculum_dir>                   Run Tarjan SCC acyclicity and DAG integrity check
  hgd learn <curriculum_dir>                       Start interactive terminal learning loop
  hgd status <curriculum_dir>                      Inspect learner weights and active frontier

Options:
  --help, -h       Show help
  --json           Output raw machine-readable JSON (agent mode)
  --dry-run        Simulate remediation without modifying disk files
  --format <fmt>   Export format for DAG: 'mermaid' (default) or 'markdown'
`);
}

switch (command) {
  case "generate":
    handleGenerate(args);
    break;
  case "compile":
    handleCompile(args);
    break;
  case "validate":
    handleValidate(args);
    break;
  case "audit":
    handleAudit(args);
    break;
  case "remediate":
  case "fix":
    handleRemediate(args);
    break;
  case "export-dag":
  case "graph":
    handleExportDAG(args);
    break;
  case "check-dag":
    handleCheckDAG(args);
    break;
  case "status":
    handleStatus(args);
    break;
  case "learn":
    handleLearn(args);
    break;
  case "--help":
  case "-h":
  default:
    printHelp();
    break;
}
