const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-owned-target-review-decision.md");
const validDecisionPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review-decision.valid-defer-application.json"
);
const invalidGenericContinuationPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review-decision.invalid-generic-continuation.json"
);
const invalidNoPacketPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review-decision.invalid-missing-packet.json"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review-decision.invalid-agent-applied-settings.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User-Owned Target Review Decision",
  "decision-fixture contract only",
  "target review decision is not settings application",
  "Agent must not edit settings after recording a review decision.",
  "final user apply request required before any future application review",
  "generic continuation text is not an application decision",
  "docs/claude-hook-user-owned-target-review-packet.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "hooks/claude/examples/user-owned-target-review-decision.valid-defer-application.json",
  "hooks/claude/examples/user-owned-target-review-decision.invalid-generic-continuation.json",
  "hooks/claude/examples/user-owned-target-review-decision.invalid-missing-packet.json",
  "hooks/claude/examples/user-owned-target-review-decision.invalid-agent-applied-settings.json",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
  "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
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
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "Set-Content",
  "Out-File",
  "Add-Content",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  ".claude/settings",
  ".claude/settings.json",
  ".claude/settings.local.json",
  "claude config",
  "npm install -g",
  "npx ",
  "autoInstall: true",
  "\"autoInstall\": true",
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

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-user-owned-target-review-packet.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "hooks/claude/README.md",
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

function assertExcludesAll(markdown, phrases, label) {
  for (const phrase of phrases) {
    assert.ok(!markdown.includes(phrase), `${label} includes forbidden phrase: ${phrase}`);
  }
}

function assertEvidence(fixture, expected, label) {
  for (const item of expected) {
    assert.ok(fixture.requiredEvidence.includes(item), `${label} missing evidence: ${item}`);
  }
}

function main() {
  const requiredFiles = [docPath, validDecisionPath, invalidGenericContinuationPath, invalidNoPacketPath, invalidAppliedSettingsPath];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validDecision = readJson(validDecisionPath);
  const invalidGenericContinuation = readJson(invalidGenericContinuationPath);
  const invalidNoPacket = readJson(invalidNoPacketPath);
  const invalidAppliedSettings = readJson(invalidAppliedSettingsPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user-owned target review decision doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook user-owned target review decision doc");

  assert.equal(validDecision.fixtureKind, "claude-hook-user-owned-target-review-decision", "valid fixtureKind mismatch");
  assert.equal(validDecision.status, "decision-recorded", "valid decision status mismatch");
  assert.equal(validDecision.decision, "defer-settings-application", "valid decision must defer settings application");
  assert.equal(validDecision.sourceTextRole, "explicit-install-request", "valid decision source role mismatch");
  assert.equal(validDecision.packetReviewed, true, "valid decision must review packet");
  assert.equal(validDecision.targetReviewEvidenceReviewed, true, "valid decision must review evidence");
  assert.equal(validDecision.finalUserApplyRequestPresent, false, "valid decision must not have final apply request");
  assert.equal(validDecision.agentMayApplySettings, false, "valid decision must not allow settings application");
  assert.equal(validDecision.settingsMutationAttempted, false, "valid decision must not mutate settings");
  assert.equal(validDecision.reviewOnly, true, "valid decision must remain review-only");
  assertEvidence(
    validDecision,
    [
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
      "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
    ],
    "valid decision"
  );

  assert.equal(
    invalidGenericContinuation.fixtureKind,
    "claude-hook-user-owned-target-review-decision",
    "invalid generic continuation fixtureKind mismatch"
  );
  assert.equal(invalidGenericContinuation.status, "blocked", "generic continuation decision must block");
  assert.equal(invalidGenericContinuation.sourceTextRole, "workflow-command", "generic continuation role mismatch");
  assert.equal(invalidGenericContinuation.finalUserApplyRequestPresent, false, "generic continuation must not be apply request");
  assert.equal(
    invalidGenericContinuation.reason,
    "generic continuation text is not an application decision",
    "generic continuation reason mismatch"
  );
  assert.equal(invalidGenericContinuation.agentMayApplySettings, false, "generic continuation must not allow settings");

  assert.equal(invalidNoPacket.fixtureKind, "claude-hook-user-owned-target-review-decision", "missing packet fixtureKind mismatch");
  assert.equal(invalidNoPacket.status, "blocked", "missing packet decision must block");
  assert.equal(invalidNoPacket.packetReviewed, false, "missing packet fixture must omit packet review");
  assert.equal(invalidNoPacket.reason, "target review packet required before decision", "missing packet reason mismatch");
  assert.equal(invalidNoPacket.agentMayApplySettings, false, "missing packet must not allow settings");

  assert.equal(
    invalidAppliedSettings.fixtureKind,
    "claude-hook-user-owned-target-review-decision",
    "applied settings fixtureKind mismatch"
  );
  assert.equal(invalidAppliedSettings.status, "blocked", "applied settings decision must block");
  assert.equal(invalidAppliedSettings.settingsMutationAttempted, true, "applied settings fixture must attempt mutation");
  assert.equal(invalidAppliedSettings.agentMayApplySettings, false, "applied settings must not allow settings");
  assert.equal(invalidAppliedSettings.reason, "review decision must not apply settings", "applied settings reason mismatch");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-owned-target-review-decision.md"),
      `${relativePath} must link docs/claude-hook-user-owned-target-review-decision.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js"
      ),
      `${scriptName} must include check-claude-hook-user-owned-target-review-decision.js`
    );
  }

  console.log("Claude hook user-owned target review decision check passed");
}

main();
