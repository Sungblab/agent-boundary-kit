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

const outputExamples = [
  {
    path: "hooks/claude/examples/runner-dry-run-cli.planned-output.json",
    status: "planned",
    exitCode: 0,
    selectedScannersLength: 4,
    configurationErrorsLength: 0,
  },
  {
    path: "hooks/claude/examples/runner-dry-run-cli.configuration-error-output.json",
    status: "configuration-error",
    exitCode: 2,
    selectedScannersLength: 0,
    configurationErrorsLength: 1,
  },
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

function readJson(relativePath) {
  return JSON.parse(readRelative(relativePath));
}

function assertNoForbiddenOutputFields(value, relativePath, trail = []) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoForbiddenOutputFields(item, relativePath, trail.concat(String(index))));
    return;
  }

  for (const key of Object.keys(value)) {
    assert(
      !["findings", "finalResponse", "prDescription", "releaseNotes", "productCopy", "completionClaim"].includes(key),
      `${relativePath} includes forbidden output field ${trail.concat(key).join(".")}`
    );
    assertNoForbiddenOutputFields(value[key], relativePath, trail.concat(key));
  }
}

function assertOutputExample(example) {
  assert(fs.existsSync(path.join(root, example.path)), `${example.path} is missing`);
  const output = readJson(example.path);

  assertNoForbiddenOutputFields(output, example.path);
  assert(output.mode === "dry-run-plan", `${example.path}: mode mismatch`);
  assert(output.hookId && typeof output.hookId === "string", `${example.path}: hookId must be a string`);
  assert(output.inputPath && typeof output.inputPath === "string", `${example.path}: inputPath must be a string`);
  assert(output.status === example.status, `${example.path}: status mismatch`);
  assert(output.exitCode === example.exitCode, `${example.path}: exitCode mismatch`);
  assert(Array.isArray(output.selectedScanners), `${example.path}: selectedScanners must be an array`);
  assert(
    output.selectedScanners.length === example.selectedScannersLength,
    `${example.path}: selectedScanners length mismatch`
  );
  assert(Array.isArray(output.configurationErrors), `${example.path}: configurationErrors must be an array`);
  assert(
    output.configurationErrors.length === example.configurationErrorsLength,
    `${example.path}: configurationErrors length mismatch`
  );
  assert(Array.isArray(output.nonGoals), `${example.path}: nonGoals must be an array`);

  for (const phrase of ["Do not execute scanners", "Do not install hooks", "Do not write files", "Do not write final responses"]) {
    assert(output.nonGoals.includes(phrase), `${example.path}: missing non-goal ${phrase}`);
  }

  for (const selected of output.selectedScanners) {
    assert(selected.scanner && typeof selected.scanner === "string", `${example.path}: selected scanner needs name`);
    assert(selected.script && fs.existsSync(path.join(root, selected.script)), `${example.path}: selected script missing`);
    assert(Array.isArray(selected.inputsRequired), `${example.path}: selected scanner must name required inputs`);
    assert(selected.willExecute === false, `${example.path}: selected scanner must not execute`);
  }

  for (const error of output.configurationErrors) {
    assert(error.scanner && typeof error.scanner === "string", `${example.path}: error scanner needs name`);
    assert(Array.isArray(error.missingInputs) && error.missingInputs.length > 0, `${example.path}: missingInputs required`);
    assert(error.reason && typeof error.reason === "string", `${example.path}: error reason required`);
  }
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

  for (const example of outputExamples) {
    assert(markdown.includes(example.path), `dry-run CLI contract missing output example: ${example.path}`);
    assertOutputExample(example);
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

  console.log(`hook runner dry-run CLI contract check passed (${outputExamples.length} output examples)`);
}

main();
