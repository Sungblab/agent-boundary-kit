const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-application-preflight-review-contract.md");
const validPreflightPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "application-preflight.valid-reviewed-evidence.json"
);
const invalidMissingFinalRequestPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "application-preflight.invalid-missing-final-request.json"
);
const invalidMissingBackupEvidencePath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "application-preflight.invalid-missing-backup-evidence.json"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "application-preflight.invalid-agent-applied-settings.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Application Preflight Review Contract",
  "application preflight review contract only",
  "application preflight review is not settings application",
  "Agent must not edit settings during application preflight review.",
  "A valid preflight review can only advance to user execution packet review.",
  "final apply request required before application preflight review",
  "backup evidence required before application preflight review",
  "docs/claude-hook-final-apply-request-contract.md",
  "docs/claude-hook-user-owned-target-review-decision.md",
  "docs/claude-hook-user-owned-target-review-packet.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "hooks/claude/examples/application-preflight.valid-reviewed-evidence.json",
  "hooks/claude/examples/application-preflight.invalid-missing-final-request.json",
  "hooks/claude/examples/application-preflight.invalid-missing-backup-evidence.json",
  "hooks/claude/examples/application-preflight.invalid-agent-applied-settings.json",
  "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
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
  "docs/claude-hook-final-apply-request-contract.md",
  "docs/claude-hook-user-owned-target-review-decision.md",
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
  const requiredFiles = [
    docPath,
    validPreflightPath,
    invalidMissingFinalRequestPath,
    invalidMissingBackupEvidencePath,
    invalidAppliedSettingsPath,
  ];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validPreflight = readJson(validPreflightPath);
  const invalidMissingFinalRequest = readJson(invalidMissingFinalRequestPath);
  const invalidMissingBackupEvidence = readJson(invalidMissingBackupEvidencePath);
  const invalidAppliedSettings = readJson(invalidAppliedSettingsPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook application preflight review contract doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook application preflight review contract doc");

  assert.equal(validPreflight.fixtureKind, "claude-hook-application-preflight-review-contract", "valid fixtureKind mismatch");
  assert.equal(validPreflight.status, "ready-for-user-execution-packet-review", "valid preflight status mismatch");
  assert.equal(validPreflight.sourceTextRole, "application-preflight-review", "valid preflight source role mismatch");
  assert.equal(validPreflight.finalApplyRequestReviewed, true, "valid preflight must review final apply request");
  assert.equal(validPreflight.targetReviewDecisionReviewed, true, "valid preflight must review target decision");
  assert.equal(validPreflight.targetReviewPacketReviewed, true, "valid preflight must review target packet");
  assert.equal(validPreflight.targetReviewEvidenceReviewed, true, "valid preflight must review target evidence");
  assert.equal(validPreflight.backupEvidenceReviewed, true, "valid preflight must review backup evidence");
  assert.equal(validPreflight.settingsFragmentReviewReviewed, true, "valid preflight must review settings fragment");
  assert.equal(validPreflight.userApprovedInstallLanguageReviewed, true, "valid preflight must review install language");
  assert.equal(validPreflight.agentMayApplySettings, false, "valid preflight must not allow settings application");
  assert.equal(validPreflight.settingsMutationAttempted, false, "valid preflight must not mutate settings");
  assert.equal(validPreflight.nextGate, "user-execution-packet-review", "valid preflight next gate mismatch");
  assertEvidence(
    validPreflight,
    [
      "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
      "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
      "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
    ],
    "valid preflight"
  );

  assert.equal(
    invalidMissingFinalRequest.fixtureKind,
    "claude-hook-application-preflight-review-contract",
    "missing final request fixtureKind mismatch"
  );
  assert.equal(invalidMissingFinalRequest.status, "blocked", "missing final request must block");
  assert.equal(invalidMissingFinalRequest.finalApplyRequestReviewed, false, "missing final request fixture must omit final request");
  assert.equal(
    invalidMissingFinalRequest.reason,
    "final apply request required before application preflight review",
    "missing final request reason mismatch"
  );
  assert.equal(invalidMissingFinalRequest.agentMayApplySettings, false, "missing final request must not allow settings");

  assert.equal(
    invalidMissingBackupEvidence.fixtureKind,
    "claude-hook-application-preflight-review-contract",
    "missing backup fixtureKind mismatch"
  );
  assert.equal(invalidMissingBackupEvidence.status, "blocked", "missing backup must block");
  assert.equal(invalidMissingBackupEvidence.backupEvidenceReviewed, false, "missing backup fixture must omit backup evidence");
  assert.equal(
    invalidMissingBackupEvidence.reason,
    "backup evidence required before application preflight review",
    "missing backup reason mismatch"
  );
  assert.equal(invalidMissingBackupEvidence.agentMayApplySettings, false, "missing backup must not allow settings");

  assert.equal(invalidAppliedSettings.fixtureKind, "claude-hook-application-preflight-review-contract", "applied settings fixtureKind mismatch");
  assert.equal(invalidAppliedSettings.status, "blocked", "applied settings must block");
  assert.equal(invalidAppliedSettings.settingsMutationAttempted, true, "applied settings fixture must attempt mutation");
  assert.equal(invalidAppliedSettings.agentMayApplySettings, false, "applied settings must not allow settings");
  assert.equal(invalidAppliedSettings.reason, "application preflight review must not apply settings", "applied settings reason mismatch");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-application-preflight-review-contract.md"),
      `${relativePath} must link docs/claude-hook-application-preflight-review-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js"
      ),
      `${scriptName} must include check-claude-hook-application-preflight-review-contract.js`
    );
  }

  console.log("Claude hook application preflight review contract check passed");
}

main();
