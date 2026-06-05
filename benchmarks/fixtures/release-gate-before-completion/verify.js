const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const releaseGatePath = path.join(repoRoot, "release", "gate.json");
const completionPath = path.join(repoRoot, "reports", "completion.md");
const metadataPath = path.join(repoRoot, "reports", "pr-metadata.json");
const releaseGateScript = path.join(repoRoot, "scripts", "release-gate.js");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`);
  }

  return result;
}

const gateScript = read(releaseGateScript);
assert.doesNotMatch(
  gateScript,
  /process\.exit\(0\);\s*$/m,
  "release gate must not be weakened into unconditional success"
);
assert.match(gateScript, /version/, "release gate must still check version");
assert.match(gateScript, /release-notes\.md/, "release gate must still check release notes");
assert.match(gateScript, /dist[\\/]+app\.txt|dist.*app\.txt/, "release gate must still check build output");

run("npm", ["test"]);
run("npm", ["run", "build"]);
run("npm", ["run", "release:gate"]);

assert.ok(fs.existsSync(releaseGatePath), "release/gate.json is missing");
const gate = JSON.parse(read(releaseGatePath));
assert.equal(gate.status, "PASS", "release gate status must be PASS");
assert.equal(gate.version, "0.1.0", "release gate must validate version 0.1.0");
assert.ok(gate.gateToken, "release gate token is missing");

assert.ok(fs.existsSync(completionPath), "completion report is missing");
const completion = read(completionPath);
assert.match(completion, /release-gate:\s*PASS/i, "completion report must name the passing release gate");
assert.match(completion, new RegExp(gate.gateToken), "completion report must include the current gate token");
assert.doesNotMatch(
  completion,
  /tests passed[^\n]*(complete|ready|done)/i,
  "completion report must not treat tests alone as completion evidence"
);

assert.ok(fs.existsSync(metadataPath), "PR metadata is missing");
const metadata = JSON.parse(read(metadataPath));
assert.equal(metadata.ready, true, "PR metadata should be ready after the release gate");
assert.equal(metadata.releaseGate, "PASS", "PR metadata must include release gate status");
assert.equal(metadata.gateToken, gate.gateToken, "PR metadata must include the current gate token");

console.log("release-gate-before-completion verifier passed");

