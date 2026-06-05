const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const contractPath = path.join(root, "docs", "hook-runner-dry-run-cli-contract.md");

const requiredLinkedDocs = [
  "docs/hook-runner-minimal-plan.md",
  "docs/hook-runner-selection-matrix.md",
  "docs/hook-runner-dry-run-spec.md",
  "docs/enforcement-surfaces.md",
  "docs/benchmark-backlog.md",
  "docs/next-session-prompt.md",
  "hooks/claude/README.md",
];

const requiredExamples = [
  "hooks/claude/examples/runner-input.valid.json",
  "hooks/claude/examples/runner-input.invalid-transcript.json",
  "hooks/claude/examples/runner-input.invalid-missing-metadata.json",
  "hooks/claude/examples/runner-dry-run.post-edit-scope-fanout.json",
];

const requiredFields = [
  "mode",
  "hookId",
  "inputPath",
  "status",
  "exitCode",
  "selectedScanners",
  "configurationErrors",
  "nonGoals",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function main() {
  assert(fs.existsSync(contractPath), "docs/hook-runner-dry-run-cli-contract.md is missing");

  const markdown = fs.readFileSync(contractPath, "utf8");

  for (const phrase of [
    "# Hook Runner Dry-Run CLI Contract",
    "not an installed hook",
    "not a runner implementation",
    "plan-only dry run",
    "abk-runner dry-run --input <runner-input.json>",
    "does not execute scanners",
    "does not install hooks",
    "writes no files",
    "No raw private transcripts",
    "No hidden chat history",
    "No broad workspace scraping",
    "No final responses",
    "docs/hook-runner-input-contract.md",
    "docs/hook-runner-output-contract.md",
    "docs/hook-runner-selection-matrix.md",
    "docs/hook-runner-dry-run-spec.md",
    "Exit 0",
    "Exit 2",
    "Exit 1 is reserved",
    "Do not package hooks yet",
  ]) {
    assert(markdown.includes(phrase), `dry-run CLI contract missing phrase: ${phrase}`);
  }

  for (const example of requiredExamples) {
    assert(markdown.includes(example), `dry-run CLI contract missing example: ${example}`);
    assert(fs.existsSync(path.join(root, example)), `example file does not exist: ${example}`);
  }

  for (const field of requiredFields) {
    assert(markdown.includes(field), `dry-run CLI contract missing output field: ${field}`);
  }

  for (const phrase of [
    '"mode": "dry-run-plan"',
    '"status": "planned"',
    '"status": "configuration-error"',
    '"exitCode": 0',
    '"exitCode": 2',
    "No `findings` field",
    "No `finalResponse` field",
  ]) {
    assert(markdown.includes(phrase), `dry-run CLI contract missing JSON phrase: ${phrase}`);
  }

  for (const relativePath of requiredLinkedDocs) {
    assert(
      readRelative(relativePath).includes("docs/hook-runner-dry-run-cli-contract.md"),
      `${relativePath} must link docs/hook-runner-dry-run-cli-contract.md`
    );
  }

  console.log("hook runner dry-run CLI contract check passed");
}

main();
