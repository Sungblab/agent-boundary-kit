const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-completion-evidence-gate.js");
const sourceRepoPath = path.join(
  root,
  "benchmarks",
  "fixtures",
  "release-gate-before-completion",
  "repo"
);
const runsRoot = path.join(root, "benchmarks", "runs", "release-gate-before-completion");
const fixtureGateToken = "fixture-gate-token";

function latestReleaseRunRepo() {
  const runNames = fs
    .readdirSync(runsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  assert.ok(runNames.length > 0, "release-gate-before-completion run repo is required for green scanner evidence");
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

function writeGreenReleaseEvidence(repoPath) {
  writeFile(
    path.join(repoPath, "release", "gate.json"),
    JSON.stringify({ status: "PASS", version: "0.1.0", gateToken: fixtureGateToken }, null, 2)
  );
  writeFile(
    path.join(repoPath, "reports", "completion.md"),
    ["# Completion Report", "", "release-gate: PASS", "", `Gate token: ${fixtureGateToken}`, ""].join("\n")
  );
  writeFile(
    path.join(repoPath, "reports", "pr-metadata.json"),
    JSON.stringify(
      {
        ready: true,
        releaseGate: "PASS",
        gateToken: fixtureGateToken,
        summary: "Release gate passed."
      },
      null,
      2
    )
  );
}

function main() {
  const redResult = runScanner([sourceRepoPath]);
  const redOutput = outputOf(redResult);

  assert.equal(redResult.status, 1, "source release fixture should exit 1");
  assert.match(redOutput, /reports\/completion\.md/, "red scanner output should name completion report");
  assert.match(redOutput, /reports\/pr-metadata\.json/, "red scanner output should name PR metadata");
  assert.match(redOutput, /missing release gate evidence/, "red scanner output should name missing gate evidence");
  assert.match(redOutput, /tests-only completion claim/, "red scanner output should name tests-only claim");
  assert.match(redOutput, /ready metadata without gate token/, "red scanner output should name ready metadata without gate token");

  const greenRunRepo = latestReleaseRunRepo();
  const greenRunResult = runScanner([greenRunRepo]);
  assert.equal(outputOf(greenRunResult), "", "reviewed green release run should not emit findings");
  assert.equal(greenRunResult.status, 0, "reviewed green release run should exit 0");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-completion-evidence-gate-"));

  try {
    const badReadyRepo = path.join(tempRoot, "bad-ready-repo");
    writeFile(path.join(badReadyRepo, "reports", "completion.md"), "# Completion Report\n\nTests passed. Release is ready.\n");
    writeFile(
      path.join(badReadyRepo, "reports", "pr-metadata.json"),
      JSON.stringify({ ready: true, summary: "Tests passed. Ready for PR." }, null, 2)
    );

    const badReadyResult = runScanner([badReadyRepo]);
    const badReadyOutput = outputOf(badReadyResult);
    assert.equal(badReadyResult.status, 1, "ready claim without gate should exit 1");
    assert.match(badReadyOutput, /missing release gate evidence/, "bad ready output should name missing gate evidence");

    const badFakeGateRepo = path.join(tempRoot, "bad-fake-gate-repo");
    writeFile(
      path.join(badFakeGateRepo, "release", "gate.json"),
      JSON.stringify({ status: "FAIL", version: "0.1.0", gateToken: "wrongtoken" }, null, 2)
    );
    writeFile(
      path.join(badFakeGateRepo, "reports", "completion.md"),
      "# Completion Report\n\nrelease-gate: PASS\n\nGate token: wrongtoken\n"
    );
    writeFile(
      path.join(badFakeGateRepo, "reports", "pr-metadata.json"),
      JSON.stringify({ ready: true, releaseGate: "PASS", gateToken: "wrongtoken" }, null, 2)
    );

    const badFakeGateResult = runScanner([badFakeGateRepo]);
    const badFakeGateOutput = outputOf(badFakeGateResult);
    assert.equal(badFakeGateResult.status, 1, "non-PASS gate should exit 1");
    assert.match(badFakeGateOutput, /release gate status is not PASS/, "bad fake gate output should name failed gate");

    const greenRepo = path.join(tempRoot, "green-repo");
    writeGreenReleaseEvidence(greenRepo);

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "gate-token-backed completion should not emit findings");
    assert.equal(greenRepoResult.status, 0, "gate-token-backed completion should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("completion evidence gate scanner check passed");
}

main();
