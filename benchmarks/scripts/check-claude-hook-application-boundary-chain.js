const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-application-boundary-chain.md");
const packagePath = path.join(root, "package.json");

const chainDocs = [
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-review-packet.md",
  "docs/claude-hook-user-owned-target-review-decision.md",
  "docs/claude-hook-final-apply-request-contract.md",
  "docs/claude-hook-application-preflight-review-contract.md",
  "docs/claude-hook-user-execution-packet-review-contract.md",
  "docs/claude-hook-user-execution-authorization-review-contract.md",
  "docs/claude-hook-user-performed-application-boundary-contract.md",
];

const chainCheckers = [
  "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js",
  "node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js",
  "node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js",
];

const requiredDocPhrases = [
  "# Claude Hook Application Boundary Chain",
  "application boundary chain only",
  "The chain is non-mutating from install application review through terminal boundary.",
  "The terminal state is user-performed application outside this repository.",
  "No gate in this chain installs hooks, edits settings, executes commands, or claims external verification.",
  "No next repository gate exists after the terminal boundary.",
  "explicit install request",
  "user-owned target review",
  "target review evidence",
  "target review packet",
  "target review decision",
  "final apply request",
  "application preflight review",
  "user execution packet review",
  "user execution authorization review",
  "user-performed application boundary",
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

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-user-performed-application-boundary-contract.md",
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

function assertInOrder(markdown, phrases, label) {
  let previousIndex = -1;
  for (const phrase of phrases) {
    const index = markdown.indexOf(phrase);
    assert.ok(index > previousIndex, `${label} must list ${phrase} after previous chain item`);
    previousIndex = index;
  }
}

function main() {
  assert.ok(fs.existsSync(docPath), "docs/claude-hook-application-boundary-chain.md is missing");

  const doc = read(docPath);
  const packageJson = readJson(packagePath);

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook application boundary chain doc");
  assertIncludesAll(doc, chainDocs, "Claude hook application boundary chain docs");
  assertIncludesAll(doc, chainCheckers, "Claude hook application boundary chain checkers");
  assertExcludesAll(doc, forbiddenDocPhrases, "Claude hook application boundary chain doc");
  assertInOrder(doc, chainDocs, "Claude hook application boundary chain docs");
  assertInOrder(doc, chainCheckers, "Claude hook application boundary chain checkers");

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-application-boundary-chain.md"),
      `${relativePath} must link docs/claude-hook-application-boundary-chain.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-application-boundary-chain.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-application-boundary-chain.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-application-boundary-chain.js"),
      `${scriptName} must include check-claude-hook-application-boundary-chain.js`
    );
  }

  console.log("Claude hook application boundary chain check passed");
}

main();
