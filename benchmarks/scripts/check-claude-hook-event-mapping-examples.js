const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-event-mapping-examples.md");
const validEventPath = path.join(root, "hooks", "claude", "examples", "hook-event.post-edit.valid.json");
const expectedRunnerInputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "hook-event.post-edit.expected-runner-input.json"
);
const invalidTranscriptEventPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "hook-event.invalid-transcript.json"
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

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/claude-hook-event-input-contract.md",
  "docs/next-session-prompt.md",
  "hooks/claude/README.md",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function findRejectedField(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findRejectedField(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (rejectedEventFields.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findRejectedField(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function validateHookEvent(event) {
  const rejected = findRejectedField(event);
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
  for (const filePath of [docPath, validEventPath, expectedRunnerInputPath, invalidTranscriptEventPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  for (const phrase of [
    "# Claude Hook Event Mapping Examples",
    "docs/claude-hook-event-input-contract.md",
    "hooks/claude/examples/hook-event.post-edit.valid.json",
    "hooks/claude/examples/hook-event.post-edit.expected-runner-input.json",
    "hooks/claude/examples/hook-event.invalid-transcript.json",
    "fixture-like examples",
    "configuration error",
    "No raw private transcripts",
    "No message arrays",
    "Do not install Claude hooks",
    "Do not widen the event mapper beyond these examples",
  ]) {
    assert.ok(doc.includes(phrase), `Claude hook event mapping examples doc missing phrase: ${phrase}`);
  }

  const validEvent = readJson(validEventPath);
  const validResult = validateHookEvent(validEvent);
  assert.ok(validResult.ok, `valid hook event should pass: ${validResult.reason}`);

  const expectedRunnerInput = readJson(expectedRunnerInputPath);
  assert.deepEqual(mapEventToRunnerInput(validEvent), expectedRunnerInput, "valid hook event mapping mismatch");
  assert.equal(expectedRunnerInput.hookId, "post_edit_scope_check", "expected runner input should use post_edit_scope_check");
  assert.equal(expectedRunnerInput.repoRoot, ".", "expected runner input should use explicit repoRoot");
  assert.ok(expectedRunnerInput.inputs.changedFiles, "expected runner input should include changedFiles");
  assert.ok(expectedRunnerInput.inputs.staleTerms, "expected runner input should include staleTerms");

  const invalidTranscriptEvent = readJson(invalidTranscriptEventPath);
  const invalidResult = validateHookEvent(invalidTranscriptEvent);
  assert.equal(invalidResult.ok, false, "invalid transcript hook event should fail");
  assert.ok(
    invalidResult.reason.includes("rawPrivateTranscript"),
    `invalid transcript reason should name rawPrivateTranscript, got ${invalidResult.reason}`
  );

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(file.includes("docs/claude-hook-event-mapping-examples.md"), `${relativePath} must link docs/claude-hook-event-mapping-examples.md`);
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-event-mapping-examples.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-event-mapping-examples.js`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-event-mapping-examples.js"),
      `${scriptName} must include check-claude-hook-event-mapping-examples.js`
    );
  }

  console.log("Claude hook event mapping examples check passed");
}

main();
