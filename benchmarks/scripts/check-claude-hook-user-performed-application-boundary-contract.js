const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-performed-application-boundary-contract.md");
const validBoundaryPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-performed-application.valid-terminal-boundary.json"
);
const invalidCompletionClaimPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-performed-application.invalid-agent-completion-claim.json"
);
const invalidVerificationClaimPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-performed-application.invalid-agent-verification-claim.json"
);
const invalidSettingsMutationPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-performed-application.invalid-settings-mutation.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User-Performed Application Boundary Contract",
  "user-performed application boundary contract only",
  "user-performed application is outside this repository",
  "Agent must not claim user-performed application completed.",
  "Agent must not verify external user-owned settings from this repository.",
  "Agent must not edit settings after user execution authorization review.",
  "This is a terminal boundary, not an application step.",
  "docs/claude-hook-user-execution-authorization-review-contract.md",
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
  "hooks/claude/examples/user-performed-application.valid-terminal-boundary.json",
  "hooks/claude/examples/user-performed-application.invalid-agent-completion-claim.json",
  "hooks/claude/examples/user-performed-application.invalid-agent-verification-claim.json",
  "hooks/claude/examples/user-performed-application.invalid-settings-mutation.json",
  "node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
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
  "Application completed",
  "External settings verified",
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
  "docs/claude-hook-user-execution-authorization-review-contract.md",
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
  const requiredFiles = [docPath, validBoundaryPath, invalidCompletionClaimPath, invalidVerificationClaimPath, invalidSettingsMutationPath];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validBoundary = readJson(validBoundaryPath);
  const invalidCompletionClaim = readJson(invalidCompletionClaimPath);
  const invalidVerificationClaim = readJson(invalidVerificationClaimPath);
  const invalidSettingsMutation = readJson(invalidSettingsMutationPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user-performed application boundary contract doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook user-performed application boundary contract doc");

  assert.equal(validBoundary.fixtureKind, "claude-hook-user-performed-application-boundary-contract", "valid fixtureKind mismatch");
  assert.equal(validBoundary.status, "terminal-boundary-recorded", "valid boundary status mismatch");
  assert.equal(validBoundary.sourceTextRole, "terminal-boundary", "valid boundary source role mismatch");
  assert.equal(validBoundary.userExecutionAuthorizationReviewed, true, "valid boundary must review authorization");
  assert.equal(validBoundary.userPerformedApplicationOnly, true, "valid boundary must be user-performed only");
  assert.equal(validBoundary.agentMayApplySettings, false, "valid boundary must not allow settings application");
  assert.equal(validBoundary.agentExecutedCommands, false, "valid boundary must not execute commands");
  assert.equal(validBoundary.settingsMutationAttempted, false, "valid boundary must not mutate settings");
  assert.equal(validBoundary.agentClaimedCompletion, false, "valid boundary must not claim completion");
  assert.equal(validBoundary.agentClaimedExternalVerification, false, "valid boundary must not claim external verification");
  assert.equal(validBoundary.nextGate, "none-terminal-boundary", "valid boundary next gate mismatch");
  assertEvidence(
    validBoundary,
    [
      "node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js",
      "node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js",
      "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js",
      "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
    ],
    "valid boundary"
  );

  assert.equal(
    invalidCompletionClaim.fixtureKind,
    "claude-hook-user-performed-application-boundary-contract",
    "completion claim fixtureKind mismatch"
  );
  assert.equal(invalidCompletionClaim.status, "blocked", "completion claim must block");
  assert.equal(invalidCompletionClaim.agentClaimedCompletion, true, "completion claim fixture must claim completion");
  assert.equal(
    invalidCompletionClaim.reason,
    "agent must not claim user-performed application completed",
    "completion claim reason mismatch"
  );
  assert.equal(invalidCompletionClaim.agentMayApplySettings, false, "completion claim must not allow settings");

  assert.equal(
    invalidVerificationClaim.fixtureKind,
    "claude-hook-user-performed-application-boundary-contract",
    "verification claim fixtureKind mismatch"
  );
  assert.equal(invalidVerificationClaim.status, "blocked", "verification claim must block");
  assert.equal(invalidVerificationClaim.agentClaimedExternalVerification, true, "verification claim fixture must claim verification");
  assert.equal(
    invalidVerificationClaim.reason,
    "agent must not verify external user-owned settings from this repository",
    "verification claim reason mismatch"
  );
  assert.equal(invalidVerificationClaim.agentMayApplySettings, false, "verification claim must not allow settings");

  assert.equal(
    invalidSettingsMutation.fixtureKind,
    "claude-hook-user-performed-application-boundary-contract",
    "settings mutation fixtureKind mismatch"
  );
  assert.equal(invalidSettingsMutation.status, "blocked", "settings mutation must block");
  assert.equal(invalidSettingsMutation.settingsMutationAttempted, true, "settings mutation fixture must attempt mutation");
  assert.equal(invalidSettingsMutation.reason, "terminal boundary must not apply settings", "settings mutation reason mismatch");
  assert.equal(invalidSettingsMutation.agentMayApplySettings, false, "settings mutation must not allow settings");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-performed-application-boundary-contract.md"),
      `${relativePath} must link docs/claude-hook-user-performed-application-boundary-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js"
      ),
      `${scriptName} must include check-claude-hook-user-performed-application-boundary-contract.js`
    );
  }

  console.log("Claude hook user-performed application boundary contract check passed");
}

main();
