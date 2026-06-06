const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-execution-authorization-review-contract.md");
const validAuthorizationPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-authorization.valid-review-only.json"
);
const invalidMissingPacketPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-authorization.invalid-missing-packet.json"
);
const invalidAgentExecutedCommandsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-authorization.invalid-agent-executed-commands.json"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-execution-authorization.invalid-agent-applied-settings.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User Execution Authorization Review Contract",
  "user execution authorization review contract only",
  "user execution authorization review is not settings application",
  "Agent must not edit settings during user execution authorization review.",
  "Agent must not execute commands during user execution authorization review.",
  "A valid authorization review can only advance to user-performed application.",
  "user execution packet review required before authorization review",
  "user-performed application is outside this repository",
  "docs/claude-hook-user-execution-packet-review-contract.md",
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
  "hooks/claude/examples/user-execution-authorization.valid-review-only.json",
  "hooks/claude/examples/user-execution-authorization.invalid-missing-packet.json",
  "hooks/claude/examples/user-execution-authorization.invalid-agent-executed-commands.json",
  "hooks/claude/examples/user-execution-authorization.invalid-agent-applied-settings.json",
  "node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js",
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
  "docs/claude-hook-user-execution-packet-review-contract.md",
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
  const requiredFiles = [
    docPath,
    validAuthorizationPath,
    invalidMissingPacketPath,
    invalidAgentExecutedCommandsPath,
    invalidAppliedSettingsPath,
  ];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validAuthorization = readJson(validAuthorizationPath);
  const invalidMissingPacket = readJson(invalidMissingPacketPath);
  const invalidAgentExecutedCommands = readJson(invalidAgentExecutedCommandsPath);
  const invalidAppliedSettings = readJson(invalidAppliedSettingsPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user execution authorization review contract doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook user execution authorization review contract doc");

  assert.equal(validAuthorization.fixtureKind, "claude-hook-user-execution-authorization-review-contract", "valid fixtureKind mismatch");
  assert.equal(validAuthorization.status, "ready-for-user-performed-application", "valid authorization status mismatch");
  assert.equal(validAuthorization.sourceTextRole, "user-execution-authorization-review", "valid authorization source role mismatch");
  assert.equal(validAuthorization.userExecutionPacketReviewed, true, "valid authorization must review packet");
  assert.equal(validAuthorization.applicationPreflightReviewed, true, "valid authorization must review application preflight");
  assert.equal(validAuthorization.finalApplyRequestReviewed, true, "valid authorization must review final apply request");
  assert.equal(validAuthorization.userAuthorizationReviewed, true, "valid authorization must review user authorization");
  assert.equal(validAuthorization.executableCommandsPublished, false, "valid authorization must not publish executable commands");
  assert.equal(validAuthorization.agentExecutedCommands, false, "valid authorization must not execute commands");
  assert.equal(validAuthorization.agentMayApplySettings, false, "valid authorization must not allow settings application");
  assert.equal(validAuthorization.settingsMutationAttempted, false, "valid authorization must not mutate settings");
  assert.equal(validAuthorization.nextGate, "user-performed-application-only", "valid authorization next gate mismatch");
  assertEvidence(
    validAuthorization,
    [
      "node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js",
      "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js",
      "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
      "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
      "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
    ],
    "valid authorization"
  );

  assert.equal(
    invalidMissingPacket.fixtureKind,
    "claude-hook-user-execution-authorization-review-contract",
    "missing packet fixtureKind mismatch"
  );
  assert.equal(invalidMissingPacket.status, "blocked", "missing packet must block");
  assert.equal(invalidMissingPacket.userExecutionPacketReviewed, false, "missing packet fixture must omit packet review");
  assert.equal(
    invalidMissingPacket.reason,
    "user execution packet review required before authorization review",
    "missing packet reason mismatch"
  );
  assert.equal(invalidMissingPacket.agentMayApplySettings, false, "missing packet must not allow settings");

  assert.equal(
    invalidAgentExecutedCommands.fixtureKind,
    "claude-hook-user-execution-authorization-review-contract",
    "executed commands fixtureKind mismatch"
  );
  assert.equal(invalidAgentExecutedCommands.status, "blocked", "executed commands must block");
  assert.equal(invalidAgentExecutedCommands.agentExecutedCommands, true, "executed commands fixture must execute commands");
  assert.equal(
    invalidAgentExecutedCommands.reason,
    "user execution authorization review must not execute commands",
    "executed commands reason mismatch"
  );
  assert.equal(invalidAgentExecutedCommands.agentMayApplySettings, false, "executed commands must not allow settings");

  assert.equal(invalidAppliedSettings.fixtureKind, "claude-hook-user-execution-authorization-review-contract", "applied settings fixtureKind mismatch");
  assert.equal(invalidAppliedSettings.status, "blocked", "applied settings must block");
  assert.equal(invalidAppliedSettings.settingsMutationAttempted, true, "applied settings fixture must attempt mutation");
  assert.equal(invalidAppliedSettings.agentMayApplySettings, false, "applied settings must not allow settings");
  assert.equal(invalidAppliedSettings.reason, "user execution authorization review must not apply settings", "applied settings reason mismatch");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-execution-authorization-review-contract.md"),
      `${relativePath} must link docs/claude-hook-user-execution-authorization-review-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js"
      ),
      `${scriptName} must include check-claude-hook-user-execution-authorization-review-contract.js`
    );
  }

  console.log("Claude hook user execution authorization review contract check passed");
}

main();
