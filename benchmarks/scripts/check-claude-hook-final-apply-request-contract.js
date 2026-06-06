const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-final-apply-request-contract.md");
const validRequestPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "final-apply-request.valid-explicit-final-request.json"
);
const invalidGenericContinuationPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "final-apply-request.invalid-generic-continuation.json"
);
const invalidMissingDecisionPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "final-apply-request.invalid-missing-decision.json"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "final-apply-request.invalid-agent-applied-settings.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Final Apply Request Contract",
  "final apply request contract only",
  "final apply request is not settings application",
  "Agent must not edit settings after recognizing a final apply request.",
  "A final apply request can only advance to application preflight review.",
  "generic continuation text is not a final apply request",
  "docs/claude-hook-user-owned-target-review-decision.md",
  "docs/claude-hook-user-owned-target-review-packet.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "hooks/claude/examples/final-apply-request.valid-explicit-final-request.json",
  "hooks/claude/examples/final-apply-request.invalid-generic-continuation.json",
  "hooks/claude/examples/final-apply-request.invalid-missing-decision.json",
  "hooks/claude/examples/final-apply-request.invalid-agent-applied-settings.json",
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
  const requiredFiles = [docPath, validRequestPath, invalidGenericContinuationPath, invalidMissingDecisionPath, invalidAppliedSettingsPath];
  for (const filePath of requiredFiles) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validRequest = readJson(validRequestPath);
  const invalidGenericContinuation = readJson(invalidGenericContinuationPath);
  const invalidMissingDecision = readJson(invalidMissingDecisionPath);
  const invalidAppliedSettings = readJson(invalidAppliedSettingsPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook final apply request contract doc");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook final apply request contract doc");

  assert.equal(validRequest.fixtureKind, "claude-hook-final-apply-request-contract", "valid fixtureKind mismatch");
  assert.equal(validRequest.status, "eligible-for-application-preflight-review", "valid request status mismatch");
  assert.equal(validRequest.sourceTextRole, "final-apply-request", "valid request source role mismatch");
  assert.equal(validRequest.finalUserApplyRequestPresent, true, "valid request must include final apply request");
  assert.equal(validRequest.priorDecisionReviewed, true, "valid request must review prior decision");
  assert.equal(validRequest.packetReviewed, true, "valid request must review packet");
  assert.equal(validRequest.targetReviewEvidenceReviewed, true, "valid request must review evidence");
  assert.equal(validRequest.agentMayApplySettings, false, "valid request must not allow settings application");
  assert.equal(validRequest.settingsMutationAttempted, false, "valid request must not mutate settings");
  assert.equal(validRequest.nextGate, "application-preflight-review", "valid request next gate mismatch");
  assertEvidence(
    validRequest,
    [
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
      "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
    ],
    "valid request"
  );

  assert.equal(
    invalidGenericContinuation.fixtureKind,
    "claude-hook-final-apply-request-contract",
    "generic continuation fixtureKind mismatch"
  );
  assert.equal(invalidGenericContinuation.status, "blocked", "generic continuation must block");
  assert.equal(invalidGenericContinuation.sourceTextRole, "workflow-command", "generic continuation role mismatch");
  assert.equal(invalidGenericContinuation.finalUserApplyRequestPresent, false, "generic continuation must not be apply request");
  assert.equal(
    invalidGenericContinuation.reason,
    "generic continuation text is not a final apply request",
    "generic continuation reason mismatch"
  );
  assert.equal(invalidGenericContinuation.agentMayApplySettings, false, "generic continuation must not allow settings");

  assert.equal(invalidMissingDecision.fixtureKind, "claude-hook-final-apply-request-contract", "missing decision fixtureKind mismatch");
  assert.equal(invalidMissingDecision.status, "blocked", "missing decision must block");
  assert.equal(invalidMissingDecision.priorDecisionReviewed, false, "missing decision fixture must omit prior decision");
  assert.equal(invalidMissingDecision.reason, "target review decision required before final apply request", "missing decision reason mismatch");
  assert.equal(invalidMissingDecision.agentMayApplySettings, false, "missing decision must not allow settings");

  assert.equal(invalidAppliedSettings.fixtureKind, "claude-hook-final-apply-request-contract", "applied settings fixtureKind mismatch");
  assert.equal(invalidAppliedSettings.status, "blocked", "applied settings must block");
  assert.equal(invalidAppliedSettings.settingsMutationAttempted, true, "applied settings fixture must attempt mutation");
  assert.equal(invalidAppliedSettings.agentMayApplySettings, false, "applied settings must not allow settings");
  assert.equal(invalidAppliedSettings.reason, "final apply request must not apply settings", "applied settings reason mismatch");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-final-apply-request-contract.md"),
      `${relativePath} must link docs/claude-hook-final-apply-request-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-final-apply-request-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-final-apply-request-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js"
      ),
      `${scriptName} must include check-claude-hook-final-apply-request-contract.js`
    );
  }

  console.log("Claude hook final apply request contract check passed");
}

main();
