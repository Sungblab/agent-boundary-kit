const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-owned-target-checklist.md");
const validPath = path.join(root, "hooks", "claude", "examples", "user-owned-target.valid-explicit-target.json");
const invalidRepoTargetPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target.invalid-repo-target.json"
);
const invalidMissingBackupPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target.invalid-missing-backup.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User-Owned Target Checklist",
  "checklist contract only",
  "user-owned target required",
  "explicit install request is not sufficient by itself",
  "Agent must not edit settings until target ownership, scope, backup, and evidence are reviewed.",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "hooks/claude/examples/user-owned-target.valid-explicit-target.json",
  "hooks/claude/examples/user-owned-target.invalid-repo-target.json",
  "hooks/claude/examples/user-owned-target.invalid-missing-backup.json",
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
  for (const filePath of [docPath, validPath, invalidRepoTargetPath, invalidMissingBackupPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const valid = readJson(validPath);
  const invalidRepoTarget = readJson(invalidRepoTargetPath);
  const invalidMissingBackup = readJson(invalidMissingBackupPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user-owned target checklist doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook user-owned target checklist doc");

  assert.equal(valid.fixtureKind, "claude-hook-user-owned-target-checklist", "valid fixtureKind mismatch");
  assert.equal(valid.status, "ready-for-user-target-review", "valid fixture status mismatch");
  assert.equal(valid.explicitInstallRequest, true, "valid fixture must include explicit install request");
  assert.equal(valid.userOwnedTargetProvided, true, "valid fixture must include user-owned target");
  assert.equal(valid.agentMayApplySettings, false, "valid fixture must not allow settings application inside this repo");
  assert.equal(valid.targetScopeReviewed, true, "valid fixture must require reviewed target scope");
  assert.equal(valid.backupPlanRequired, true, "valid fixture must require a backup plan");
  assertEvidence(
    valid,
    [
      "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
      "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
      "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
    ],
    "valid fixture"
  );

  assert.equal(
    invalidRepoTarget.fixtureKind,
    "claude-hook-user-owned-target-checklist",
    "invalid repo target fixtureKind mismatch"
  );
  assert.equal(invalidRepoTarget.status, "blocked", "invalid repo target fixture must block");
  assert.equal(invalidRepoTarget.targetInsideRepository, true, "invalid repo target must be inside repository");
  assert.equal(
    invalidRepoTarget.reason,
    "target must be user-owned outside this repository",
    "invalid repo target reason mismatch"
  );
  assert.equal(invalidRepoTarget.agentMayApplySettings, false, "invalid repo target must not allow settings application");

  assert.equal(
    invalidMissingBackup.fixtureKind,
    "claude-hook-user-owned-target-checklist",
    "invalid missing backup fixtureKind mismatch"
  );
  assert.equal(invalidMissingBackup.status, "blocked", "invalid missing backup fixture must block");
  assert.equal(invalidMissingBackup.backupPlanProvided, false, "invalid missing backup fixture must omit backup plan");
  assert.equal(
    invalidMissingBackup.reason,
    "backup plan required before settings application",
    "invalid missing backup reason mismatch"
  );
  assert.equal(
    invalidMissingBackup.agentMayApplySettings,
    false,
    "invalid missing backup must not allow settings application"
  );

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-owned-target-checklist.md"),
      `${relativePath} must link docs/claude-hook-user-owned-target-checklist.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js"),
      `${scriptName} must include check-claude-hook-user-owned-target-checklist.js`
    );
  }

  console.log("Claude hook user-owned target checklist check passed");
}

main();
