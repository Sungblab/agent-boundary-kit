const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-owned-target-review-evidence.md");
const validPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review.valid-evidence-record.json"
);
const invalidGenericContinuationPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review.invalid-generic-continuation.json"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review.invalid-agent-applied-settings.json"
);
const invalidMissingScopeReviewPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review.invalid-missing-scope-review.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User-Owned Target Review Evidence",
  "evidence-record contract only",
  "user-owned target review required",
  "review evidence is not settings application",
  "Agent must not edit settings after recording review evidence.",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "hooks/claude/examples/user-owned-target-review.valid-evidence-record.json",
  "hooks/claude/examples/user-owned-target-review.invalid-generic-continuation.json",
  "hooks/claude/examples/user-owned-target-review.invalid-agent-applied-settings.json",
  "hooks/claude/examples/user-owned-target-review.invalid-missing-scope-review.json",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
  "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
  "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
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
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
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
    validPath,
    invalidGenericContinuationPath,
    invalidAppliedSettingsPath,
    invalidMissingScopeReviewPath,
  ];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const valid = readJson(validPath);
  const invalidGenericContinuation = readJson(invalidGenericContinuationPath);
  const invalidAppliedSettings = readJson(invalidAppliedSettingsPath);
  const invalidMissingScopeReview = readJson(invalidMissingScopeReviewPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user-owned target review evidence doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook user-owned target review evidence doc");

  assert.equal(valid.fixtureKind, "claude-hook-user-owned-target-review-evidence", "valid fixtureKind mismatch");
  assert.equal(valid.status, "review-evidence-recorded", "valid fixture status mismatch");
  assert.equal(valid.explicitInstallRequest, true, "valid fixture must include explicit install request");
  assert.equal(valid.sourceTextRole, "explicit-install-request", "valid fixture source role mismatch");
  assert.equal(valid.userOwnedTargetProvided, true, "valid fixture must include user-owned target");
  assert.equal(valid.targetInsideRepository, false, "valid fixture target must be outside repository");
  assert.equal(valid.targetScopeReviewed, true, "valid fixture must review target scope");
  assert.equal(valid.backupEvidenceRecorded, true, "valid fixture must record backup evidence");
  assert.equal(valid.preflightEvidenceRecorded, true, "valid fixture must record preflight evidence");
  assert.equal(valid.settingsMutationAttempted, false, "valid fixture must not mutate settings");
  assert.equal(valid.agentMayApplySettings, false, "valid fixture must not allow settings application");
  assert.equal(valid.reviewOnly, true, "valid fixture must remain review-only");
  assertEvidence(
    valid,
    [
      "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
      "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
      "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
      "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
      "node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js",
    ],
    "valid fixture"
  );

  assert.equal(
    invalidGenericContinuation.fixtureKind,
    "claude-hook-user-owned-target-review-evidence",
    "invalid generic continuation fixtureKind mismatch"
  );
  assert.equal(invalidGenericContinuation.status, "blocked", "generic continuation fixture must block");
  assert.equal(invalidGenericContinuation.explicitInstallRequest, false, "generic continuation must not be explicit");
  assert.equal(invalidGenericContinuation.sourceTextRole, "workflow-command", "generic continuation role mismatch");
  assert.equal(
    invalidGenericContinuation.reason,
    "explicit install request required before target review evidence",
    "generic continuation reason mismatch"
  );
  assert.equal(
    invalidGenericContinuation.agentMayApplySettings,
    false,
    "generic continuation must not allow settings application"
  );

  assert.equal(
    invalidAppliedSettings.fixtureKind,
    "claude-hook-user-owned-target-review-evidence",
    "invalid applied settings fixtureKind mismatch"
  );
  assert.equal(invalidAppliedSettings.status, "blocked", "applied settings fixture must block");
  assert.equal(invalidAppliedSettings.settingsMutationAttempted, true, "applied settings fixture must attempt mutation");
  assert.equal(invalidAppliedSettings.agentMayApplySettings, false, "applied settings fixture must not allow settings");
  assert.equal(
    invalidAppliedSettings.reason,
    "review evidence must not apply settings",
    "applied settings reason mismatch"
  );

  assert.equal(
    invalidMissingScopeReview.fixtureKind,
    "claude-hook-user-owned-target-review-evidence",
    "invalid missing scope fixtureKind mismatch"
  );
  assert.equal(invalidMissingScopeReview.status, "blocked", "missing scope fixture must block");
  assert.equal(invalidMissingScopeReview.targetScopeReviewed, false, "missing scope fixture must omit scope review");
  assert.equal(
    invalidMissingScopeReview.reason,
    "target scope review required before evidence can advance",
    "missing scope reason mismatch"
  );
  assert.equal(
    invalidMissingScopeReview.agentMayApplySettings,
    false,
    "missing scope fixture must not allow settings application"
  );

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-owned-target-review-evidence.md"),
      `${relativePath} must link docs/claude-hook-user-owned-target-review-evidence.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js"
      ),
      `${scriptName} must include check-claude-hook-user-owned-target-review-evidence.js`
    );
  }

  console.log("Claude hook user-owned target review evidence check passed");
}

main();
