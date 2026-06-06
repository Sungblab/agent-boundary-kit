const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-manual-install-language-fixtures.md");
const validLanguagePath = path.join(root, "hooks", "claude", "examples", "manual-install-language.valid.md");
const invalidMutatingPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "manual-install-language.invalid-mutating.md"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Manual Install Language Fixtures",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-manual-install-review-packet.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "hooks/claude/examples/manual-install-language.valid.md",
  "hooks/claude/examples/manual-install-language.invalid-mutating.md",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "command hooks receive JSON on stdin",
  "Claude Code settings files",
  "manual approval only",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks in this repository",
  "Do not create or edit Claude configuration files from this repository",
  "Do not provide shell copy commands",
  "Do not execute scanners in the install language",
  "abk-claude-hook",
  "node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js",
  "node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-manual-install-document.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const requiredValidPhrases = [
  "# Valid Claude Hook Manual Install Language",
  "manual approval only",
  "abk-claude-hook",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-manual-install-review-packet.md",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "hooks/claude/examples/package-manifest.valid.json",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "command hook receives JSON on stdin",
  "The agent must not edit the settings file for the user.",
  "No raw private transcripts.",
  "No automatic hook installation.",
  "No repository mutation.",
];

const forbiddenValidPhrases = [
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "Set-Content",
  "Out-File",
  "Add-Content",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  "postInstall",
  "installScript",
  "autoInstall: true",
  "\"autoInstall\": true",
  "claude config",
  ".claude/settings",
  ".claude/settings.json",
  ".claude/settings.local.json",
  "Run this command",
  "Paste this command",
  "npm install -g",
  "npx ",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/installer.js",
  "hooks/claude/install.js",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install-doc-fixture.md",
  "docs/claude-hook-manual-install.md",
  "hooks/claude/README.md",
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

function main() {
  for (const filePath of [docPath, validLanguagePath, invalidMutatingPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validLanguage = read(validLanguagePath);
  const invalidMutating = read(invalidMutatingPath);
  const packageJson = JSON.parse(read(packagePath));

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook manual install language fixtures doc");
  assertIncludesAll(validLanguage, requiredValidPhrases, "valid manual install language fixture");

  for (const phrase of forbiddenValidPhrases) {
    assert.ok(!validLanguage.includes(phrase), `valid manual install language includes forbidden phrase: ${phrase}`);
  }

  assert.ok(invalidMutating.includes("Copy-Item"), "invalid mutating fixture must include Copy-Item");
  assert.ok(invalidMutating.includes(".claude/settings.json"), "invalid mutating fixture must include .claude/settings.json");
  assert.ok(invalidMutating.includes("Set-Content"), "invalid mutating fixture must include Set-Content");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-manual-install-language-fixtures.md"),
      `${relativePath} must link docs/claude-hook-manual-install-language-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-manual-install-language-fixtures.js`
    );
  }

  console.log("Claude hook manual install language fixtures check passed");
}

main();
