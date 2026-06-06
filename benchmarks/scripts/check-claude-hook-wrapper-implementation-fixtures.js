const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-wrapper-implementation-fixtures.md");
const validStdinPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.stdin.post-tool-use.valid.json"
);
const validCarrierPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-implementation.carrier.valid.json"
);
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
const wrapperOutputFixturePath = path.join(root, "hooks", "claude", "examples", "wrapper-output.valid-envelope.json");
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Wrapper Implementation Fixtures",
  "fixture-only",
  "not implemented in this gate",
  "not an installed hook",
  "not an installer",
  "not live settings guidance",
  "candidate command is `abk-claude-hook-wrapper`",
  "candidate module is `lib/abk-claude-hook-wrapper.js`",
  "valid stdin fixture",
  "valid carrier fixture",
  "expected envelope fixture",
  "red fixture",
  "missing carrier",
  "native stdin contains session_id and transcript_path",
  "output must not include session_id or transcript_path",
  "native-payload-with-carrier",
  "metadataCarrier",
  "user-owned sidecar JSON",
  "Do not infer task metadata from native stdin",
  "Do not make `abk-claude-hook` accept carrierPath or metadataCarrierPath",
  "docs/claude-hook-wrapper-implementation-contract.md",
  "docs/claude-hook-wrapper-output-fixtures.md",
  "docs/claude-hook-wrapper-input-contract.md",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-native-command-input-contract.md",
  "hooks/claude/examples/wrapper-implementation.stdin.post-tool-use.valid.json",
  "hooks/claude/examples/wrapper-implementation.carrier.valid.json",
  "hooks/claude/examples/wrapper-implementation.expected-envelope.json",
  "hooks/claude/examples/wrapper-implementation.carrier.invalid-transcript-derived.json",
  "hooks/claude/examples/wrapper-implementation.invalid-transcript-derived-output.json",
  "hooks/claude/examples/wrapper-implementation.invalid-missing-carrier-output.json",
  "hooks/claude/examples/wrapper-output.valid-envelope.json",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
  "node benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const forbiddenDocPhrases = [
  "Paste this into",
  "Run this command",
  ".claude/settings",
  ".claude/settings.json",
  ".claude/settings.local.json",
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "Set-Content",
  "Out-File",
  "Add-Content",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  "npm install -g",
  "npx ",
  "autoInstall: true",
  "\"autoInstall\": true",
];

