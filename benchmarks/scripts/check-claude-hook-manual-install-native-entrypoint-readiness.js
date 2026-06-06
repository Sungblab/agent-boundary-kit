const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-manual-install.md");
const contractPath = path.join(root, "docs", "claude-hook-manual-install-contract.md");
const languagePath = path.join(root, "docs", "claude-hook-manual-install-language-fixtures.md");
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Manual Install",
  "Status: ready for user-approved manual install language review.",
  "Blocked for agent-performed installation.",
  "Do not paste a live settings fragment yet.",
  "native command entrypoint evidence is proven",
  "current adapter accepts ABK hook event fields and native payload envelopes with metadataCarrier",
  "metadataCarrier is required",
  "docs/claude-hook-native-command-input-contract.md",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "native-payload-with-carrier",
  "No live hook settings fragment is published",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not run shell copy commands",
];

const requiredContractPhrases = [
  "docs/claude-hook-native-command-input-contract.md",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "manual install document records native command entrypoint evidence",
  "blocked for agent-performed installation",
];

const requiredLanguagePhrases = [
  "docs/claude-hook-native-command-input-contract.md",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "native command entrypoint evidence",
];

const forbiddenPhrases = [
  "native Claude Code hook payload compatibility is not proven",
  "current adapter expects ABK hook event fields",
  "Reason: the current adapter is verified against ABK hook event fixtures",
  "must first prove that native Claude Code hook stdin can be mapped",
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

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "docs/claude-hook-native-command-input-contract.md",
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

function assertIncludesAll(markdown, phrases, label) {
  for (const phrase of phrases) {
    assert.ok(markdown.includes(phrase), `${label} missing phrase: ${phrase}`);
  }
}

function main() {
  for (const filePath of [docPath, contractPath, languagePath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  const contract = fs.readFileSync(contractPath, "utf8");
  const language = fs.readFileSync(languagePath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook manual install native readiness doc");
  assertIncludesAll(contract, requiredContractPhrases, "Claude hook manual install contract");
  assertIncludesAll(language, requiredLanguagePhrases, "Claude hook manual install language fixtures");

  for (const phrase of forbiddenPhrases) {
    assert.ok(!doc.includes(phrase), `Claude hook manual install doc includes stale or forbidden phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js"
      ),
      `${scriptName} must include check-claude-hook-manual-install-native-entrypoint-readiness.js`
    );
  }

  console.log("Claude hook manual install native entrypoint readiness check passed");
}

main();
