const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-settings-fragment-review.md");
const validReviewPath = path.join(root, "hooks", "claude", "examples", "settings-fragment-review.valid.json");
const invalidLiveSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "settings-fragment-review.invalid-live-settings.json"
);
const invalidMutatingPath = path.join(root, "hooks", "claude", "examples", "settings-fragment-review.invalid-mutating.md");
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Settings Fragment Review",
  "review-only",
  "not a live settings fragment",
  "not an installer",
  "not hook setup guidance",
  "User approval required.",
  "Agent must not edit settings.",
  "not installable as-is",
  "abk-claude-hook-wrapper",
  "abk-claude-hook-wrapper --carrier <user-owned-carrier-json>",
  "Edit|MultiEdit|Write",
  "native-payload-with-carrier",
  "metadataCarrier",
  "docs/claude-hook-wrapper-wiring-review.md",
  "docs/claude-hook-wrapper-implementation.md",
  "docs/claude-hook-native-command-input-contract.md",
  "hooks/claude/examples/settings-fragment-review.valid.json",
  "hooks/claude/examples/settings-fragment-review.invalid-live-settings.json",
  "hooks/claude/examples/settings-fragment-review.invalid-mutating.md",
  "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js",
  "npm run bench:check",
  "npm run bench:check:red",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
  "Do not publish live settings guidance",
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

const forbiddenReviewStrings = [
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
  "finalSettings",
  "liveSettings",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "docs/claude-hook-settings-fragment-draft-fixtures.md",
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

function reviewedHook(validReview) {
  return validReview.settingsFragmentReview.hooks.PostToolUse[0].hooks[0];
}

function main() {
  for (const filePath of [docPath, validReviewPath, invalidLiveSettingsPath, invalidMutatingPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validReview = readJson(validReviewPath);
  const invalidLiveSettings = readJson(invalidLiveSettingsPath);
  const invalidMutating = read(invalidMutatingPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook settings fragment review doc");
  assertNoStrings(doc, forbiddenDocPhrases, "settings fragment review doc");
  assertNoStrings(validReview, forbiddenReviewStrings, "valid settings fragment review fixture");

  assert.equal(validReview.fixtureKind, "claude-hook-settings-fragment-review", "valid review fixtureKind mismatch");
  assert.equal(validReview.status, "review-only", "valid review must be review-only");
  assert.equal(validReview.userApprovalRequired, true, "valid review must require user approval");
  assert.equal(validReview.agentMayApplySettings, false, "valid review must not allow agent-applied settings");
  assert.equal(validReview.notInstallableAsIs, true, "valid review must be not installable as-is");
  assert.equal(validReview.wrapperWiringReviewed, true, "valid review must acknowledge wrapper wiring evidence");
  assert.equal(validReview.requiredCarrier.inputMode, "native-payload-with-carrier", "valid review inputMode mismatch");
  assert.equal(validReview.requiredCarrier.field, "metadataCarrier", "valid review carrier field mismatch");
  assert.equal(
    validReview.requiredCarrier.contract,
    "docs/claude-hook-native-command-input-contract.md",
    "valid review carrier contract mismatch"
  );
  assert.equal(validReview.wrapperCommand.contract, "docs/claude-hook-wrapper-implementation.md");
  assert.equal(validReview.wrapperCommand.wiringEvidence, "docs/claude-hook-wrapper-wiring-review.md");

  assert.ok(validReview.settingsFragmentReview, "valid review missing settingsFragmentReview");
  assert.ok(validReview.settingsFragmentReview.hooks, "valid review missing hooks block under settingsFragmentReview");
  assert.ok(
    Array.isArray(validReview.settingsFragmentReview.hooks.PostToolUse),
    "valid review missing PostToolUse array"
  );
  assert.equal(
    validReview.settingsFragmentReview.hooks.PostToolUse[0].matcher,
    "Edit|MultiEdit|Write",
    "valid review matcher must cover Edit, MultiEdit, and Write"
  );
  assert.equal(reviewedHook(validReview).type, "command", "valid review hook type mismatch");
  assert.equal(
    reviewedHook(validReview).command,
    "abk-claude-hook-wrapper --carrier <user-owned-carrier-json>",
    "valid review command mismatch"
  );

  assert.ok(
    validReview.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-settings-fragment-review.js"),
    "valid review must include its own evidence gate"
  );
  assert.ok(
    validReview.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js"),
    "valid review must include wrapper wiring evidence gate"
  );
  assert.ok(
    validReview.evidenceGates.includes("node benchmarks/scripts/check-claude-hook-wrapper-implementation.js"),
    "valid review must include wrapper implementation evidence gate"
  );

  assert.ok(invalidLiveSettings.hooks, "invalid live settings fixture must expose a top-level hooks block");
  assert.ok(!Object.hasOwn(invalidLiveSettings, "userApprovalRequired"), "invalid live settings must omit approval metadata");
  assert.ok(!Object.hasOwn(invalidLiveSettings, "wrapperWiringReviewed"), "invalid live settings must omit wiring metadata");
  assert.ok(invalidMutating.includes("Paste this into"), "invalid mutating fixture must include paste instruction");
  assert.ok(invalidMutating.includes(".claude/settings.json"), "invalid mutating fixture must include direct settings path");
  assert.ok(invalidMutating.includes("Set-Content"), "invalid mutating fixture must include mutation command");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-settings-fragment-review.md"),
      `${relativePath} must link docs/claude-hook-settings-fragment-review.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-settings-fragment-review.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-settings-fragment-review.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-settings-fragment-review.js"),
      `${scriptName} must include check-claude-hook-settings-fragment-review.js`
    );
  }

  console.log("Claude hook settings fragment review check passed");
}

main();
