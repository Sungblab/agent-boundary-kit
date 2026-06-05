const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-phase-gate-plan.js");
const sourceRepoPath = path.join(root, "benchmarks", "fixtures", "overengineering-collusion", "repo");
const sourcePromptPath = path.join(root, "benchmarks", "fixtures", "overengineering-collusion", "prompt.md");
const runsRoot = path.join(root, "benchmarks", "runs", "overengineering-collusion");

function latestOverengineeringRunRepo() {
  const runNames = fs
    .readdirSync(runsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  assert.ok(runNames.length > 0, "overengineering-collusion run repo is required for green scanner evidence");
  return path.join(runsRoot, runNames[0], "agent-handoff", "repo");
}

function runScanner(args) {
  return spawnSync(process.execPath, [scannerPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function outputOf(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}

function writeFile(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function writeGreenPlan(filePath) {
  writeFile(
    filePath,
    [
      "# First Implementation Plan",
      "",
      "The full brief is too large for one slice, so the current plan should prove one narrow behavior first.",
      "",
      "## First Slice",
      "",
      "Build one first fixture: a source-summary proof point.",
      "",
      "## Evidence Gate",
      "",
      "Pass criteria:",
      "",
      "- The fixture source exists.",
      "- The output can be compared against expected source-backed text.",
      "",
      "Fail criteria:",
      "",
      "- The slice requires graph views, memory, collaboration, or agent workflows.",
      "",
      "## Deferred Scope",
      "",
      "Defer source ingest beyond the single fixture file.",
      "Defer artifact generation beyond one summary artifact.",
      "Defer graph views, project memory, collaboration, and agent workflows.",
      "",
    ].join("\n")
  );
}

function main() {
  const redResult = runScanner([sourceRepoPath]);
  const redOutput = outputOf(redResult);

  assert.equal(redResult.status, 1, "source overengineering fixture should exit 1");
  assert.match(redOutput, /plan\.md/, "red scanner output should name plan.md");
  assert.match(redOutput, /broad current scope/, "red scanner output should name broad current scope");
  assert.match(redOutput, /completion claim/, "red scanner output should name completion claim");
  assert.match(redOutput, /missing first proof point/, "red scanner output should name missing first proof point");

  const promptOnlyResult = runScanner([sourcePromptPath]);
  assert.equal(outputOf(promptOnlyResult), "", "prompt text should not emit findings by itself");
  assert.equal(promptOnlyResult.status, 0, "prompt text should exit 0 because it is task evidence");

  const greenRunRepo = latestOverengineeringRunRepo();
  const greenRunResult = runScanner([greenRunRepo]);
  assert.equal(outputOf(greenRunResult), "", "reviewed green overengineering run should not emit findings");
  assert.equal(greenRunResult.status, 0, "reviewed green overengineering run should exit 0");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-phase-gate-plan-"));

  try {
    const badAllScopeRepo = path.join(tempRoot, "bad-all-scope-repo");
    writeFile(
      path.join(badAllScopeRepo, "plan.md"),
      [
        "# Implementation Plan",
        "",
        "Build the full product in one implementation pass.",
        "",
        "Current scope:",
        "",
        "- source ingest",
        "- artifact generation",
        "- graph views",
        "- project memory",
        "- collaboration",
        "- agent workflows",
        "",
        "Implementation complete when all systems are built and ready to launch.",
        "",
      ].join("\n")
    );

    const badAllScopeResult = runScanner([badAllScopeRepo]);
    const badAllScopeOutput = outputOf(badAllScopeResult);
    assert.equal(badAllScopeResult.status, 1, "broad all-scope plan should exit 1");
    assert.match(badAllScopeOutput, /broad current scope/, "all-scope output should name broad current scope");
    assert.match(badAllScopeOutput, /completion claim/, "all-scope output should name completion claim");

    const badNoEvidenceRepo = path.join(tempRoot, "bad-no-evidence-repo");
    writeFile(
      path.join(badNoEvidenceRepo, "plan.md"),
      [
        "# First Implementation Plan",
        "",
        "The full brief is too large for one slice.",
        "",
        "## First Slice",
        "",
        "Start with one first slice.",
        "",
        "## Deferred Scope",
        "",
        "Defer graph views and collaboration until later.",
        "",
      ].join("\n")
    );

    const badNoEvidenceResult = runScanner([badNoEvidenceRepo]);
    const badNoEvidenceOutput = outputOf(badNoEvidenceResult);
    assert.equal(badNoEvidenceResult.status, 1, "plan without evidence gate should exit 1");
    assert.match(badNoEvidenceOutput, /missing evidence gate/, "no-evidence output should name missing evidence gate");

    const greenRepo = path.join(tempRoot, "green-repo");
    writeGreenPlan(path.join(greenRepo, "plan.md"));

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "phase-gated plan should not emit findings");
    assert.equal(greenRepoResult.status, 0, "phase-gated plan should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("phase gate plan scanner check passed");
}

main();
