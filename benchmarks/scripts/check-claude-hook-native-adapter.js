const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-native-adapter.md");
const adapterPath = path.join(root, "lib", "abk-claude-native-payload-adapter.js");
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
  "# Claude Hook Native Adapter",
  "bounded native payload adapter",
  "lib/abk-claude-native-payload-adapter.js",
  "mapNativePayloadWithCarrier",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "hooks/claude/examples/native-payload.post-tool-use.write.json",
  "hooks/claude/examples/native-metadata-carrier.post-edit.valid.json",
  "hooks/claude/examples/native-payload-plus-carrier.expected-hook-event.json",
  "hooks/claude/examples/native-metadata-carrier.invalid-transcript-derived-output.json",
  "read JSON values already supplied to the adapter",
  "must not read `transcript_path`",
  "must not pass through `session_id`",
  "must not infer task metadata",
  "must not install Claude hooks",
  "must not create or edit Claude configuration files",
  "node benchmarks/scripts/check-claude-hook-native-adapter.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/native-adapter.ps1",
  "hooks/claude/native-adapter.sh",
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

function assertNoRejectedKeys(value, label) {
  const rejected = findKey(value, rejectedKeys);
  assert.equal(rejected, null, `${label} contains rejected key ${rejected}`);
}

function main() {
  for (const filePath of [
    docPath,
    adapterPath,
    nativePayloadPath,
    carrierPath,
    expectedEventPath,
    invalidCarrierPath,
    invalidOutputPath,
  ]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  const nativePayload = readJson(nativePayloadPath);
  const carrier = readJson(carrierPath);
  const expectedEvent = readJson(expectedEventPath);
  const invalidCarrier = readJson(invalidCarrierPath);
  const invalidOutput = readJson(invalidOutputPath);
  const packageJson = readJson(packagePath);
  const adapterSource = fs.readFileSync(adapterPath, "utf8");
  const adapter = require(adapterPath);

  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook native adapter doc missing phrase: ${phrase}`);
  }

  assert.equal(
    typeof adapter.mapNativePayloadWithCarrier,
    "function",
    "native adapter must export mapNativePayloadWithCarrier"
  );

  assert.ok(!adapterSource.includes("readFileSync"), "native adapter must not read files");
  assert.ok(!adapterSource.includes("fs."), "native adapter must not use filesystem APIs");
  assert.ok(!adapterSource.includes("spawn"), "native adapter must not execute commands");
  assert.ok(!adapterSource.includes(".claude"), "native adapter must not reference Claude config paths");
  assert.ok(!adapterSource.includes("session_id:"), "native adapter must not emit session_id");
  assert.ok(!adapterSource.includes("transcript_path:"), "native adapter must not emit transcript_path");

  const validResult = adapter.mapNativePayloadWithCarrier(nativePayload, carrier);
  assert.equal(validResult.status, "mapped", "valid native payload plus carrier status mismatch");
  assert.equal(validResult.exitCode, 0, "valid native payload plus carrier exit code mismatch");
  assert.deepEqual(validResult.hookEvent, expectedEvent, "valid native payload plus carrier hook event mismatch");
  assert.deepEqual(validResult.inputsUsed, ["native.tool_input.file_path", "carrier"], "valid native adapter inputsUsed mismatch");
  assertNoRejectedKeys(validResult.hookEvent, "valid hook event");

  const invalidResult = adapter.mapNativePayloadWithCarrier(nativePayload, invalidCarrier);
  assert.deepEqual(invalidResult, invalidOutput, "invalid transcript-derived carrier output mismatch");
  assertNoRejectedKeys(invalidResult, "invalid carrier output");

  const missingTaskResult = adapter.mapNativePayloadWithCarrier(nativePayload, {
    carrierVersion: "abk-native-metadata-carrier/v1",
    hookId: "post_edit_scope_check",
    repoRoot: ".",
  });
  assert.equal(missingTaskResult.status, "error", "missing task status mismatch");
  assert.equal(missingTaskResult.exitCode, 2, "missing task exit code mismatch");
  assert.equal(missingTaskResult.blocked, true, "missing task must block");
  assert.equal(missingTaskResult.reason, "metadata carrier missing required field task");
  assert.deepEqual(missingTaskResult.inputsUsed, [], "missing task must not consume native payload");

  const missingFileResult = adapter.mapNativePayloadWithCarrier({ ...nativePayload, tool_input: {} }, carrier);
  assert.equal(missingFileResult.status, "error", "missing native file path status mismatch");
  assert.equal(missingFileResult.exitCode, 2, "missing native file path exit code mismatch");
  assert.equal(missingFileResult.reason, "native payload missing tool_input.file_path");
  assert.deepEqual(missingFileResult.inputsUsed, [], "missing native file path must not consume carrier metadata");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-native-adapter.md"),
      `${relativePath} must link docs/claude-hook-native-adapter.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-native-adapter.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-native-adapter.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-native-adapter.js"),
      `${scriptName} must include check-claude-hook-native-adapter.js`
    );
  }

  console.log("Claude hook native adapter check passed");
}

main();
