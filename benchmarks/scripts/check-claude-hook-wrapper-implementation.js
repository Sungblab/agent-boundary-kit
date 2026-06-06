const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-wrapper-implementation.md");
const binPath = path.join(root, "bin", "abk-claude-hook-wrapper.js");
const modulePath = path.join(root, "lib", "abk-claude-hook-wrapper.js");
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
  "# Claude Hook Wrapper Implementation",
  "local wrapper implementation",
  "bin/abk-claude-hook-wrapper.js",
  "lib/abk-claude-hook-wrapper.js",
  "abk-claude-hook-wrapper --carrier <user-owned-carrier-json>",
  "reads native hook JSON from stdin",
  "reads exactly one explicit carrier JSON file",
  "emits exactly one native-payload-with-carrier JSON object",
  "does not invoke abk-claude-hook",
  "does not invoke abk-runner",
  "does not execute scanners",
  "does not install hooks",
  "does not create or edit Claude configuration files",
  "docs/claude-hook-wrapper-implementation-fixtures.md",
  "docs/claude-hook-wrapper-implementation-contract.md",
  "hooks/claude/examples/wrapper-implementation.expected-envelope.json",
  "hooks/claude/examples/wrapper-implementation.invalid-transcript-derived-output.json",
  "hooks/claude/examples/wrapper-implementation.invalid-missing-carrier-output.json",
  "node benchmarks/scripts/check-claude-hook-wrapper-implementation.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-wrapper-implementation-contract.md",
  "docs/claude-hook-wrapper-implementation-fixtures.md",
  "docs/claude-hook-wrapper-output-fixtures.md",
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

function runWrapper(args, inputPath) {
  return spawnSync(process.execPath, [binPath].concat(args), {
    cwd: root,
    encoding: "utf8",
    input: read(inputPath),
  });
}

function parseStdout(result, label) {
  assert.equal(result.stderr, "", `${label}: stderr should be empty`);
  return JSON.parse(result.stdout);
}

function assertNoPrivateEcho(output, label) {
  const serialized = JSON.stringify(output);
  for (const forbidden of [
    "claude-session-redacted",
    "/user-owned/claude/transcript.jsonl",
    "rawPrivateTranscript",
    "hiddenChatHistory",
    "conversation",
    "messages",
    "prompt",
    "assistantResponse",
    "tool_response",
    "carrierPath",
    "metadataCarrierPath",
    "finalResponse",
    "prDescription",
    "releaseNotes",
    "productCopy",
    "completionClaim",
  ]) {
    assert.ok(!serialized.includes(forbidden), `${label}: output echoed forbidden value ${forbidden}`);
  }
}

function main() {
  for (const filePath of [
    docPath,
    binPath,
    modulePath,
    validStdinPath,
    validCarrierPath,
    expectedEnvelopePath,
    invalidTranscriptCarrierPath,
    invalidTranscriptOutputPath,
    missingCarrierOutputPath,
  ]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const packageJson = readJson(packagePath);
  const wrapper = require(modulePath);
  const validStdinText = read(validStdinPath);
  const expectedEnvelope = readJson(expectedEnvelopePath);
  const invalidTranscriptOutput = readJson(invalidTranscriptOutputPath);
  const missingCarrierOutput = readJson(missingCarrierOutputPath);

  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook wrapper implementation doc missing phrase: ${phrase}`);
  }

  assert.equal(typeof wrapper.runWrapperFromStdinText, "function", "wrapper must export runWrapperFromStdinText");
  assert.equal(typeof wrapper.projectNativePayload, "function", "wrapper must export projectNativePayload");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden wrapper/install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = read(path.join(root, relativePath));
    assert.ok(
      file.includes("docs/claude-hook-wrapper-implementation.md"),
      `${relativePath} must link docs/claude-hook-wrapper-implementation.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-wrapper-implementation.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-wrapper-implementation.js`
    );
  }

  assert.ok(packageJson.bin["abk-claude-hook-wrapper"], "package bin must expose abk-claude-hook-wrapper");
  assert.equal(packageJson.bin["abk-claude-hook-wrapper"], "bin/abk-claude-hook-wrapper.js");

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-wrapper-implementation.js"),
      `${scriptName} must include check-claude-hook-wrapper-implementation.js`
    );
  }

  const moduleValid = wrapper.runWrapperFromStdinText(validStdinText, { carrierPath: validCarrierPath });
  assert.equal(moduleValid.exitCode, 0, "module valid output exit code mismatch");
  assert.deepEqual(moduleValid.output, expectedEnvelope, "module valid output mismatch");
  assertNoPrivateEcho(moduleValid.output, "module valid output");

  const cliValid = runWrapper(["--carrier", validCarrierPath], validStdinPath);
  assert.equal(cliValid.status, 0, `cli valid output exit code mismatch\nstderr=${cliValid.stderr}`);
  const cliValidOutput = parseStdout(cliValid, "cli valid output");
  assert.deepEqual(cliValidOutput, expectedEnvelope, "cli valid output mismatch");
  assertNoPrivateEcho(cliValidOutput, "cli valid output");

  const cliInvalidTranscript = runWrapper(["--carrier", invalidTranscriptCarrierPath], validStdinPath);
  assert.equal(cliInvalidTranscript.status, 2, "cli invalid transcript exit code mismatch");
  const cliInvalidTranscriptOutput = parseStdout(cliInvalidTranscript, "cli invalid transcript output");
  assert.deepEqual(cliInvalidTranscriptOutput, invalidTranscriptOutput, "cli invalid transcript output mismatch");
  assertNoPrivateEcho(cliInvalidTranscriptOutput, "cli invalid transcript output");

  const cliMissingCarrier = runWrapper([], validStdinPath);
  assert.equal(cliMissingCarrier.status, 2, "cli missing carrier exit code mismatch");
  const cliMissingCarrierOutput = parseStdout(cliMissingCarrier, "cli missing carrier output");
  assert.deepEqual(cliMissingCarrierOutput, missingCarrierOutput, "cli missing carrier output mismatch");
  assertNoPrivateEcho(cliMissingCarrierOutput, "cli missing carrier output");

  console.log("Claude hook wrapper implementation check passed");
}

main();