const forbiddenOutputKeys = [
  "transcript_path",
  "session_id",
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "prompt",
  "assistantResponse",
  "tool_response",
  "secret",
  "cookie",
  "token",
  "password",
  "carrierPath",
  "metadataCarrierPath",
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-wrapper-implementation-contract.md",
  "docs/claude-hook-wrapper-output-fixtures.md",
  "docs/claude-hook-wrapper-input-contract.md",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "bin/abk-claude-hook-wrapper.js",
  "lib/abk-claude-hook-wrapper.js",
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

function readRelative(relativePath) {
  return read(path.join(root, relativePath));
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

function assertIncludesAll(markdown, phrases, label) {
  for (const phrase of phrases) {
    assert.ok(markdown.includes(phrase), `${label} missing phrase: ${phrase}`);
  }
}

function assertNoStrings(value, forbidden, label) {
  const serialized = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  for (const phrase of forbidden) {
    assert.ok(!serialized.includes(phrase), `${label} includes forbidden phrase: ${phrase}`);
  }
}

function main() {
  const requiredFiles = [
    docPath,
    validStdinPath,
    validCarrierPath,
    expectedEnvelopePath,
    invalidTranscriptCarrierPath,
    invalidTranscriptOutputPath,
    missingCarrierOutputPath,
    wrapperOutputFixturePath,
  ];

  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validStdin = readJson(validStdinPath);
  const validCarrier = readJson(validCarrierPath);
  const expectedEnvelope = readJson(expectedEnvelopePath);
  const invalidTranscriptCarrier = readJson(invalidTranscriptCarrierPath);
  const invalidTranscriptOutput = readJson(invalidTranscriptOutputPath);
  const missingCarrierOutput = readJson(missingCarrierOutputPath);
  const wrapperOutputFixture = readJson(wrapperOutputFixturePath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook wrapper implementation fixtures doc");
  assertNoStrings(doc, forbiddenDocPhrases, "wrapper implementation fixtures doc");

  assert.equal(validStdin.hook_event_name, "PostToolUse", "valid stdin hook event mismatch");
  assert.equal(validStdin.tool_name, "Write", "valid stdin tool name mismatch");
  assert.equal(validStdin.tool_input.file_path, "src/mindmap/new-surface.ts", "valid stdin file path mismatch");
  assert.ok(Object.hasOwn(validStdin, "session_id"), "valid stdin must include session_id common field");
  assert.ok(Object.hasOwn(validStdin, "transcript_path"), "valid stdin must include transcript_path common field");

  assert.equal(validCarrier.carrierVersion, "abk-native-metadata-carrier/v1", "valid carrier version mismatch");
  assert.equal(validCarrier.hookId, "post_edit_scope_check", "valid carrier hookId mismatch");
  assert.equal(validCarrier.repoRoot, ".", "valid carrier repoRoot mismatch");
  assert.equal(validCarrier.task.declaredBy, "user-owned-carrier-source", "valid carrier task source mismatch");
  assert.equal(findKey(validCarrier, forbiddenOutputKeys), null, "valid carrier contains forbidden key");

  assert.deepEqual(expectedEnvelope, wrapperOutputFixture.outputEnvelope, "expected envelope must match wrapper output fixture");
  assert.equal(expectedEnvelope.inputMode, "native-payload-with-carrier", "expected envelope inputMode mismatch");
  assert.deepEqual(expectedEnvelope.metadataCarrier, validCarrier, "expected envelope must use valid carrier exactly");
  assert.equal(findKey(expectedEnvelope, forbiddenOutputKeys), null, "expected envelope contains forbidden key");

  assert.equal(
    invalidTranscriptCarrier.taskSource,
    "transcript_path",
    "invalid transcript carrier must derive from transcript_path"
  );
  assert.ok(
    Object.hasOwn(invalidTranscriptCarrier, "transcript_path"),
    "invalid transcript carrier must include transcript_path"
  );
  assert.equal(invalidTranscriptOutput.mode, "wrapper-implementation-fixture", "invalid transcript output mode mismatch");
  assert.equal(invalidTranscriptOutput.status, "error", "invalid transcript output status mismatch");
  assert.equal(invalidTranscriptOutput.exitCode, 2, "invalid transcript output exitCode mismatch");
  assert.equal(invalidTranscriptOutput.blocked, true, "invalid transcript output must block");
  assert.equal(
    invalidTranscriptOutput.reason,
    "wrapper carrier source must not derive metadata from transcript_path",
    "invalid transcript output reason mismatch"
  );
  assert.deepEqual(invalidTranscriptOutput.inputsUsed, [], "invalid transcript output must not consume inputs");
  assert.equal(findKey(invalidTranscriptOutput, forbiddenOutputKeys), null, "invalid transcript output contains forbidden key");

  assert.equal(missingCarrierOutput.mode, "wrapper-implementation-fixture", "missing carrier output mode mismatch");
  assert.equal(missingCarrierOutput.status, "error", "missing carrier output status mismatch");
  assert.equal(missingCarrierOutput.exitCode, 2, "missing carrier output exitCode mismatch");
  assert.equal(missingCarrierOutput.blocked, true, "missing carrier output must block");
  assert.equal(missingCarrierOutput.reason, "wrapper carrier source missing", "missing carrier output reason mismatch");
  assert.deepEqual(missingCarrierOutput.inputsUsed, ["native-stdin"], "missing carrier output must only consume native stdin");
  assert.equal(findKey(missingCarrierOutput, forbiddenOutputKeys), null, "missing carrier output contains forbidden key");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden wrapper/install path exists before implementation: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-wrapper-implementation-fixtures.md"),
      `${relativePath} must link docs/claude-hook-wrapper-implementation-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js"),
      `${scriptName} must include check-claude-hook-wrapper-implementation-fixtures.js`
    );
  }

  console.log("Claude hook wrapper implementation fixtures check passed");
}

main();
