const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-execution-packet-review-contract.md");
const validPacketPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-packet.valid-review-only.json"
);
const invalidMissingPreflightPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-packet.invalid-missing-preflight.json"
);
const invalidExecutableCommandsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-packet.invalid-executable-commands.json"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-packet.invalid-agent-applied-settings.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User Execution Packet Review Contract",
  "user execution packet review contract only",
  "user execution packet review is not settings application",
  "Agent must not edit settings during user execution packet review.",
  "Agent must not publish executable commands during user execution packet review.",
  "A valid packet review can only advance to user execution authorization review.",
  "application preflight review required before user execution packet review",
  "manual execution packet remains review-only",
  "docs/claude-hook-application-preflight-review-contract.md",
  "docs/claude-hook-final-apply-request-contract.md",
  "docs/claude-hook-user-owned-target-review-decision.md",
  "docs/claude-hook-user-owned-target-review-packet.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "hooks/claude/examples/user-execution-packet.valid-review-only.json",
  "hooks/claude/examples/user-execution-packet.invalid-missing-preflight.json",
  "hooks/claude/examples/user-execution-packet.invalid-executable-commands.json",
  "hooks/claude/examples/user-execution-packet.invalid-agent-applied-settings.json",
  "node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js",
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
  "docs/claude-hook-application-preflight-review-contract.md",
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
  const requiredFiles = [docPath, validPacketPath, invalidMissingPreflightPath, invalidExecutableCommandsPath, invalidAppliedSettingsPath];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validPacket = readJson(validPacketPath);
  const invalidMissingPreflight = readJson(invalidMissingPreflightPath);
  const invalidExecutableCommands = readJson(invalidExecutableCommandsPath);
  const invalidAppliedSettings = readJson(invalidAppliedSettingsPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user execution packet review contract doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook user execution packet review contract doc");

  assert.equal(validPacket.fixtureKind, "claude-hook-user-execution-packet-review-contract", "valid fixtureKind mismatch");
  assert.equal(validPacket.status, "ready-for-user-execution-authorization-review", "valid packet status mismatch");
  assert.equal(validPacket.sourceTextRole, "user-execution-packet-review", "valid packet source role mismatch");
  assert.equal(validPacket.applicationPreflightReviewed, true, "valid packet must review application preflight");
  assert.equal(validPacket.finalApplyRequestReviewed, true, "valid packet must review final apply request");
  assert.equal(validPacket.targetReviewDecisionReviewed, true, "valid packet must review target decision");
  assert.equal(validPacket.backupEvidenceReviewed, true, "valid packet must review backup evidence");
  assert.equal(validPacket.settingsFragmentReviewReviewed, true, "valid packet must review settings fragment");
  assert.equal(validPacket.userApprovedInstallLanguageReviewed, true, "valid packet must review install language");
  assert.equal(validPacket.executableCommandsPublished, false, "valid packet must not publish executable commands");
  assert.equal(validPacket.agentMayApplySettings, false, "valid packet must not allow settings application");
  assert.equal(validPacket.settingsMutationAttempted, false, "valid packet must not mutate settings");
  assert.equal(validPacket.nextGate, "user-execution-authorization-review", "valid packet next gate mismatch");
  assertEvidence(
    validPacket,
    [
      "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js",
      "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
      "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
      "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
    ],
    "valid packet"
  );

  assert.equal(
    invalidMissingPreflight.fixtureKind,
    "claude-hook-user-execution-packet-review-contract",
    "missing preflight fixtureKind mismatch"
  );
  assert.equal(invalidMissingPreflight.status, "blocked", "missing preflight must block");
  assert.equal(invalidMissingPreflight.applicationPreflightReviewed, false, "missing preflight fixture must omit preflight review");
  assert.equal(
    invalidMissingPreflight.reason,
    "application preflight review required before user execution packet review",
    "missing preflight reason mismatch"
  );
  assert.equal(invalidMissingPreflight.agentMayApplySettings, false, "missing preflight must not allow settings");

  assert.equal(
    invalidExecutableCommands.fixtureKind,
    "claude-hook-user-execution-packet-review-contract",
    "executable commands fixtureKind mismatch"
  );
  assert.equal(invalidExecutableCommands.status, "blocked", "executable commands must block");
  assert.equal(invalidExecutableCommands.executableCommandsPublished, true, "executable commands fixture must publish commands");
  assert.equal(
    invalidExecutableCommands.reason,
    "user execution packet review must not publish executable commands",
    "executable commands reason mismatch"
  );
  assert.equal(invalidExecutableCommands.agentMayApplySettings, false, "executable commands must not allow settings");

  assert.equal(invalidAppliedSettings.fixtureKind, "claude-hook-user-execution-packet-review-contract", "applied settings fixtureKind mismatch");
  assert.equal(invalidAppliedSettings.status, "blocked", "applied settings must block");
  assert.equal(invalidAppliedSettings.settingsMutationAttempted, true, "applied settings fixture must attempt mutation");
  assert.equal(invalidAppliedSettings.agentMayApplySettings, false, "applied settings must not allow settings");
  assert.equal(invalidAppliedSettings.reason, "user execution packet review must not apply settings", "applied settings reason mismatch");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-execution-packet-review-contract.md"),
      `${relativePath} must link docs/claude-hook-user-execution-packet-review-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js"
      ),
      `${scriptName} must include check-claude-hook-user-execution-packet-review-contract.js`
    );
  }

  console.log("Claude hook user execution packet review contract check passed");
}

main();
