const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-carrier-source-contract.md");
const validSourcePath = path.join(root, "hooks", "claude", "examples", "carrier-source.valid.json");
const invalidTranscriptPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "carrier-source.invalid-transcript-derived.json"
);
const invalidSettingsInlinePath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "carrier-source.invalid-settings-inline.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Carrier Source Contract",
  "contract only",
  "not an installed hook",
  "not an installer",
  "not live settings guidance",
  "User approval required.",
  "Agent must not create or edit the carrier source.",
  "user-owned sidecar JSON",
  "not consumed by the current entrypoint",
  "current entrypoint must still reject carrierPath and metadataCarrierPath",
  "native-payload-with-carrier",
  "metadataCarrier",
  "hookId",
  "repoRoot",
  "task",
  "docs/claude-hook-settings-fragment-draft-fixtures.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "benchmarks/scripts/check-claude-hook-carrier-source-contract.js",
  "benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js",
  "benchmarks/scripts/check-claude-hook-native-command-input-contract.js",
  "hooks/claude/examples/carrier-source.valid.json",
  "hooks/claude/examples/carrier-source.invalid-transcript-derived.json",
  "hooks/claude/examples/carrier-source.invalid-settings-inline.json",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
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
  "docs/claude-hook-settings-fragment-draft-fixtures.md",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "docs/claude-hook-manual-install-review-packet.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
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
  for (const field of ["hookId", "repoRoot", "task"]) {
    assert.ok(Object.hasOwn(carrier, field), `valid carrier source metadataCarrier missing ${field}`);
  }
}

function main() {
  for (const filePath of [docPath, validSourcePath, invalidTranscriptPath, invalidSettingsInlinePath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validSource = readJson(validSourcePath);
  const invalidTranscript = readJson(invalidTranscriptPath);
  const invalidSettingsInline = readJson(invalidSettingsInlinePath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook carrier source contract doc");
  assertNoStrings(doc, forbiddenDocPhrases, "carrier source contract doc");
  assertNoStrings(validSource, forbiddenValidStrings, "valid carrier source fixture");

  assert.equal(validSource.fixtureKind, "claude-hook-carrier-source-contract", "valid carrier source fixtureKind mismatch");
  assert.equal(validSource.status, "contract-only", "valid carrier source must be contract-only");
  assert.equal(validSource.userApprovalRequired, true, "valid carrier source must require user approval");
  assert.equal(validSource.agentMayCreateOrEdit, false, "valid carrier source must block agent-created carriers");
  assert.equal(validSource.notInstallableAsIs, true, "valid carrier source must not be installable as-is");
  assert.equal(validSource.consumedByCurrentEntrypoint, false, "valid carrier source must not be current-entrypoint consumed");
  assert.equal(validSource.currentEntrypointMustRejectCarrierPaths, true, "valid carrier source must preserve carrier path rejection");

  assert.equal(validSource.carrierSource.kind, "user-owned-sidecar-json", "valid carrier source kind mismatch");
  assert.equal(validSource.carrierSource.currentEntrypoint, "not-consumed", "valid carrier source current entrypoint mismatch");
  assert.equal(validSource.carrierSource.pathPlaceholder, "<user-owned-carrier-json>", "valid carrier source placeholder mismatch");
  assert.equal(validSource.commandEnvelope.inputMode, "native-payload-with-carrier", "valid carrier source inputMode mismatch");
  assert.equal(validSource.commandEnvelope.requiredField, "metadataCarrier", "valid carrier source required field mismatch");
  assert.equal(
    validSource.commandEnvelope.contract,
    "docs/claude-hook-native-command-input-contract.md",
    "valid carrier source command contract mismatch"
  );
  assertCarrierFields(validSource.metadataCarrier);

  assert.ok(
    validSource.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-carrier-source-contract.js"),
    "valid carrier source must include its own evidence gate"
  );
  assert.ok(
    validSource.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js"),
    "valid carrier source must include settings-fragment draft evidence gate"
  );
  assert.ok(
    validSource.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-native-command-input-contract.js"),
    "valid carrier source must include native command input contract evidence gate"
  );

  assert.equal(
    invalidTranscript.rejectedBecause,
    "carrier derives task metadata from transcript_path",
    "invalid transcript fixture rejection reason mismatch"
  );
  assert.ok(
    JSON.stringify(invalidTranscript).includes("transcript_path"),
    "invalid transcript fixture must contain transcript_path"
  );
  assert.ok(invalidSettingsInline.hooks, "invalid settings-inline fixture must expose top-level hooks");
  assert.ok(
    Object.hasOwn(invalidSettingsInline, "metadataCarrier"),
    "invalid settings-inline fixture must include top-level metadataCarrier"
  );
  assert.ok(
    !Object.hasOwn(invalidSettingsInline, "userApprovalRequired"),
    "invalid settings-inline fixture must omit approval metadata"
  );

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-carrier-source-contract.md"),
      `${relativePath} must link docs/claude-hook-carrier-source-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-carrier-source-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-carrier-source-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-carrier-source-contract.js"),
      `${scriptName} must include check-claude-hook-carrier-source-contract.js`
    );
  }

  console.log("Claude hook carrier source contract check passed");
}

main();
