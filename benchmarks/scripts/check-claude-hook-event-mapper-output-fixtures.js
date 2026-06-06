const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-event-mapper-output-fixtures.md");
const validEventPath = path.join(root, "hooks", "claude", "examples", "hook-event.post-edit.valid.json");
const expectedRunnerInputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "hook-event.post-edit.expected-runner-input.json"
);
const validOutputPath = path.join(root, "hooks", "claude", "examples", "map-event.valid-output.json");
const invalidTranscriptEventPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "hook-event.invalid-transcript.json"
);
const invalidTranscriptOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "map-event.invalid-transcript-output.json"
);
const invalidMissingTaskEventPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "hook-event.invalid-missing-task.json"
);
const invalidMissingTaskOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "map-event.invalid-missing-task-output.json"
);
const invalidUnknownFieldEventPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "hook-event.invalid-unknown-field.json"
);
const invalidUnknownFieldOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "map-event.invalid-unknown-field-output.json"
);
const invalidJsonEventPath = path.join(root, "hooks", "claude", "examples", "hook-event.invalid-json.json");
const invalidJsonOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "map-event.invalid-json-output.json"
);
const packagePath = path.join(root, "package.json");

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

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/claude-hook-event-mapper-contract.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "hooks/claude/README.md",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function findForbiddenKey(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findForbiddenKey(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (forbiddenOutputKeys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findForbiddenKey(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function main() {
  for (const filePath of [
    docPath,
    validEventPath,
    expectedRunnerInputPath,
    validOutputPath,
    invalidTranscriptEventPath,
    invalidTranscriptOutputPath,
    invalidMissingTaskEventPath,
    invalidMissingTaskOutputPath,
    invalidUnknownFieldEventPath,
    invalidUnknownFieldOutputPath,
    invalidJsonEventPath,
    invalidJsonOutputPath,
  ]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  for (const phrase of [
    "# Claude Hook Event Mapper Output Fixtures",
    "docs/claude-hook-event-mapper-contract.md",
    "abk-runner map-event --input <hook-event.json>",
    "hooks/claude/examples/hook-event.post-edit.valid.json",
    "hooks/claude/examples/map-event.valid-output.json",
    "hooks/claude/examples/hook-event.invalid-transcript.json",
    "hooks/claude/examples/map-event.invalid-transcript-output.json",
    "hooks/claude/examples/hook-event.invalid-missing-task.json",
    "hooks/claude/examples/map-event.invalid-missing-task-output.json",
    "hooks/claude/examples/hook-event.invalid-unknown-field.json",
    "hooks/claude/examples/map-event.invalid-unknown-field-output.json",
    "hooks/claude/examples/hook-event.invalid-json.json",
    "hooks/claude/examples/map-event.invalid-json-output.json",
    "Exit 0",
    "Exit 2",
    "configuration error",
    "No raw private transcripts",
    "No message arrays",
    "No file writes",
    "Do not install Claude hooks",
    "Do not execute scanners",
    "Do not widen the mapper beyond these fixtures",
  ]) {
    assert.ok(doc.includes(phrase), `Claude hook event mapper output fixtures doc missing phrase: ${phrase}`);
  }

  const validEvent = readJson(validEventPath);
  assert.equal(validEvent.hookId, "post_edit_scope_check", "valid event should cover post_edit_scope_check");

  const expectedRunnerInput = readJson(expectedRunnerInputPath);
  const validOutput = readJson(validOutputPath);
  assert.deepEqual(validOutput, expectedRunnerInput, "valid map-event output must match expected runner input exactly");
  assert.equal(findForbiddenKey(validOutput), null, "valid map-event output contains forbidden field");

  const invalidTranscriptEvent = readJson(invalidTranscriptEventPath);
  assert.ok(
    Object.hasOwn(invalidTranscriptEvent, "rawPrivateTranscript"),
    "invalid transcript event must include rawPrivateTranscript"
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
  assert.deepEqual(invalidTranscriptOutput.inputsUsed, [], "invalid output must not report private inputs as used");
  assert.deepEqual(invalidTranscriptOutput.findings, [], "invalid output must not emit scanner findings");
  assert.equal(findForbiddenKey(invalidTranscriptOutput), null, "invalid map-event output contains forbidden field");

  const invalidMissingTaskEvent = readJson(invalidMissingTaskEventPath);
  assert.ok(
    !Object.hasOwn(invalidMissingTaskEvent, "task"),
    "invalid missing task event must omit the task field"
  );

  const invalidMissingTaskOutput = readJson(invalidMissingTaskOutputPath);
  assert.equal(invalidMissingTaskOutput.hookId, "post_edit_scope_check", "missing task output hookId mismatch");
  assert.equal(invalidMissingTaskOutput.status, "error", "missing task output status mismatch");
  assert.equal(invalidMissingTaskOutput.exitCode, 2, "missing task output exitCode mismatch");
  assert.equal(invalidMissingTaskOutput.blocked, true, "missing task output must block");
  assert.ok(
    invalidMissingTaskOutput.reason.includes("missing required event field task"),
    `missing task output reason mismatch: ${invalidMissingTaskOutput.reason}`
  );
  assert.deepEqual(invalidMissingTaskOutput.inputsUsed, [], "missing task output must not consume inputs");
  assert.deepEqual(invalidMissingTaskOutput.findings, [], "missing task output must not emit scanner findings");
  assert.equal(findForbiddenKey(invalidMissingTaskOutput), null, "missing task output contains forbidden field");

  const invalidUnknownFieldEvent = readJson(invalidUnknownFieldEventPath);
  assert.ok(
    Object.hasOwn(invalidUnknownFieldEvent, "workspaceNotes"),
    "invalid unknown field event must include workspaceNotes"
  );

  const invalidUnknownFieldOutput = readJson(invalidUnknownFieldOutputPath);
  assert.equal(invalidUnknownFieldOutput.hookId, "post_edit_scope_check", "unknown field output hookId mismatch");
  assert.equal(invalidUnknownFieldOutput.status, "error", "unknown field output status mismatch");
  assert.equal(invalidUnknownFieldOutput.exitCode, 2, "unknown field output exitCode mismatch");
  assert.equal(invalidUnknownFieldOutput.blocked, true, "unknown field output must block");
  assert.ok(
    invalidUnknownFieldOutput.reason.includes("unknown event field workspaceNotes"),
    `unknown field output reason mismatch: ${invalidUnknownFieldOutput.reason}`
  );
  assert.deepEqual(invalidUnknownFieldOutput.inputsUsed, [], "unknown field output must not consume inputs");
  assert.deepEqual(invalidUnknownFieldOutput.findings, [], "unknown field output must not emit scanner findings");
  assert.equal(findForbiddenKey(invalidUnknownFieldOutput), null, "unknown field output contains forbidden field");

  assert.throws(
    () => readJson(invalidJsonEventPath),
    /Expected|Unexpected|JSON/,
    "invalid JSON event must be malformed"
  );

  const invalidJsonOutput = readJson(invalidJsonOutputPath);
  assert.equal(invalidJsonOutput.hookId, "unknown", "invalid JSON output hookId mismatch");
  assert.equal(invalidJsonOutput.status, "error", "invalid JSON output status mismatch");
  assert.equal(invalidJsonOutput.exitCode, 2, "invalid JSON output exitCode mismatch");
  assert.equal(invalidJsonOutput.blocked, true, "invalid JSON output must block");
  assert.equal(invalidJsonOutput.reason, "hook event JSON could not be parsed", "invalid JSON output reason mismatch");
  assert.deepEqual(invalidJsonOutput.inputsUsed, [], "invalid JSON output must not consume inputs");
  assert.deepEqual(invalidJsonOutput.findings, [], "invalid JSON output must not emit scanner findings");
  assert.equal(findForbiddenKey(invalidJsonOutput), null, "invalid JSON output contains forbidden field");

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-event-mapper-output-fixtures.md"),
      `${relativePath} must link docs/claude-hook-event-mapper-output-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-event-mapper-output-fixtures.js`
    );
  }

  console.log("Claude hook event mapper output fixtures check passed");
}

main();
