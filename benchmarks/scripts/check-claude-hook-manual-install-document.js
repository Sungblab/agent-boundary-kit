const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-manual-install.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Manual Install",
  "## Status",
  "## Source Evidence",
  "## Current Boundary",
  "## Blocked Settings Fragment",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "user-approved manual install document",
  "blocked for live installation",
  "native Claude Code hook payload compatibility is not proven",
  "current adapter expects ABK hook event fields",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "docs/claude-hook-event-input-contract.md",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "command hooks receive JSON on stdin",
  "Claude Code settings files",
  "reviewed settings fragment is intentionally blocked",
  "Do not paste a live settings fragment yet",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not run shell copy commands",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "node benchmarks/scripts/check-claude-hook-manual-install-document.js",
  "node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const forbiddenDocPhrases = [
  '"hooks": {',
  '"PostToolUse"',
  '"PreToolUse"',
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
  "Paste this into",
  "Run this command",
  "claude config",
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
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "hooks/claude/README.md",
];

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function main() {
  assert.ok(fs.existsSync(docPath), "docs/claude-hook-manual-install.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert.ok(markdown.includes(section), `Claude hook manual install document missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert.ok(markdown.includes(phrase), `Claude hook manual install document missing phrase: ${phrase}`);
  }

  for (const phrase of forbiddenDocPhrases) {
    assert.ok(!markdown.includes(phrase), `Claude hook manual install document includes forbidden phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-manual-install.md"),
      `${relativePath} must link docs/claude-hook-manual-install.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-manual-install-document.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-manual-install-document.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-manual-install-document.js"),
      `${scriptName} must include check-claude-hook-manual-install-document.js`
    );
  }

  console.log("Claude hook manual install document check passed");
}

main();
