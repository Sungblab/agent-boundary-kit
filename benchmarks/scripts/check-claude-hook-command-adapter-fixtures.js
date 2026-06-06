const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-command-adapter-fixtures.md");
const validStdinPath = path.join(root, "hooks", "claude", "examples", "command-adapter.stdin.post-edit.valid.json");
const expectedRunnerInputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "command-adapter.expected-runner-input.post-edit.json"
);
const invalidTranscriptStdinPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "command-adapter.stdin.invalid-transcript.json"
);
const invalidTranscriptOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "command-adapter.invalid-transcript-output.json"
);
const packagePath = path.join(root, "package.json");

const topLevelEventFields = ["hookId", "repoRoot", "task"];
const allowedInputFields = [
  "changedFiles",
  "diffPath",
  "approvedScope",
  "offLimits",
  "namedTools",
  "staleTerms",
  "externalSources",
  "finalGate",
  "commandLog",
  "completionDraft",
  "metadataFiles",
  "testFiles",
  "productionFiles",
  "behaviorContract",
];
const allowedEventFields = topLevelEventFields.concat(allowedInputFields);
const rejectedEventFields = [
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
];

const forbiddenOutputKeys = rejectedEventFields.concat([
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
]);

const requiredPhrases = [
  "# Claude Hook Command Adapter Fixtures",
  "docs/claude-hook-command-adapter-contract.md",
  "hooks/claude/examples/command-adapter.stdin.post-edit.valid.json",
  "hooks/claude/examples/command-adapter.expected-runner-input.post-edit.json",
  "hooks/claude/examples/command-adapter.stdin.invalid-transcript.json",
  "hooks/claude/examples/command-adapter.invalid-transcript-output.json",
  "stdin payload fixture",
  "red fixture",
  "green fixture",
  "No raw private transcripts",
  "No message arrays",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not execute scanners",
  "Do not generate final copy",
  "node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-contract.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-command-adapter-contract.md",
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
  "bin/abk-claude-hook.js",
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

function validateHookEvent(event) {
  const rejected = findKey(event, rejectedEventFields);
  if (rejected) {
    return { ok: false, reason: `rejected event field ${rejected}` };
  }

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return { ok: false, reason: "event must be an object" };
  }

  for (const key of Object.keys(event)) {
    if (!allowedEventFields.includes(key)) {
      return { ok: false, reason: `unknown event field ${key}` };
    }
  }

  for (const key of topLevelEventFields) {
    if (event[key] === undefined) {
      return { ok: false, reason: `missing required event field ${key}` };
    }
  }

  return { ok: true, reason: "valid" };
}

function mapEventToRunnerInput(event) {
  const inputs = {};
  for (const key of allowedInputFields) {
    if (event[key] !== undefined) {
      inputs[key] = event[key];
    }
  }

  return {
    hookId: event.hookId,
    repoRoot: event.repoRoot,
    task: event.task,
    inputs,
  };
}

function main() {
  for (const filePath of [docPath, validStdinPath, expectedRunnerInputPath, invalidTranscriptStdinPath, invalidTranscriptOutputPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  for (const phrase of requiredPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook command adapter fixtures doc missing phrase: ${phrase}`);
  }

  const validStdinPayload = readJson(validStdinPath);
  const validation = validateHookEvent(validStdinPayload);
  assert.ok(validation.ok, `valid stdin payload should pass: ${validation.reason}`);

  const expectedRunnerInput = readJson(expectedRunnerInputPath);
  assert.deepEqual(
    mapEventToRunnerInput(validStdinPayload),
    expectedRunnerInput,
    "valid stdin payload must map to expected runner input"
  );
  assert.equal(expectedRunnerInput.hookId, "post_edit_scope_check", "expected runner input hookId mismatch");
  assert.equal(findKey(expectedRunnerInput, forbiddenOutputKeys), null, "expected runner input contains forbidden key");

  const invalidTranscriptPayload = readJson(invalidTranscriptStdinPath);
  assert.ok(
    Object.hasOwn(invalidTranscriptPayload, "rawPrivateTranscript"),
    "invalid transcript stdin payload must include rawPrivateTranscript"
  );
  const invalidValidation = validateHookEvent(invalidTranscriptPayload);
  assert.equal(invalidValidation.ok, false, "invalid transcript stdin payload should fail");
  assert.ok(
    invalidValidation.reason.includes("rawPrivateTranscript"),
    `invalid transcript reason should name rawPrivateTranscript, got ${invalidValidation.reason}`
  );

  const invalidTranscriptOutput = readJson(invalidTranscriptOutputPath);
  assert.equal(invalidTranscriptOutput.hookId, "completion_evidence_check", "invalid output hookId mismatch");
  assert.equal(invalidTranscriptOutput.status, "error", "invalid output status mismatch");
  assert.equal(invalidTranscriptOutput.exitCode, 2, "invalid output exitCode mismatch");
  assert.equal(invalidTranscriptOutput.blocked, true, "invalid output must block");
  assert.ok(
    invalidTranscriptOutput.reason.includes("rawPrivateTranscript"),
    `invalid output reason should name rawPrivateTranscript, got ${invalidTranscriptOutput.reason}`
  );
  assert.deepEqual(invalidTranscriptOutput.inputsUsed, [], "invalid output must not consume private inputs");
  assert.deepEqual(invalidTranscriptOutput.findings, [], "invalid output must not emit scanner findings");
  assert.equal(findKey(invalidTranscriptOutput, forbiddenOutputKeys), null, "invalid output contains forbidden key");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook adapter/install path exists before adapter implementation: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-command-adapter-fixtures.md"),
      `${relativePath} must link docs/claude-hook-command-adapter-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js"),
      `${scriptName} must include check-claude-hook-command-adapter-fixtures.js`
    );
  }

  console.log("Claude hook command adapter fixtures check passed");
}

main();
