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
    "Exit 0",
    "Exit 2",
    "configuration error",
    "No raw private transcripts",
    "No message arrays",
    "No file writes",
    "Do not install Claude hooks",
    "Do not execute scanners",
    "Do not implement the mapper until these fixtures pass",
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
