const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-native-metadata-carrier-fixtures.md");
const nativePayloadPath = path.join(root, "hooks", "claude", "examples", "native-payload.post-tool-use.write.json");
const carrierPath = path.join(root, "hooks", "claude", "examples", "native-metadata-carrier.post-edit.valid.json");
const expectedEventPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-payload-plus-carrier.expected-hook-event.json"
);
const invalidCarrierPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-metadata-carrier.invalid-transcript-derived.json"
);
const invalidOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-metadata-carrier.invalid-transcript-derived-output.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Native Metadata Carrier Fixtures",
  "docs/claude-hook-native-payload-mapping-fixtures.md",
  "docs/claude-hook-event-input-contract.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "https://code.claude.com/docs/en/hooks",
  "explicit metadata carrier",
  "native payload plus carrier",
  "carrier supplies hookId, repoRoot, and task",
  "carrier must not derive task metadata from transcript_path",
  "`transcript_path` must not be read",
  "`session_id` must not be passed through",
  "`tool_input.file_path` may become changedFiles",
  "No raw private transcripts",
  "No hidden chat history",
  "No prompt text",
  "No message arrays",
  "No inferred metadata",
  "Do not install Claude hooks",
  "Do not publish live settings fragments",
  "hooks/claude/examples/native-metadata-carrier.post-edit.valid.json",
  "hooks/claude/examples/native-payload-plus-carrier.expected-hook-event.json",
  "hooks/claude/examples/native-metadata-carrier.invalid-transcript-derived.json",
  "hooks/claude/examples/native-metadata-carrier.invalid-transcript-derived-output.json",
  "node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const rejectedKeys = [
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
  "transcript_path",
  "session_id",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/installer.js",
  "hooks/claude/install.js",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-native-payload-mapping-fixtures.md",
  "docs/claude-hook-event-input-contract.md",
  "hooks/claude/README.md",
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

function main() {
  for (const filePath of [docPath, nativePayloadPath, carrierPath, expectedEventPath, invalidCarrierPath, invalidOutputPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  const nativePayload = readJson(nativePayloadPath);
  const carrier = readJson(carrierPath);
  const expectedEvent = readJson(expectedEventPath);
  const invalidCarrier = readJson(invalidCarrierPath);
  const invalidOutput = readJson(invalidOutputPath);
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook native metadata carrier fixtures doc missing phrase: ${phrase}`);
  }

  assert.equal(nativePayload.hook_event_name, "PostToolUse", "native payload hook event mismatch");
  assert.equal(nativePayload.tool_input.file_path, "src/mindmap/new-surface.ts", "native payload file path mismatch");
  assert.ok(Object.hasOwn(nativePayload, "transcript_path"), "native payload must include transcript_path");

  assert.equal(carrier.hookId, "post_edit_scope_check", "carrier hookId mismatch");
  assert.equal(carrier.repoRoot, ".", "carrier repoRoot mismatch");
  assert.equal(carrier.task.type, "replacement", "carrier task type mismatch");
  assert.equal(findKey(carrier, rejectedKeys), null, "valid carrier contains rejected key");

  assert.equal(expectedEvent.hookId, "post_edit_scope_check", "expected hook event hookId mismatch");
  assert.equal(expectedEvent.repoRoot, ".", "expected hook event repoRoot mismatch");
  assert.equal(expectedEvent.task.type, "replacement", "expected hook event task type mismatch");
  assert.deepEqual(expectedEvent.changedFiles, ["src/mindmap/new-surface.ts"], "expected hook event changedFiles mismatch");
  assert.deepEqual(expectedEvent.namedTools, ["opendataloader-pdf", "latex"], "expected hook event namedTools mismatch");
  assert.equal(findKey(expectedEvent, rejectedKeys), null, "expected hook event contains rejected native/private key");

  assert.ok(invalidCarrier.taskSource.includes("transcript_path"), "invalid carrier must request transcript-derived task");
  assert.equal(invalidOutput.status, "error", "invalid carrier output status mismatch");
  assert.equal(invalidOutput.exitCode, 2, "invalid carrier output exitCode mismatch");
  assert.equal(invalidOutput.blocked, true, "invalid carrier output must block");
  assert.equal(invalidOutput.reason, "metadata carrier must not derive task metadata from transcript_path");
  assert.deepEqual(invalidOutput.inputsUsed, [], "invalid carrier output must not consume transcript input");
  assert.equal(findKey(invalidOutput, rejectedKeys), null, "invalid carrier output contains rejected key");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-native-metadata-carrier-fixtures.md"),
      `${relativePath} must link docs/claude-hook-native-metadata-carrier-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-native-metadata-carrier-fixtures.js`
    );
  }

  console.log("Claude hook native metadata carrier fixtures check passed");
}

main();
