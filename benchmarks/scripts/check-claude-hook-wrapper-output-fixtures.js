const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-wrapper-output-fixtures.md");
const validOutputPath = path.join(root, "hooks", "claude", "examples", "wrapper-output.valid-envelope.json");
const invalidTranscriptPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-output.invalid-transcript-derived.json"
);
const invalidEntrypointPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-output.invalid-current-entrypoint-carrier-path.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Wrapper Output Fixtures",
  "fixture only",
  "not an installed hook",
  "not an installer",
  "not live settings guidance",
  "not implemented by the current entrypoint",
  "expected output envelope",
  "native-payload-with-carrier",
  "nativePayload",
  "metadataCarrier",
  "user-owned sidecar JSON",
  "Do not read transcript_path",
  "Do not pass through session_id",
  "carrierPath and metadataCarrierPath remain rejected by abk-claude-hook",
  "docs/claude-hook-wrapper-input-contract.md",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js",
  "benchmarks/scripts/check-claude-hook-wrapper-input-contract.js",
  "benchmarks/scripts/check-claude-hook-native-command-input-contract.js",
  "hooks/claude/examples/wrapper-output.valid-envelope.json",
  "hooks/claude/examples/wrapper-output.invalid-transcript-derived.json",
  "hooks/claude/examples/wrapper-output.invalid-current-entrypoint-carrier-path.json",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
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

const forbiddenValidStrings = [
  "transcript_path",
  "session_id",
  "messages",
  "prompt",
  "conversation",
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "carrierPath",
  "metadataCarrierPath",
  ".claude/settings",
  ".claude/settings.json",
  ".claude/settings.local.json",
  "Paste this into",
  "Run this command",
  "Set-Content",
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "Out-File",
  "Add-Content",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  "autoInstall",
  "setupScript",
  "installer",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-wrapper-input-contract.md",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-settings-fragment-draft-fixtures.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "docs/claude-hook-manual-install-review-packet.md",
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

function assertCarrierFields(carrier) {
  for (const field of ["carrierVersion", "hookId", "repoRoot", "task"]) {
    assert.ok(Object.hasOwn(carrier, field), `valid wrapper output metadataCarrier missing ${field}`);
  }
}

function main() {
  for (const filePath of [docPath, validOutputPath, invalidTranscriptPath, invalidEntrypointPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validOutput = readJson(validOutputPath);
  const invalidTranscript = readJson(invalidTranscriptPath);
  const invalidEntrypoint = readJson(invalidEntrypointPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook wrapper output fixtures doc");
  assertNoStrings(doc, forbiddenDocPhrases, "wrapper output fixtures doc");
  assertNoStrings(validOutput, forbiddenValidStrings, "valid wrapper output fixture");

  assert.equal(validOutput.fixtureKind, "claude-hook-wrapper-output-fixture", "valid output fixtureKind mismatch");
  assert.equal(validOutput.status, "expected-output-only", "valid output must be expected-output-only");
  assert.equal(validOutput.userApprovalRequired, true, "valid output must require user approval");
  assert.equal(validOutput.notImplementedByCurrentEntrypoint, true, "valid output must not be current-entrypoint implemented");
  assert.equal(validOutput.notInstallableAsIs, true, "valid output must not be installable as-is");
  assert.equal(validOutput.wrapperMayReadTranscript, false, "valid output must not read transcripts");
  assert.equal(validOutput.wrapperMayMutateConfiguration, false, "valid output must not mutate configuration");
  assert.equal(validOutput.currentEntrypointMustRejectCarrierPaths, true, "valid output must preserve carrier path rejection");
  assert.equal(validOutput.inputSources.nativePayload, "native-stdin-projection", "valid output native source mismatch");
  assert.equal(validOutput.inputSources.metadataCarrier, "user-owned-sidecar-json", "valid output carrier source mismatch");

  assert.equal(
    validOutput.outputEnvelope.inputMode,
    "native-payload-with-carrier",
    "valid output envelope inputMode mismatch"
  );
  assert.ok(validOutput.outputEnvelope.nativePayload, "valid output envelope missing nativePayload");
  assert.ok(validOutput.outputEnvelope.metadataCarrier, "valid output envelope missing metadataCarrier");
  assert.equal(
    validOutput.outputEnvelope.nativePayload.hook_event_name,
    "PostToolUse",
    "valid output native payload event mismatch"
  );
  assert.equal(validOutput.outputEnvelope.nativePayload.tool_name, "Write", "valid output native payload tool mismatch");
  assert.equal(
    validOutput.outputEnvelope.nativePayload.tool_input.file_path,
    "src/mindmap/new-surface.ts",
    "valid output native payload file path mismatch"
  );
  assertCarrierFields(validOutput.outputEnvelope.metadataCarrier);
  assert.equal(
    validOutput.outputEnvelope.metadataCarrier.task.declaredBy,
    "user-owned-carrier-source",
    "valid output carrier task source mismatch"
  );
  assert.deepEqual(
    validOutput.outputEnvelope.metadataCarrier.namedTools,
    ["opendataloader-pdf", "latex"],
    "valid output carrier namedTools mismatch"
  );

  assert.ok(
    validOutput.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js"),
    "valid output must include its own evidence gate"
  );
  assert.ok(
    validOutput.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js"),
    "valid output must include wrapper input evidence gate"
  );
  assert.ok(
    validOutput.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-native-command-input-contract.js"),
    "valid output must include native command input evidence gate"
  );

  assert.equal(
    invalidTranscript.rejectedBecause,
    "wrapper output derives carrier metadata from transcript_path",
    "invalid transcript output rejection reason mismatch"
  );
  assert.ok(
    JSON.stringify(invalidTranscript).includes("transcript_path"),
    "invalid transcript output must mention transcript_path"
  );
  assert.equal(
    invalidEntrypoint.rejectedBecause,
    "current entrypoint must reject carrier paths",
    "invalid current-entrypoint output rejection reason mismatch"
  );
  assert.equal(invalidEntrypoint.inputMode, "native-payload-with-carrier", "invalid entrypoint inputMode mismatch");
  assert.ok(Object.hasOwn(invalidEntrypoint, "carrierPath"), "invalid entrypoint fixture must include carrierPath");
  assert.ok(
    Object.hasOwn(invalidEntrypoint, "metadataCarrierPath"),
    "invalid entrypoint fixture must include metadataCarrierPath"
  );

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-wrapper-output-fixtures.md"),
      `${relativePath} must link docs/claude-hook-wrapper-output-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js"),
      `${scriptName} must include check-claude-hook-wrapper-output-fixtures.js`
    );
  }

  console.log("Claude hook wrapper output fixtures check passed");
}

main();
