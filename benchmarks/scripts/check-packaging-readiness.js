const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "packaging-readiness.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Packaging Readiness Contract",
  "## Boundary",
  "## Candidate Surfaces",
  "## Minimum Installable Slice",
  "## Required Evidence",
  "## Explicit Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "not an installed hook",
  "not plugin packaging",
  "explicit runner input",
  "No raw private transcripts",
  "abk-runner scan",
  "docs/scanner-coverage-matrix.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "benchmarks/scripts/check-abk-runner-scan.js",
  "skills/boundary-check/SKILL.md",
  "templates/AGENTS.boundary.md",
  "templates/CLAUDE.boundary.md",
  "Codex skill",
  "Claude hook",
  "Do not build a dashboard",
  "Do not build a SaaS workflow",
  "Do not create a connector",
];

const hookSpecs = [
  "hooks/claude/pre-write-boundary-check.md",
  "hooks/claude/post-edit-scope-check.md",
  "hooks/claude/test-integrity-check.md",
  "hooks/claude/completion-evidence-check.md",
];

const scanners = [
  "parser-fallback-boundary-scan",
  "latex-renderer-boundary-scan",
  "legacy-surface-retention-scan",
  "phase-gate-plan-scan",
  "test-runtime-patch-scan",
  "completion-evidence-gate-scan",
  "noisy-log-root-cause-scan",
  "hardcoded-credential-fallback-scan",
  "test-fake-contract-scan",
  "untrusted-context-canary-scan",
];

const requiredLinks = [
  "README.md",
  "docs/enforcement-surfaces.md",
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
  assert(fs.existsSync(docPath), "docs/packaging-readiness.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert(markdown.includes(section), `packaging readiness doc missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `packaging readiness doc missing phrase: ${phrase}`);
  }

  for (const hookSpec of hookSpecs) {
    assert(markdown.includes(hookSpec), `packaging readiness doc missing hook spec: ${hookSpec}`);
  }

  for (const scanner of scanners) {
    assert(markdown.includes(scanner), `packaging readiness doc missing scanner: ${scanner}`);
  }

  for (const linkPath of requiredLinks) {
    const file = readRelative(linkPath);
    assert(file.includes("docs/packaging-readiness.md"), `${linkPath} must link docs/packaging-readiness.md`);
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-packaging-readiness.js"),
      `${scriptName} must include check-packaging-readiness.js`
    );
  }

  console.log(`packaging readiness check passed (${hookSpecs.length} hook specs, ${scanners.length} scanners)`);
}

main();
