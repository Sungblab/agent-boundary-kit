const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-manual-install-contract.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Manual Install Contract",
  "## Boundary",
  "## Preconditions",
  "## Allowed Manual Install Language",
  "## Configuration Mutation Boundary",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "manual contract only",
  "not an installed hook",
  "not an installer",
  "not hook setup guidance",
  "explicit user request",
  "user-approved manual installation language",
  "docs/claude-hook-packaging-contract.md",
  "docs/claude-hook-package-manifest-fixtures.md",
  "docs/claude-hook-manual-install-doc-fixture.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-command-adapter-fixtures.md",
  "docs/packaging-readiness.md",
  "hooks/claude/examples/package-manifest.valid.json",
  "benchmarks/scripts/check-claude-hook-manual-install-contract.js",
  "benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js",
  "benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js",
  "benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js",
  "benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js",
  "benchmarks/scripts/check-claude-hook-packaging-contract.js",
  "abk-runner map-event --input <hook-event.json>",
  "abk-runner dry-run --input <runner-input.json>",
  "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
  "No raw private transcripts",
  "No hidden chat history",
  "No prompt text",
  "No message arrays",
  "No repository mutation",
  "No automatic hook installation",
  "Do not install Claude hooks yet",
  "Do not publish copy commands yet",
  "Do not create or edit Claude configuration files",
  "Do not add installer code",
  "Do not execute scanners before map-event succeeds",
  "Do not generate final copy",
  "manual install document records native command entrypoint evidence",
  "blocked for agent-performed installation",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-packaging-contract.md",
  "docs/claude-hook-package-manifest-fixtures.md",
  "docs/claude-hook-manual-install-doc-fixture.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "hooks/claude/README.md",
];

const forbiddenContractPhrases = [
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  ".claude/settings",
  ".claude/settings.json",
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

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function main() {
  assert.ok(fs.existsSync(docPath), "docs/claude-hook-manual-install-contract.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert.ok(markdown.includes(section), `Claude hook manual install contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert.ok(markdown.includes(phrase), `Claude hook manual install contract missing phrase: ${phrase}`);
  }

  for (const phrase of forbiddenContractPhrases) {
    assert.ok(!markdown.includes(phrase), `Claude hook manual install contract includes forbidden phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-manual-install-contract.md"),
      `${relativePath} must link docs/claude-hook-manual-install-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-manual-install-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-manual-install-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-manual-install-contract.js"),
      `${scriptName} must include check-claude-hook-manual-install-contract.js`
    );
  }

  console.log("Claude hook manual install contract check passed");
}

main();
