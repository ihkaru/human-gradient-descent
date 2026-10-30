#!/usr/bin/env bun
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_LINES = 350;
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".cache",
  ".session-cache"
]);
const IGNORE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".webp",
  ".lock",
  ".lockb"
]);

let violations = 0;
let filesChecked = 0;

function walk(dir: string) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = fullPath.slice(fullPath.lastIndexOf("."));
      if (IGNORE_EXTENSIONS.has(ext)) continue;

      const content = readFileSync(fullPath, "utf-8");
      const lines = content.split("\n").length;
      filesChecked++;

      if (lines > MAX_LINES) {
        console.error(
          `❌ [LINE LIMIT] ${fullPath}: ${lines} lines (exceeds limit of ${MAX_LINES})`
        );
        violations++;
      }
    }
  }
}

walk(".");
if (violations > 0) {
  console.error(`\nFound ${violations} file(s) exceeding ${MAX_LINES} lines.`);
  process.exit(1);
} else {
  console.log(`✅ All ${filesChecked} files comply with line limit (< ${MAX_LINES} lines).`);
}
