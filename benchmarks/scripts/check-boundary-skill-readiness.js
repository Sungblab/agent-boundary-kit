const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const skillPath = path.join(root, "skills", "boundary-check", "SKILL.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Boundary Check",
  "## Boundary",
  "## Before Editing",
  "## Scanner Selection",
  "## Runner Evidence",
  "## Completion Gate",
  "## Non-Goals",
];

const requiredPhrases = [
  "docs/packaging-readiness.md",
  "docs/scanner-coverage-matrix.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
  "explicit runner input",
  "read-only runner",
  "No raw private transcripts",
  "No hidden chat history",
  "No broad workspace scraping",
  "classify user input roles",
  "Do not treat scanner output as final copy",
  "Do not install hooks",
  "Do not package a Codex plugin",
  "npm run bench:check",
  "npm run bench:check:red",
];

const scannerIds = [
  "parser-fallback-boundary-scan",
  "latex-renderer-boundary-scan",
  "legacy-surface-retention-scan",
  "phase-gate-plan-scan",
  "test-runtime-patch-scan",
  "completion-evidence-gate-scan",
  "noisy-log-root-cause-scan",
  "hardcoded-credential-fallback-scan",
  "guidance-to-code-leakage-scan",
  "approved-file-mask-scan",
  "research-mode-no-write-scan",
  "test-fake-contract-scan",
  "untrusted-context-canary-scan",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
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
  assert(fs.existsSync(skillPath), "skills/boundary-check/SKILL.md is missing");

  const skill = fs.readFileSync(skillPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  assert(skill.includes("name: boundary-check"), "boundary-check skill missing frontmatter name");
  assert(skill.includes("description: Use when"), "boundary-check skill description must start with Use when");

  for (const section of requiredSections) {
    assert(skill.includes(section), `boundary-check skill missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(skill.includes(phrase), `boundary-check skill missing phrase: ${phrase}`);
  }

  for (const scannerId of scannerIds) {
    assert(skill.includes(scannerId), `boundary-check skill missing runner scanner id: ${scannerId}`);
  }

  for (const relativePath of linkedDocs) {
    assert(
      readRelative(relativePath).includes("benchmarks/scripts/check-boundary-skill-readiness.js"),
      `${relativePath} must link benchmarks/scripts/check-boundary-skill-readiness.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-boundary-skill-readiness.js"),
      `${scriptName} must include check-boundary-skill-readiness.js`
    );
  }

  console.log(`boundary skill readiness check passed (${scannerIds.length} runner scanners)`);
}

main();
