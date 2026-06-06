const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const matrixPath = path.join(root, "docs", "scanner-coverage-matrix.md");
const manifestPath = path.join(root, "benchmarks", "fixture-manifest.json");

const expectedCoverage = [
  {
    fixture: "parser-fallback-before-root-cause",
    scanner: "parser-fallback-boundary-scan",
    script: "benchmarks/scripts/scan-parser-fallback-boundary.js",
    validation: "docs/scanner-validation-parser-fallback-boundary.md",
    application: "docs/scanner-application-parser-fallback-boundary.md",
  },
  {
    fixture: "latex-pdf-tool-boundary",
    scanner: "latex-renderer-boundary-scan",
    script: "benchmarks/scripts/scan-latex-renderer-boundary.js",
    validation: "docs/scanner-validation-latex-renderer-boundary.md",
    application: "docs/scanner-application-latex-renderer-boundary.md",
  },
  {
    fixture: "replacement-leaves-legacy-paths",
    scanner: "legacy-surface-retention-scan",
    script: "benchmarks/scripts/scan-legacy-surface-retention.js",
    validation: "docs/scanner-validation-legacy-surface-retention.md",
    application: "docs/scanner-application-legacy-surface-retention.md",
  },
  {
    fixture: "overengineering-collusion",
    scanner: "phase-gate-plan-scan",
    script: "benchmarks/scripts/scan-phase-gate-plan.js",
    validation: "docs/scanner-validation-phase-gate-plan.md",
    application: "docs/scanner-application-phase-gate-plan.md",
  },
  {
    fixture: "e2e-test-runtime-patch",
    scanner: "test-runtime-patch-scan",
    script: "benchmarks/scripts/scan-test-runtime-patch.js",
    validation: "docs/scanner-validation-test-runtime-patch.md",
    application: "docs/scanner-application-test-runtime-patch.md",
  },
  {
    fixture: "release-gate-before-completion",
    scanner: "completion-evidence-gate-scan",
    script: "benchmarks/scripts/scan-completion-evidence-gate.js",
    validation: "docs/scanner-validation-completion-evidence-gate.md",
    application: "docs/scanner-application-completion-evidence-gate.md",
  },
  {
    fixture: "wrong-cause-rate-limit-noise",
    scanner: "noisy-log-root-cause-scan",
    script: "benchmarks/scripts/scan-noisy-log-root-cause.js",
    validation: "docs/scanner-validation-noisy-log-root-cause.md",
    application: "docs/scanner-application-noisy-log-root-cause.md",
  },
  {
    fixture: "hardcoded-fallback-secret",
    scanner: "hardcoded-credential-fallback-scan",
    script: "benchmarks/scripts/scan-hardcoded-credential-fallback.js",
    validation: "docs/scanner-validation-hardcoded-credential-fallback.md",
    application: "docs/scanner-application-hardcoded-credential-fallback.md",
  },
  {
    fixture: "model-instruction-hardcoded-default",
    scanner: "guidance-to-code-leakage-scan",
    script: "benchmarks/scripts/scan-guidance-to-code-leakage.js",
    validation: "docs/scanner-validation-guidance-to-code-leakage.md",
    application: "docs/scanner-application-guidance-to-code-leakage.md",
  },
  {
    fixture: "bad-test-fake-precedence",
    scanner: "test-fake-contract-scan",
    script: "benchmarks/scripts/scan-test-fake-contract.js",
    validation: "docs/scanner-validation-test-fake-contract.md",
    application: "docs/scanner-application-test-integrity.md",
  },
  {
    fixture: "untrusted-issue-comment-canary",
    scanner: "untrusted-context-canary-scan",
    script: "benchmarks/scripts/scan-untrusted-context-canary.js",
    validation: "docs/scanner-validation-untrusted-context-canary.md",
    application: "docs/scanner-application-untrusted-context-canary.md",
  },
  {
    fixture: "approved-file-mask-scope",
    scanner: "approved-file-mask-scan",
    script: "benchmarks/scripts/scan-approved-file-mask-scope.js",
    validation: "docs/scanner-validation-approved-file-mask-scope.md",
    application: "docs/scanner-application-approved-file-mask-scope.md",
  },
];

const unpromotedFixtures = [
  {
    fixture: "research-mode-no-write",
    source: "research/public-case-index.md#case-22",
    phrase: "Mechanical green evidence is recorded; still needs a fresh passing closed-rubric or reviewed green run before considering a research-mode no-write scanner.",
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  assert(fs.existsSync(matrixPath), "docs/scanner-coverage-matrix.md is missing");

  const markdown = fs.readFileSync(matrixPath, "utf8");
  const manifest = readJson(manifestPath);
  const manifestIds = manifest.fixtures.map((fixture) => fixture.id).sort();
  const coverageIds = expectedCoverage
    .map((item) => item.fixture)
    .concat(unpromotedFixtures.map((item) => item.fixture))
    .sort();

  assert(
    JSON.stringify(manifestIds) === JSON.stringify(coverageIds),
    `expected coverage fixture ids must match manifest\nmanifest=${manifestIds.join(",")}\ncoverage=${coverageIds.join(",")}`
  );

  assert(markdown.includes("# Scanner Coverage Matrix"), "matrix must have # Scanner Coverage Matrix heading");
  assert(markdown.includes("## Fixture Coverage"), "matrix must have ## Fixture Coverage section");
  assert(markdown.includes("## Unpromoted Fixture Queue"), "matrix must have ## Unpromoted Fixture Queue section");
  assert(markdown.includes("## Promotion Decisions"), "matrix must have ## Promotion Decisions section");
  assert(markdown.includes("## Packaging Boundary"), "matrix must have ## Packaging Boundary section");

  for (const item of expectedCoverage) {
    for (const value of [item.fixture, item.scanner, item.script, item.validation, item.application]) {
      assert(markdown.includes(value), `matrix missing ${value}`);
    }
  }

  for (const item of unpromotedFixtures) {
    for (const value of [item.fixture, item.source, item.phrase]) {
      assert(markdown.includes(value), `matrix missing unpromoted fixture evidence: ${value}`);
    }
  }

  for (const phrase of [
    "Do not package hooks yet",
    "AGENTS.md",
    "CLAUDE.md",
    "Codex skill",
    "Claude hook",
  ]) {
    assert(markdown.includes(phrase), `matrix missing promotion phrase: ${phrase}`);
  }

  console.log(
    `scanner coverage matrix check passed (${expectedCoverage.length} promoted fixtures, ${unpromotedFixtures.length} unpromoted fixtures)`
  );
}

main();
