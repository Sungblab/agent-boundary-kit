const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const contractPath = path.join(root, "docs", "guidance-to-code-runner-input-contract.md");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function main() {
  assert.ok(fs.existsSync(contractPath), "docs/guidance-to-code-runner-input-contract.md is missing");

  const contract = fs.readFileSync(contractPath, "utf8");

  for (const phrase of [
    "# Guidance To Code Runner Input Contract",
    "guidance-to-code-leakage-scan",
    "benchmarks/scripts/scan-guidance-to-code-leakage.js",
    "docs/scanner-validation-guidance-to-code-leakage.md",
    "docs/scanner-application-guidance-to-code-leakage.md",
    "Current status: script-level scanner only",
    "repoRoot",
    "changedFiles",
    "task",
    "No raw private transcripts",
    "No hidden chat history",
    "No message arrays",
    "No private user examples",
    "No broad workspace scraping",
    "No inferred model preferences from chat context",
    "must return a bounded configuration error",
    "Do not add this scanner to `docs/hook-runner-selection-matrix.md`",
    "Do not add this scanner to `docs/hook-runner-read-only-execution-contract.md`",
    "Do not change `lib/abk-runner-core.js`",
    "Do not package hooks yet",
  ]) {
    assert(contract.includes(phrase), `guidance runner input contract missing phrase: ${phrase}`);
  }

  for (const relativePath of [
    "docs/benchmark-backlog.md",
    "docs/next-session-prompt.md",
    "docs/scanner-application-guidance-to-code-leakage.md",
  ]) {
    assert(
      read(relativePath).includes("docs/guidance-to-code-runner-input-contract.md"),
      `${relativePath} must link docs/guidance-to-code-runner-input-contract.md`
    );
  }

  console.log("guidance-to-code runner input contract check passed");
}

main();
