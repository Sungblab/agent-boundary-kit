const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const planPath = path.join(root, "docs", "hook-runner-minimal-plan.md");

const requiredSections = [
  "# Hook Runner Minimal Plan",
  "## Boundary",
  "## Runner Inputs",
  "## Execution Order",
  "## Hook And Scanner Mapping",
  "## Evidence Gate",
  "## Non-Goals",
];

const requiredPhrases = [
  "not an installed hook",
  "explicit file or repo paths",
  "declared metadata",
  "No raw private transcripts",
  "No hidden chat history",
  "Exit 0",
  "Exit 1",
  "Exit 2",
  "docs/hook-scanner-contracts.md",
  "docs/scanner-coverage-matrix.md",
  "Do not package hooks yet",
];

const hookSpecs = [
  "hooks/claude/pre-write-boundary-check.md",
  "hooks/claude/post-edit-scope-check.md",
  "hooks/claude/test-integrity-check.md",
  "hooks/claude/completion-evidence-check.md",
];

const scannerScripts = [
  "benchmarks/scripts/scan-parser-fallback-boundary.js",
  "benchmarks/scripts/scan-latex-renderer-boundary.js",
  "benchmarks/scripts/scan-legacy-surface-retention.js",
  "benchmarks/scripts/scan-phase-gate-plan.js",
  "benchmarks/scripts/scan-test-runtime-patch.js",
  "benchmarks/scripts/scan-completion-evidence-gate.js",
  "benchmarks/scripts/scan-noisy-log-root-cause.js",
  "benchmarks/scripts/scan-hardcoded-credential-fallback.js",
  "benchmarks/scripts/scan-guidance-to-code-leakage.js",
  "benchmarks/scripts/scan-approved-file-mask-scope.js",
  "benchmarks/scripts/scan-test-fake-contract.js",
  "benchmarks/scripts/scan-untrusted-context-canary.js",
];

const requiredLinks = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/hook-scanner-contracts.md",
  "docs/next-session-prompt.md",
  "hooks/claude/README.md",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function main() {
  assert(fs.existsSync(planPath), "docs/hook-runner-minimal-plan.md is missing");

  const markdown = fs.readFileSync(planPath, "utf8");

  for (const section of requiredSections) {
    assert(markdown.includes(section), `hook runner plan missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `hook runner plan missing phrase: ${phrase}`);
  }

  for (const hookSpec of hookSpecs) {
    assert(markdown.includes(hookSpec), `hook runner plan missing hook spec: ${hookSpec}`);
  }

  for (const scannerScript of scannerScripts) {
    assert(markdown.includes(scannerScript), `hook runner plan missing scanner: ${scannerScript}`);
  }

  for (const linkPath of requiredLinks) {
    const file = readRelative(linkPath);
    assert(file.includes("docs/hook-runner-minimal-plan.md"), `${linkPath} must link docs/hook-runner-minimal-plan.md`);
  }

  console.log(`hook runner minimal plan check passed (${hookSpecs.length} hook specs, ${scannerScripts.length} scanners)`);
}

main();
