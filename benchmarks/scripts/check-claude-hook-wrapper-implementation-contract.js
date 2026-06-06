const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-wrapper-implementation-contract.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Wrapper Implementation Contract",
  "## Boundary",
  "## Preconditions",
  "## Allowed Wrapper Shape",
  "## Input Projection",
  "## Carrier Read Boundary",
  "## Output Contract",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "implementation contract only",
  "not implemented in this gate",
  "not an installed hook",
  "not an installer",
  "not live settings guidance",
  "candidate command is `abk-claude-hook-wrapper`",
  "candidate module is `lib/abk-claude-hook-wrapper.js`",
  "read native hook JSON from stdin only",
  "read one explicit user-owned sidecar JSON file only after user approval",
  "emit exactly one `native-payload-with-carrier` JSON object on stdout",
  "must not invoke `abk-claude-hook` in this gate",
  "must not make `abk-claude-hook` accept carrierPath or metadataCarrierPath",
  "must not execute scanners",
  "must not install hooks",
  "Do not read transcript_path",
  "Do not pass through session_id",
  "Do not infer task metadata from native stdin",
  "docs/claude-hook-wrapper-input-contract.md",
  "docs/claude-hook-wrapper-output-fixtures.md",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
  "hooks/claude/examples/wrapper-output.valid-envelope.json",
  "hooks/claude/examples/wrapper-output.invalid-transcript-derived.json",
  "hooks/claude/examples/wrapper-output.invalid-current-entrypoint-carrier-path.json",
  "https://code.claude.com/docs/en/hooks",
  "https://code.claude.com/docs/en/configuration",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
  "node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js",
  "node benchmarks/scripts/check-claude-hook-native-command-input-contract.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const forbiddenContractPhrases = [
  "Paste this into",
  "Run this command",
  ".claude/settings",
  ".claude/settings.json",
  ".claude/settings.local.json",
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "Set-Content",
  "Out-File",
  "Add-Content",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  "npm install -g",
  "npx ",
  "autoInstall: true",
  "\"autoInstall\": true",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-wrapper-input-contract.md",
  "docs/claude-hook-wrapper-output-fixtures.md",
  "docs/claude-hook-carrier-source-contract.md",
  "docs/claude-hook-native-command-input-contract.md",
  "docs/claude-hook-native-metadata-carrier-fixtures.md",
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
];

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function main() {
  assert.ok(fs.existsSync(docPath), "docs/claude-hook-wrapper-implementation-contract.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert.ok(markdown.includes(section), `Claude hook wrapper implementation contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert.ok(markdown.includes(phrase), `Claude hook wrapper implementation contract missing phrase: ${phrase}`);
  }

  for (const phrase of forbiddenContractPhrases) {
    assert.ok(!markdown.includes(phrase), `Claude hook wrapper implementation contract includes forbidden phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-wrapper-implementation-contract.md"),
      `${relativePath} must link docs/claude-hook-wrapper-implementation-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js"),
      `${scriptName} must include check-claude-hook-wrapper-implementation-contract.js`
    );
  }

  console.log("Claude hook wrapper implementation contract check passed");
}

main();
