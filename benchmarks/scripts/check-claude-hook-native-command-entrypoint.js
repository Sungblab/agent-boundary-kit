const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const binPath = path.join(root, "bin", "abk-claude-hook.js");
const adapterPath = path.join(root, "lib", "abk-claude-hook-adapter.js");
const docPath = path.join(root, "docs", "claude-hook-command-adapter-entrypoint.md");
const nativeContractDocPath = path.join(root, "docs", "claude-hook-native-command-input-contract.md");
const validEnvelopePath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-command-envelope.post-tool-use.valid.json"
);
const missingCarrierPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-command-envelope.invalid-missing-carrier.json"
);
const validOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "adapter-entrypoint.native-envelope.valid-plan-output.json"
);
const missingCarrierOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "adapter-entrypoint.native-envelope.invalid-missing-carrier-output.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "native-payload-with-carrier",
  "native command input contract",
  "lib/abk-claude-native-payload-adapter.js",
  "hooks/claude/examples/adapter-entrypoint.native-envelope.valid-plan-output.json",
  "hooks/claude/examples/adapter-entrypoint.native-envelope.invalid-missing-carrier-output.json",
  "node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-native-command-input-contract.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function tempAdapterDirs() {
  return fs
    .readdirSync(os.tmpdir(), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("abk-claude-hook-"))
    .map((entry) => entry.name)
    .sort();
}

function runAdapter(inputPath) {
  const input = fs.readFileSync(inputPath, "utf8");
  return spawnSync(process.execPath, [binPath], {
    cwd: root,
    encoding: "utf8",
    input,
  });
}

function assertNoTempLeak(before, after, label) {
  const leaked = after.filter((entry) => !before.includes(entry));
  assert.deepEqual(leaked, [], `${label}: adapter left temp directories: ${leaked.join(", ")}`);
}

function assertNoPrivateEcho(output, label) {
  const serialized = JSON.stringify(output);
  for (const forbidden of [
    "native-session-fixture",
    "<claude-transcript-jsonl>",
    "transcript_path",
    "session_id",
    "tool_response",
    "content",
  ]) {
    assert.ok(!serialized.includes(forbidden), `${label}: output echoed private/native field ${forbidden}`);
  }
}

function main() {
  for (const filePath of [
    binPath,
    adapterPath,
    docPath,
    nativeContractDocPath,
    validEnvelopePath,
    missingCarrierPath,
    validOutputPath,
    missingCarrierOutputPath,
  ]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const entrypointDoc = fs.readFileSync(docPath, "utf8");
  const nativeContractDoc = fs.readFileSync(nativeContractDocPath, "utf8");
  const packageJson = readJson(packagePath);
  const adapter = require(adapterPath);

  for (const phrase of requiredDocPhrases) {
    assert.ok(
      entrypointDoc.includes(phrase) || nativeContractDoc.includes(phrase),
      `native command entrypoint docs missing phrase: ${phrase}`
    );
  }

  assert.equal(typeof adapter.runAdapterFromStdinText, "function", "adapter must export runAdapterFromStdinText");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-native-command-entrypoint.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js"),
      `${scriptName} must include check-claude-hook-native-command-entrypoint.js`
    );
  }

  const validBefore = tempAdapterDirs();
  const validResult = runAdapter(validEnvelopePath);
  const validAfter = tempAdapterDirs();
  assertNoTempLeak(validBefore, validAfter, "valid native envelope");
  assert.equal(validResult.status, 0, `valid native envelope: exit code mismatch\nstderr=${validResult.stderr}`);
  assert.equal(validResult.stderr, "", "valid native envelope: stderr should be empty");
  const validOutput = JSON.parse(validResult.stdout);
  assert.deepEqual(validOutput, readJson(validOutputPath), "valid native envelope: output mismatch");
  assertNoPrivateEcho(validOutput, "valid native envelope");

  const missingBefore = tempAdapterDirs();
  const missingResult = runAdapter(missingCarrierPath);
  const missingAfter = tempAdapterDirs();
  assertNoTempLeak(missingBefore, missingAfter, "missing carrier native envelope");
  assert.equal(missingResult.status, 2, `missing carrier native envelope: exit code mismatch\nstderr=${missingResult.stderr}`);
  assert.equal(missingResult.stderr, "", "missing carrier native envelope: stderr should be empty");
  const missingOutput = JSON.parse(missingResult.stdout);
  assert.deepEqual(missingOutput, readJson(missingCarrierOutputPath), "missing carrier native envelope: output mismatch");
  assertNoPrivateEcho(missingOutput, "missing carrier native envelope");

  console.log("Claude hook native command entrypoint check passed");
}

main();
