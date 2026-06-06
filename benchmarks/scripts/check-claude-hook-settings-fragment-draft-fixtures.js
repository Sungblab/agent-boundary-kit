const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-settings-fragment-draft-fixtures.md");
const validDraftPath = path.join(root, "hooks", "claude", "examples", "settings-fragment-draft.valid.json");
const invalidLiveSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "settings-fragment-draft.invalid-live-settings.json"
);
const invalidMutatingPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "settings-fragment-draft.invalid-mutating.md"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Settings Fragment Draft Fixtures",
  "draft fixture only",
  "not a live settings fragment",
  "not an installer",
  "not hook setup guidance",
  "User approval required.",
  "Agent must not edit settings.",
  "not installable as-is",
  "carrier gap must stay explicit",
  "abk-claude-hook",
  "Edit|MultiEdit|Write",
  "native-payload-with-carrier",
  "metadataCarrier",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "docs/claude-hook-manual-install-review-packet.md",
  "docs/claude-hook-native-command-input-contract.md",
  "benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js",
  "benchmarks/scripts/check-claude-hook-manual-install-review-packet.js",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "hooks/claude/examples/settings-fragment-draft.valid.json",
  "hooks/claude/examples/settings-fragment-draft.invalid-live-settings.json",
  "hooks/claude/examples/settings-fragment-draft.invalid-mutating.md",
  "npm run bench:check",
  "npm run bench:check:red",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
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

const forbiddenDraftStrings = [
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
  "autoInstall",
  "autoSetup",
  "installer",
  "setupScript",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
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

function draftHook(validDraft) {
  return validDraft.settingsFragmentDraft.hooks.PostToolUse[0].hooks[0];
}

function main() {
  for (const filePath of [docPath, validDraftPath, invalidLiveSettingsPath, invalidMutatingPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validDraft = readJson(validDraftPath);
  const invalidLiveSettings = readJson(invalidLiveSettingsPath);
  const invalidMutating = read(invalidMutatingPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook settings fragment draft fixtures doc");
  assertNoStrings(doc, forbiddenDocPhrases, "settings fragment draft doc");
  assertNoStrings(validDraft, forbiddenDraftStrings, "valid settings fragment draft fixture");

  assert.equal(validDraft.fixtureKind, "claude-hook-settings-fragment-draft", "valid draft fixtureKind mismatch");
  assert.equal(validDraft.status, "draft-only", "valid draft must be draft-only");
  assert.equal(validDraft.userApprovalRequired, true, "valid draft must require user approval");
  assert.equal(validDraft.agentMayApplySettings, false, "valid draft must not allow agent-applied settings");
  assert.equal(validDraft.notInstallableAsIs, true, "valid draft must be not installable as-is");
  assert.equal(validDraft.carrierGapAcknowledged, true, "valid draft must acknowledge the carrier gap");
  assert.equal(validDraft.requiredCarrier.inputMode, "native-payload-with-carrier", "valid draft inputMode mismatch");
  assert.equal(validDraft.requiredCarrier.field, "metadataCarrier", "valid draft carrier field mismatch");
  assert.equal(
    validDraft.requiredCarrier.contract,
    "docs/claude-hook-native-command-input-contract.md",
    "valid draft carrier contract mismatch"
  );
  assert.equal(validDraft.sourceReferences.hooks, "https://code.claude.com/docs/en/hooks");
  assert.equal(validDraft.sourceReferences.settings, "https://code.claude.com/docs/en/configuration");

  assert.ok(validDraft.settingsFragmentDraft, "valid draft missing settingsFragmentDraft");
  assert.ok(validDraft.settingsFragmentDraft.hooks, "valid draft missing hooks block under settingsFragmentDraft");
  assert.ok(Array.isArray(validDraft.settingsFragmentDraft.hooks.PostToolUse), "valid draft missing PostToolUse array");
  assert.equal(
    validDraft.settingsFragmentDraft.hooks.PostToolUse[0].matcher,
    "Edit|MultiEdit|Write",
    "valid draft matcher must cover Edit, MultiEdit, and Write"
  );
  assert.equal(draftHook(validDraft).type, "command", "valid draft hook type mismatch");
  assert.equal(draftHook(validDraft).command, "abk-claude-hook", "valid draft command mismatch");

  assert.ok(
    validDraft.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js"),
    "valid draft must include its own evidence gate"
  );
  assert.ok(
    validDraft.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js"),
    "valid draft must include review packet evidence gate"
  );
  assert.ok(
    validDraft.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js"),
    "valid draft must include native command entrypoint evidence gate"
  );

  assert.ok(invalidLiveSettings.hooks, "invalid live settings fixture must expose a top-level hooks block");
  assert.ok(!Object.hasOwn(invalidLiveSettings, "userApprovalRequired"), "invalid live settings must omit approval metadata");
  assert.ok(!Object.hasOwn(invalidLiveSettings, "carrierGapAcknowledged"), "invalid live settings must omit carrier gap metadata");
  assert.ok(invalidMutating.includes("Paste this into"), "invalid mutating fixture must include paste instruction");
  assert.ok(invalidMutating.includes(".claude/settings.json"), "invalid mutating fixture must include direct settings path");
  assert.ok(invalidMutating.includes("Set-Content"), "invalid mutating fixture must include mutation command");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-settings-fragment-draft-fixtures.md"),
      `${relativePath} must link docs/claude-hook-settings-fragment-draft-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-settings-fragment-draft-fixtures.js`
    );
  }

  console.log("Claude hook settings fragment draft fixture check passed");
}

main();
