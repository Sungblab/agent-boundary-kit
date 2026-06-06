const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-install-application-contract.md");
const blockedPath = path.join(root, "hooks", "claude", "examples", "install-application.invalid-no-explicit-request.json");
const validPath = path.join(root, "hooks", "claude", "examples", "install-application.valid-explicit-request.json");
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Install Application Contract",
  "application contract only",
  "not an installed hook",
  "not an installer",
  "not a setup script",
  "explicit user request required",
  "generic continuation commands are insufficient",
  "Agent must not edit settings without that request.",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "docs/claude-hook-wrapper-implementation.md",
  "hooks/claude/examples/install-application.invalid-no-explicit-request.json",
  "hooks/claude/examples/install-application.valid-explicit-request.json",
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

function main() {
  for (const filePath of [docPath, blockedPath, validPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const blocked = readJson(blockedPath);
  const valid = readJson(validPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook install application contract doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook install application contract doc");

  assert.equal(blocked.fixtureKind, "claude-hook-install-application-contract", "blocked fixtureKind mismatch");
  assert.equal(blocked.status, "blocked", "blocked fixture must block");
  assert.equal(blocked.explicitInstallRequest, false, "blocked fixture must not have explicit install request");
  assert.equal(blocked.agentMayApplySettings, false, "blocked fixture must not allow settings application");
  assert.equal(blocked.reason, "explicit user install request required", "blocked fixture reason mismatch");
  assert.deepEqual(blocked.allowedNextActions, ["stay at language review", "ask for explicit installation request"]);

  assert.equal(valid.fixtureKind, "claude-hook-install-application-contract", "valid fixtureKind mismatch");
  assert.equal(valid.status, "eligible-for-application-review", "valid fixture status mismatch");
  assert.equal(valid.explicitInstallRequest, true, "valid fixture must have explicit install request");
  assert.equal(valid.agentMayApplySettings, false, "valid fixture must still not apply settings inside this repo");
  assert.equal(valid.requiresUserOwnedTarget, true, "valid fixture must require user-owned target");
  assert.ok(
    valid.requiredEvidence.includes("node benchmarks/scripts/check-claude-hook-user-approved-install-language.js"),
    "valid fixture must require user-approved install language evidence"
  );
  assert.ok(
    valid.requiredEvidence.includes("node benchmarks/scripts/check-claude-hook-settings-fragment-review.js"),
    "valid fixture must require settings-fragment review evidence"
  );

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-install-application-contract.md"),
      `${relativePath} must link docs/claude-hook-install-application-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-install-application-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-install-application-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-install-application-contract.js"),
      `${scriptName} must include check-claude-hook-install-application-contract.js`
    );
  }

  console.log("Claude hook install application contract check passed");
}

main();
