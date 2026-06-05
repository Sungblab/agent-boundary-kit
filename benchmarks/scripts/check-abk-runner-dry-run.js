const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const runnerPath = path.join(root, "bin", "abk-runner.js");

const cases = [
  {
    name: "planned fan-out",
    input: "hooks/claude/examples/runner-dry-run.post-edit-scope-fanout.json",
    expected: "hooks/claude/examples/runner-dry-run-cli.planned-output.json",
    exitCode: 0,
  },
  {
    name: "missing metadata configuration error",
    input: "hooks/claude/examples/runner-input.invalid-missing-metadata.json",
    expected: "hooks/claude/examples/runner-dry-run-cli.configuration-error-output.json",
    exitCode: 2,
  },
  {
    name: "invalid transcript configuration error",
    input: "hooks/claude/examples/runner-input.invalid-transcript.json",
    expected: "hooks/claude/examples/runner-dry-run-cli.invalid-transcript-output.json",
    exitCode: 2,
  },
  {
    name: "unsupported hook configuration error",
    input: "hooks/claude/examples/runner-input.invalid-unsupported-hook.json",
    expected: "hooks/claude/examples/runner-dry-run-cli.unsupported-hook-output.json",
    exitCode: 2,
  },
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function runDryRun(input) {
  return spawnSync(process.execPath, [runnerPath, "dry-run", "--input", input], {
    cwd: root,
    encoding: "utf8",
  });
}

function main() {
  assert.ok(fs.existsSync(runnerPath), "bin/abk-runner.js is missing");

  for (const testCase of cases) {
    const result = runDryRun(testCase.input);
    assert.equal(result.status, testCase.exitCode, `${testCase.name}: exit code mismatch\nstderr=${result.stderr}`);
    assert.equal(result.stderr, "", `${testCase.name}: stderr should be empty`);
    const actual = JSON.parse(result.stdout);
    const expected = readJson(testCase.expected);
    assert.deepEqual(actual, expected, `${testCase.name}: output mismatch`);

    for (const selected of actual.selectedScanners) {
      assert.equal(selected.willExecute, false, `${testCase.name}: dry run must not execute scanners`);
    }
    assert.ok(!Object.hasOwn(actual, "findings"), `${testCase.name}: dry-run plan must not emit findings`);
    assert.ok(!Object.hasOwn(actual, "finalResponse"), `${testCase.name}: dry-run plan must not emit final responses`);
  }

  console.log(`abk runner dry-run check passed (${cases.length} cases)`);
}

main();
