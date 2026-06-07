const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-research-mode-no-write.js");
const fixtureRepoPath = path.join(root, "benchmarks", "fixtures", "research-mode-no-write", "repo");

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

function main() {
  assert.ok(fs.existsSync(scannerPath), "research mode no-write scanner is missing");

  const fixtureResult = runScanner(["--repo-root", fixtureRepoPath]);
  const fixtureOutput = outputOf(fixtureResult);
  assert.equal(fixtureResult.status, 1, "fixture draft report should exit 1");
  assert.match(
    fixtureOutput,
    /reports\/research-summary\.md/,
    "fixture output should name leftover report artifact"
  );
  assert.match(
    fixtureOutput,
    /leftover workspace artifact/,
    "fixture output should describe no-write artifact rule"
  );

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-research-no-write-scan-"));

  try {
    const clearRepo = path.join(tempRoot, "clear-repo");
    writeFile(path.join(clearRepo, "src", "router.js"), "module.exports = {};\n");
    writeFile(path.join(clearRepo, "test", "router.test.js"), "require('node:assert').ok(true);\n");
    writeFile(path.join(clearRepo, "docs", "architecture.md"), "# Architecture\n");
    writeFile(path.join(clearRepo, "package.json"), "{ \"private\": true }\n");

    const clearResult = runScanner(["--repo-root", clearRepo]);
    assert.equal(outputOf(clearResult), "", "clear repo should not emit findings");
    assert.equal(clearResult.status, 0, "clear repo should exit 0");

    const scratchRepo = path.join(tempRoot, "scratch-repo");
    writeFile(path.join(scratchRepo, "src", "router.js"), "module.exports = {};\n");
    writeFile(path.join(scratchRepo, "scratch", "architecture-notes.md"), "# Notes\n");
    writeFile(path.join(scratchRepo, "generated", "research-output.txt"), "generated\n");
    writeFile(path.join(scratchRepo, "notes.md"), "workspace note\n");

    const scratchResult = runScanner(["--repo-root", scratchRepo]);
    const scratchOutput = outputOf(scratchResult);
    assert.equal(scratchResult.status, 1, "scratch artifacts should exit 1");
    assert.match(scratchOutput, /scratch\/architecture-notes\.md/, "scratch output should name notes file");
    assert.match(scratchOutput, /generated\/research-output\.txt/, "scratch output should name generated file");
    assert.match(scratchOutput, /notes\.md/, "scratch output should name top-level notes file");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  const missingRepoResult = runScanner([]);
  assert.equal(missingRepoResult.status, 2, "missing repo root should exit 2");
  assert.match(outputOf(missingRepoResult), /repo root is required/, "missing repo output should name config error");

  console.log("research mode no-write scanner check passed");
}

main();
