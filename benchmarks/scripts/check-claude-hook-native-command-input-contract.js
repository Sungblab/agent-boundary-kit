const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-native-command-input-contract.md");
const validEnvelopePath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-command-envelope.post-tool-use.valid.json"
);
const expectedEventPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-command-envelope.expected-hook-event.json"
);
const missingCarrierPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-command-envelope.invalid-missing-carrier.json"
);
const missingCarrierOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-command-envelope.invalid-missing-carrier-output.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Native Command Input Contract",
  "command-entrypoint input contract",
  "not an installed hook",
  "not an installer",
  "not live settings guidance",
  "abk-claude-hook",
  "native-payload-with-carrier",
  "nativePayload",
  "metadataCarrier",
  "lib/abk-claude-native-payload-adapter.js",
  "docs/claude-hook-native-adapter.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "hooks/claude/examples/native-command-envelope.post-tool-use.valid.json",
  "hooks/claude/examples/native-command-envelope.expected-hook-event.json",
  "hooks/claude/examples/native-command-envelope.invalid-missing-carrier.json",
  "hooks/claude/examples/native-command-envelope.invalid-missing-carrier-output.json",
  "must be a single JSON stdin envelope",
  "must not accept carrier file paths",
  "must not read `transcript_path`",
  "must not pass through `session_id`",
  "must not infer missing metadata",
  "Do not install Claude hooks",
  "Do not publish live settings fragments",
  "node benchmarks/scripts/check-claude-hook-native-command-input-contract.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-native-adapter.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
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
  "carrierPath",
  "metadataCarrierPath",
  "transcript_path",
  "session_id",
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
  for (const filePath of [docPath, validEnvelopePath, expectedEventPath, missingCarrierPath, missingCarrierOutputPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  const validEnvelope = readJson(validEnvelopePath);
  const expectedEvent = readJson(expectedEventPath);
  const missingCarrier = readJson(missingCarrierPath);
  const missingCarrierOutput = readJson(missingCarrierOutputPath);
  const packageJson = readJson(packagePath);

  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook native command input contract doc missing phrase: ${phrase}`);
  }

  assert.equal(validEnvelope.inputMode, "native-payload-with-carrier", "valid envelope inputMode mismatch");
  assert.equal(validEnvelope.nativePayload.hook_event_name, "PostToolUse", "valid envelope native hook mismatch");
  assert.equal(validEnvelope.nativePayload.tool_input.file_path, "src/mindmap/new-surface.ts");
  assert.equal(validEnvelope.metadataCarrier.hookId, "post_edit_scope_check", "valid envelope carrier hookId mismatch");
  assert.equal(validEnvelope.metadataCarrier.repoRoot, ".", "valid envelope carrier repoRoot mismatch");
  assert.equal(validEnvelope.metadataCarrier.task.type, "replacement", "valid envelope carrier task type mismatch");
  assert.equal(findKey(validEnvelope.metadataCarrier, rejectedKeys), null, "valid envelope carrier contains rejected key");

  assert.equal(expectedEvent.hookId, "post_edit_scope_check", "expected event hookId mismatch");
  assert.deepEqual(expectedEvent.changedFiles, ["src/mindmap/new-surface.ts"], "expected event changedFiles mismatch");
  assert.equal(findKey(expectedEvent, rejectedKeys), null, "expected event contains rejected command/native key");

  assert.equal(missingCarrier.inputMode, "native-payload-with-carrier", "missing-carrier fixture inputMode mismatch");
  assert.ok(Object.hasOwn(missingCarrier, "nativePayload"), "missing-carrier fixture must include nativePayload");
  assert.ok(!Object.hasOwn(missingCarrier, "metadataCarrier"), "missing-carrier fixture must omit metadataCarrier");

  assert.equal(missingCarrierOutput.mode, "native-command-input-contract-fixture");
  assert.equal(missingCarrierOutput.status, "error");
  assert.equal(missingCarrierOutput.exitCode, 2);
  assert.equal(missingCarrierOutput.blocked, true);
  assert.equal(missingCarrierOutput.reason, "native command envelope missing metadataCarrier");
  assert.deepEqual(missingCarrierOutput.inputsUsed, [], "missing carrier output must not consume native payload");
  assert.equal(findKey(missingCarrierOutput, rejectedKeys), null, "missing carrier output contains rejected key");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-native-command-input-contract.md"),
      `${relativePath} must link docs/claude-hook-native-command-input-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-native-command-input-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-native-command-input-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-native-command-input-contract.js"),
      `${scriptName} must include check-claude-hook-native-command-input-contract.js`
    );
  }

  console.log("Claude hook native command input contract check passed");
}

main();
