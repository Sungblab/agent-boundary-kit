const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-command-adapter-entrypoint-fixtures.md");
const validStdinPath = path.join(root, "hooks", "claude", "examples", "command-adapter.stdin.post-edit.valid.json");
const invalidTranscriptStdinPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "command-adapter.stdin.invalid-transcript.json"
);
const validOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "adapter-entrypoint.valid-plan-output.json"
);
const invalidTranscriptOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "adapter-entrypoint.invalid-transcript-output.json"
);
const packagePath = path.join(root, "package.json");

const requiredPhrases = [
  "# Claude Hook Command Adapter Entrypoint Fixtures",
  "docs/claude-hook-command-adapter-implementation-contract.md",
  "hooks/claude/examples/command-adapter.stdin.post-edit.valid.json",
  "hooks/claude/examples/adapter-entrypoint.valid-plan-output.json",
  "hooks/claude/examples/command-adapter.stdin.invalid-transcript.json",
  "hooks/claude/examples/adapter-entrypoint.invalid-transcript-output.json",
  "stdin parsing",
  "temporary file cleanup",
  "runner exit-code preservation",
  "private-context rejection",
  "No raw private transcripts",
  "No message arrays",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not execute scanners in this fixture",
  "Do not generate final copy",
  "node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-command-adapter-implementation-contract.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/adapter.js",
  "hooks/claude/adapter.ps1",
  "hooks/claude/adapter.sh",
];

const forbiddenOutputKeys = [
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "prompt",
  "assistantResponse",
  "secret",
  "cookie",
  "token",
  "password",
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function findKey(value, keys, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findKey(value[index], keys, trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (keys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findKey(value[key], keys, trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function scannerNames(output) {
  return output.selectedScanners.map((scanner) => scanner.scanner);
}

function main() {
  for (const filePath of [docPath, validStdinPath, invalidTranscriptStdinPath, validOutputPath, invalidTranscriptOutputPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  for (const phrase of requiredPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook command adapter entrypoint fixtures doc missing phrase: ${phrase}`);
  }

  const validStdin = readJson(validStdinPath);
  assert.equal(validStdin.hookId, "post_edit_scope_check", "valid stdin payload hookId mismatch");
  assert.equal(findKey(validStdin, forbiddenOutputKeys), null, "valid stdin payload contains forbidden key");

  const validOutput = readJson(validOutputPath);
  assert.equal(validOutput.mode, "adapter-entrypoint-fixture", "valid output mode mismatch");
  assert.equal(validOutput.inputSource, "stdin", "valid output must record stdin source");
  assert.equal(validOutput.hookId, "post_edit_scope_check", "valid output hookId mismatch");
  assert.equal(validOutput.status, "planned", "valid output status mismatch");
  assert.equal(validOutput.exitCode, 0, "valid output exitCode mismatch");
  assert.equal(validOutput.scanExecuted, false, "entrypoint fixture must not execute scanners yet");
  assert.deepEqual(
    validOutput.runnerChain.map((step) => step.command),
    ["map-event", "dry-run"],
    "valid output runner chain mismatch"
  );
  assert.deepEqual(
    validOutput.runnerChain.map((step) => step.exitCode),
    [0, 0],
    "valid output must preserve runner exit codes"
  );
  assert.deepEqual(
    scannerNames(validOutput),
    ["legacy-surface-retention-scan", "untrusted-context-canary-scan"],
    "valid output selected scanners mismatch"
  );
  for (const scanner of validOutput.selectedScanners) {
    assert.equal(scanner.willExecute, false, `scanner ${scanner.scanner} must not execute in fixture`);
  }
  assert.equal(validOutput.temporaryFiles.root, "<explicit-temp-dir>", "valid output must use explicit temp dir placeholder");
  assert.deepEqual(
    validOutput.temporaryFiles.created,
    ["hook-event.json", "runner-input.json"],
    "valid output temporary files mismatch"
  );
  assert.equal(validOutput.temporaryFiles.deletedBeforeExit, true, "valid output must record cleanup");
  assert.deepEqual(validOutput.temporaryFiles.repositoryWrites, [], "valid output must not record repository writes");
  assert.equal(findKey(validOutput, forbiddenOutputKeys), null, "valid output contains forbidden key");

  const invalidStdin = readJson(invalidTranscriptStdinPath);
  assert.ok(
    Object.hasOwn(invalidStdin, "rawPrivateTranscript"),
    "invalid stdin payload must include rawPrivateTranscript"
  );

  const invalidOutput = readJson(invalidTranscriptOutputPath);
  assert.equal(invalidOutput.mode, "adapter-entrypoint-fixture", "invalid output mode mismatch");
  assert.equal(invalidOutput.inputSource, "stdin", "invalid output must record stdin source");
  assert.equal(invalidOutput.hookId, "completion_evidence_check", "invalid output hookId mismatch");
  assert.equal(invalidOutput.status, "error", "invalid output status mismatch");
  assert.equal(invalidOutput.exitCode, 2, "invalid output exitCode mismatch");
  assert.equal(invalidOutput.blocked, true, "invalid output must block");
  assert.ok(
    invalidOutput.reason.includes("rawPrivateTranscript"),
    `invalid output reason must name rawPrivateTranscript, got ${invalidOutput.reason}`
  );
  assert.deepEqual(
    invalidOutput.runnerChain.map((step) => step.command),
    ["map-event"],
    "invalid output must stop after map-event"
  );
  assert.deepEqual(
    invalidOutput.runnerChain.map((step) => step.exitCode),
    [2],
    "invalid output must preserve map-event exit code"
  );
  assert.equal(invalidOutput.scanExecuted, false, "invalid output must not execute scanners");
  assert.deepEqual(invalidOutput.inputsUsed, [], "invalid output must not consume private inputs");
  assert.deepEqual(invalidOutput.findings, [], "invalid output must not emit scanner findings");
  assert.equal(invalidOutput.temporaryFiles.deletedBeforeExit, true, "invalid output must record cleanup");
  assert.deepEqual(invalidOutput.temporaryFiles.repositoryWrites, [], "invalid output must not record repository writes");
  assert.equal(findKey(invalidOutput, forbiddenOutputKeys), null, "invalid output contains forbidden key");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-command-adapter-entrypoint-fixtures.md"),
      `${relativePath} must link docs/claude-hook-command-adapter-entrypoint-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-command-adapter-entrypoint-fixtures.js`
    );
  }

  console.log("Claude hook command adapter entrypoint fixtures check passed");
}

main();
