const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-wrapper-input-contract.md");
const validWrapperPath = path.join(root, "hooks", "claude", "examples", "wrapper-input.valid.json");
const invalidTranscriptPath = path.join(root, "hooks", "claude", "examples", "wrapper-input.invalid-transcript-derived.json");
const invalidEntrypointPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "wrapper-input.invalid-current-entrypoint-carrier-path.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Wrapper Input Contract",
  "contract only",
  "not an installed hook",
  "not an installer",
  "not live settings guidance",
  "not implemented by the current entrypoint",
  "User approval required.",
  "native stdin",
  "user-owned sidecar JSON",
  "must produce a native-payload-with-carrier envelope",
  "metadataCarrier",
  "carrierPath and metadataCarrierPath remain rejected by abk-claude-hook",
  "Do not read transcript_path",
  "Do not pass through session_id",
  "Do not create or edit Claude configuration files",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "benchmarks/scripts/check-claude-hook-wrapper-input-contract.js",
  "benchmarks/scripts/check-claude-hook-carrier-source-contract.js",
  "benchmarks/scripts/check-claude-hook-native-command-input-contract.js",
  "hooks/claude/examples/wrapper-input.valid.json",
  "hooks/claude/examples/wrapper-input.invalid-transcript-derived.json",
  "hooks/claude/examples/wrapper-input.invalid-current-entrypoint-carrier-path.json",
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

function main() {
  for (const filePath of [docPath, validWrapperPath, invalidTranscriptPath, invalidEntrypointPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validWrapper = readJson(validWrapperPath);
  const invalidTranscript = readJson(invalidTranscriptPath);
  const invalidEntrypoint = readJson(invalidEntrypointPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook wrapper input contract doc");
  assertNoStrings(doc, forbiddenDocPhrases, "wrapper input contract doc");
  assertNoStrings(validWrapper, forbiddenValidStrings, "valid wrapper input fixture");

  assert.equal(validWrapper.fixtureKind, "claude-hook-wrapper-input-contract", "valid wrapper fixtureKind mismatch");
  assert.equal(validWrapper.status, "contract-only", "valid wrapper must be contract-only");
  assert.equal(validWrapper.userApprovalRequired, true, "valid wrapper must require user approval");
  assert.equal(validWrapper.notInstallableAsIs, true, "valid wrapper must not be installable as-is");
  assert.equal(validWrapper.consumedByCurrentEntrypoint, false, "valid wrapper must not be current-entrypoint consumed");
  assert.equal(validWrapper.wrapperMayReadTranscript, false, "valid wrapper must not read transcripts");
  assert.equal(validWrapper.wrapperMayMutateConfiguration, false, "valid wrapper must not mutate configuration");
  assert.equal(validWrapper.currentEntrypointMustRejectCarrierPaths, true, "valid wrapper must preserve path rejection");
  assert.equal(validWrapper.nativeInput.source, "native-stdin", "valid wrapper native input source mismatch");
  assert.equal(validWrapper.nativeInput.policy, "project-allowed-fields-only", "valid wrapper native input policy mismatch");
  assert.equal(validWrapper.carrierSource.kind, "user-owned-sidecar-json", "valid wrapper carrier source kind mismatch");
  assert.equal(validWrapper.carrierSource.pathPlaceholder, "<user-owned-carrier-json>", "valid wrapper carrier placeholder mismatch");
  assert.equal(validWrapper.outputEnvelope.inputMode, "native-payload-with-carrier", "valid wrapper output inputMode mismatch");
  assert.deepEqual(
    validWrapper.outputEnvelope.requiredFields,
    ["nativePayload", "metadataCarrier"],
    "valid wrapper output required fields mismatch"
  );
  assert.equal(
    validWrapper.outputEnvelope.contract,
    "docs/claude-hook-native-command-input-contract.md",
    "valid wrapper output contract mismatch"
  );

  assert.ok(
    validWrapper.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js"),
    "valid wrapper must include its own evidence gate"
  );
  assert.ok(
    validWrapper.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-carrier-source-contract.js"),
    "valid wrapper must include carrier source evidence gate"
  );
  assert.ok(
    validWrapper.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-native-command-input-contract.js"),
    "valid wrapper must include native command input evidence gate"
  );

  assert.equal(
    invalidTranscript.rejectedBecause,
    "wrapper derives carrier metadata from transcript_path",
    "invalid transcript wrapper rejection reason mismatch"
  );
  assert.ok(
    JSON.stringify(invalidTranscript).includes("transcript_path"),
    "invalid transcript wrapper must mention transcript_path"
  );
  assert.equal(
    invalidEntrypoint.rejectedBecause,
    "current entrypoint must reject carrier paths",
    "invalid current-entrypoint wrapper rejection reason mismatch"
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
      file.includes("docs/claude-hook-wrapper-input-contract.md"),
      `${relativePath} must link docs/claude-hook-wrapper-input-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-wrapper-input-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-wrapper-input-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js"),
      `${scriptName} must include check-claude-hook-wrapper-input-contract.js`
    );
  }

  console.log("Claude hook wrapper input contract check passed");
}

main();
