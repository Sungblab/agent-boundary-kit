const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-approved-install-language.md");
const validLanguagePath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-approved-install-language.valid.md"
);
const invalidAgentAppliedPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-approved-install-language.invalid-agent-applied.md"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User-Approved Manual Install Language",
  "language-only",
  "user-approved",
  "not an installed hook",
  "not an installer",
  "not a setup script",
  "Agent must not edit settings.",
  "The user edits their own Claude Code settings after reviewing the fixture.",
  "abk-claude-hook-wrapper --carrier <user-owned-carrier-json>",
  "docs/claude-hook-settings-fragment-review.md",
  "hooks/claude/examples/settings-fragment-review.valid.json",
  "docs/claude-hook-wrapper-wiring-review.md",
  "docs/claude-hook-wrapper-implementation.md",
  "docs/claude-hook-native-command-input-contract.md",
  "hooks/claude/examples/user-approved-install-language.valid.md",
  "hooks/claude/examples/user-approved-install-language.invalid-agent-applied.md",
  "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
  "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/settings",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
  "Do not execute scanners from install language",
  "npm run bench:check",
  "npm run bench:check:red",
];

const requiredValidPhrases = [
  "# Valid Claude Hook User-Approved Manual Install Language",
  "manual approval only",
  "abk-claude-hook-wrapper --carrier <user-owned-carrier-json>",
  "docs/claude-hook-settings-fragment-review.md",
  "hooks/claude/examples/settings-fragment-review.valid.json",
  "docs/claude-hook-wrapper-wiring-review.md",
  "docs/claude-hook-wrapper-implementation.md",
  "benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
  "benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/settings",
  "command hook receives JSON on stdin",
  "The agent must not edit the settings file for the user.",
  "No raw private transcripts.",
  "No automatic hook installation.",
  "No repository mutation.",
];

const forbiddenSafeTextPhrases = [
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
  "postInstall",
  "installScript",
  "setupScript",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
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
  for (const filePath of [docPath, validLanguagePath, invalidAgentAppliedPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validLanguage = read(validLanguagePath);
  const invalidAgentApplied = read(invalidAgentAppliedPath);
  const packageJson = JSON.parse(read(packagePath));

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user-approved manual install language doc");
  assertExcludesAll(doc, forbiddenSafeTextPhrases, "user-approved manual install language doc");

  assertIncludesAll(validLanguage, requiredValidPhrases, "valid user-approved install language fixture");
  assertExcludesAll(validLanguage, forbiddenSafeTextPhrases, "valid user-approved install language fixture");

  assert.ok(invalidAgentApplied.includes("Set-Content"), "invalid fixture must include Set-Content");
  assert.ok(invalidAgentApplied.includes(".claude/settings.json"), "invalid fixture must include direct settings path");
  assert.ok(invalidAgentApplied.includes("Paste this into"), "invalid fixture must include paste instruction");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-approved-install-language.md"),
      `${relativePath} must link docs/claude-hook-user-approved-install-language.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-approved-install-language.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-approved-install-language.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-user-approved-install-language.js"),
      `${scriptName} must include check-claude-hook-user-approved-install-language.js`
    );
  }

  console.log("Claude hook user-approved manual install language check passed");
}

main();
