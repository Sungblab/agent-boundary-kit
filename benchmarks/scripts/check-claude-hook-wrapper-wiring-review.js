const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-wrapper-wiring-review.md");
const wrapperBinPath = path.join(root, "bin", "abk-claude-hook-wrapper.js");
const hookBinPath = path.join(root, "bin", "abk-claude-hook.js");
const validStdinPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.stdin.post-tool-use.valid.json"
);
const validCarrierPath = path.join(root, "hooks", "claude", "examples", "wrapper-implementation.carrier.valid.json");
const expectedEnvelopePath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.expected-envelope.json"
);
const expectedPlanOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-wiring.valid-plan-output.json"
);
const invalidTranscriptCarrierPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.carrier.invalid-transcript-derived.json"
);
const invalidTranscriptOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.invalid-transcript-derived-output.json"
);
const missingCarrierOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.invalid-missing-carrier-output.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Wrapper Wiring Review",
  "wiring review only",
  "abk-claude-hook-wrapper",
  "abk-claude-hook",
  "native-payload-with-carrier",
  "wrapper output can feed the existing native command entrypoint",
  "hooks/claude/examples/wrapper-wiring.valid-plan-output.json",
  "node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js",
  "does not install hooks",
  "does not create or edit Claude configuration files",
  "does not execute scanners",
  "does not publish live settings guidance",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-wrapper-implementation.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/installer.js",
  "hooks/claude/install.js",
  "hooks/claude/wrapper.js",
  "hooks/claude/wrapper.ps1",
  "hooks/claude/wrapper.sh",
];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
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

function runWrapper(args) {
  return spawnSync(process.execPath, [wrapperBinPath].concat(args), {
    cwd: root,
    encoding: "utf8",
    input: read(validStdinPath),
  });
}

function runHook(input) {
  return spawnSync(process.execPath, [hookBinPath], {
    cwd: root,
    encoding: "utf8",
    input,
  });
}

function parseStdout(result, label) {
  assert.equal(result.stderr, "", `${label}: stderr should be empty`);
  return JSON.parse(result.stdout);
}

function assertNoTempLeak(before, after, label) {
  const leaked = after.filter((entry) => !before.includes(entry));
  assert.deepEqual(leaked, [], `${label}: adapter left temp directories: ${leaked.join(", ")}`);
}

function assertNoPrivateEcho(output, label, options = {}) {
  const serialized = JSON.stringify(output);
  const forbiddenValues = [
    "claude-session-redacted",
    "/user-owned/claude/transcript.jsonl",
    "native-session-fixture",
    "<claude-transcript-jsonl>",
    "session_id",
    "tool_response",
    "content",
    "rawPrivateTranscript",
    "hiddenChatHistory",
    "conversation",
    "messages",
    "prompt",
    "assistantResponse",
    "carrierPath",
    "metadataCarrierPath",
    "finalResponse",
    "prDescription",
    "releaseNotes",
    "productCopy",
    "completionClaim",
  ];

  if (!options.allowTranscriptPathReason) {
    forbiddenValues.push("transcript_path");
  }

  for (const forbidden of forbiddenValues) {
    assert.ok(!serialized.includes(forbidden), `${label}: output echoed forbidden value ${forbidden}`);
  }
}

function assertNoScannerExecution(output) {
  assert.equal(output.scanExecuted, false, "wiring review must not execute scanners");
  for (const scanner of output.selectedScanners || []) {
    assert.equal(scanner.willExecute, false, `wiring review scanner must stay plan-only: ${scanner.scanner}`);
  }
}

function main() {
  for (const filePath of [
    docPath,
    wrapperBinPath,
    hookBinPath,
    validStdinPath,
    validCarrierPath,
    expectedEnvelopePath,
    expectedPlanOutputPath,
    invalidTranscriptCarrierPath,
    invalidTranscriptOutputPath,
    missingCarrierOutputPath,
  ]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const packageJson = readJson(packagePath);
  const expectedEnvelope = readJson(expectedEnvelopePath);
  const expectedPlanOutput = readJson(expectedPlanOutputPath);
  const invalidTranscriptOutput = readJson(invalidTranscriptOutputPath);
  const missingCarrierOutput = readJson(missingCarrierOutputPath);

  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook wrapper wiring review doc missing phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden wrapper/install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = read(path.join(root, relativePath));
    assert.ok(
      file.includes("docs/claude-hook-wrapper-wiring-review.md"),
      `${relativePath} must link docs/claude-hook-wrapper-wiring-review.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js"),
      `${scriptName} must include check-claude-hook-wrapper-wiring-review.js`
    );
  }

  const validWrapper = runWrapper(["--carrier", validCarrierPath]);
  assert.equal(validWrapper.status, 0, "valid wrapper exit code mismatch");
  const validEnvelope = parseStdout(validWrapper, "valid wrapper");
  assert.deepEqual(validEnvelope, expectedEnvelope, "valid wrapper envelope mismatch");
  assertNoPrivateEcho(validEnvelope, "valid wrapper envelope");

  const before = tempAdapterDirs();
  const hookResult = runHook(validWrapper.stdout);
  const after = tempAdapterDirs();
  assertNoTempLeak(before, after, "wrapper-to-entrypoint");
  assert.equal(hookResult.status, 0, `wrapper-to-entrypoint exit code mismatch\nstderr=${hookResult.stderr}`);
  const planOutput = parseStdout(hookResult, "wrapper-to-entrypoint");
  assert.deepEqual(planOutput, expectedPlanOutput, "wrapper-to-entrypoint plan output mismatch");
  assertNoPrivateEcho(planOutput, "wrapper-to-entrypoint plan output");
  assertNoScannerExecution(planOutput);

  const invalidTranscriptWrapper = runWrapper(["--carrier", invalidTranscriptCarrierPath]);
  assert.equal(invalidTranscriptWrapper.status, 2, "invalid transcript wrapper exit code mismatch");
  const invalidTranscriptWrapperOutput = parseStdout(invalidTranscriptWrapper, "invalid transcript wrapper");
  assert.deepEqual(
    invalidTranscriptWrapperOutput,
    invalidTranscriptOutput,
    "invalid transcript wrapper must block before entrypoint handoff"
  );
  assertNoPrivateEcho(invalidTranscriptWrapperOutput, "invalid transcript wrapper", { allowTranscriptPathReason: true });

  const missingCarrierWrapper = runWrapper([]);
  assert.equal(missingCarrierWrapper.status, 2, "missing carrier wrapper exit code mismatch");
  const missingCarrierWrapperOutput = parseStdout(missingCarrierWrapper, "missing carrier wrapper");
  assert.deepEqual(missingCarrierWrapperOutput, missingCarrierOutput, "missing carrier wrapper must block before entrypoint handoff");
  assertNoPrivateEcho(missingCarrierWrapperOutput, "missing carrier wrapper");

  console.log("Claude hook wrapper wiring review check passed");
}

main();
