const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "research-mode-no-write-green-evidence-gate.md");
const calibrationPath = path.join(root, "docs", "calibration-runs.md");
const backlogPath = path.join(root, "docs", "benchmark-backlog.md");
const coveragePath = path.join(root, "docs", "scanner-coverage-matrix.md");
const nextPromptPath = path.join(root, "docs", "next-session-prompt.md");
const packagePath = path.join(root, "package.json");

const promotedScannerArtifacts = [
  "benchmarks/scripts/scan-research-mode-no-write.js",
  "benchmarks/scripts/check-research-mode-no-write-scan.js",
  "docs/scanner-validation-research-mode-no-write.md",
  "docs/scanner-application-research-mode-no-write.md",
  "hooks/claude/examples/runner-scan.research-mode-no-write-finding-input.json",
  "hooks/claude/examples/runner-scan.research-mode-no-write-clear-input.json",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assertIncludes(markdown, phrase, label) {
  assert(markdown.includes(phrase), `${label} missing required phrase: ${phrase}`);
}

function assertExcludes(markdown, phrases, label) {
  for (const phrase of phrases) {
    assert(!markdown.includes(phrase), `${label} must not include forbidden phrase: ${phrase}`);
  }
}

function main() {
  assert(fs.existsSync(docPath), "docs/research-mode-no-write-green-evidence-gate.md is missing");

  const doc = read(docPath);
  const calibration = read(calibrationPath);
  const backlog = read(backlogPath);
  const coverage = read(coveragePath);
  const nextPrompt = read(nextPromptPath);
  const pkg = JSON.parse(read(packagePath));

  for (const phrase of [
    "# Research Mode No Write Green Evidence Gate",
    "Fixture: `research-mode-no-write`",
    "This note is now historical evidence for the scanner validation.",
    "This is not a hook package.",
    "Mechanical green smoke",
    "Remove only `repo/reports/research-summary.md` in a temporary copied fixture repo.",
    "`npm test` exit 0",
    "`node ../verify.js` exit 0",
    "research-mode-no-write verifier passed",
    "Scored fail evidence",
    "`benchmarks/results/research-mode-no-write-codex-cli-0.135.0-closed-001.md`",
    "## Fresh Passing Evidence State",
    "Current status: satisfied.",
    "`benchmarks/results/research-mode-no-write-codex-cli-0.135.0-closed-002.md`",
    "The scanner candidate is no longer blocked by missing green evidence.",
    "`research-mode-no-write-scan` command and exit status in scanner evidence",
    "## Promoted Scanner Artifacts",
    "No raw private transcripts.",
    "No broad workspace scans.",
  ]) {
    assertIncludes(doc, phrase, "green evidence gate doc");
  }

  assertExcludes(doc, [
    "C:\\Users\\",
    "file://",
    "install hook",
    "package a hook",
    "connector",
    "dashboard",
  ], "green evidence gate doc");

  assertIncludes(calibration, "research-mode-no-write", "calibration runs");
  assertIncludes(calibration, "Mechanical green smoke", "calibration runs");
  assertIncludes(
    backlog,
    "84. Run a fresh passing closed-rubric or reviewed green run for `research-mode-no-write` before considering any research-mode no-write scanner. Completed as scored pass: `benchmarks/results/research-mode-no-write-codex-cli-0.135.0-closed-002.md`.",
    "benchmark backlog"
  );
  assertIncludes(backlog, "docs/research-mode-no-write-green-evidence-gate.md", "benchmark backlog");
  assertIncludes(coverage, "research-mode-no-write-scan", "scanner coverage matrix");
  assertIncludes(nextPrompt, "docs/research-mode-no-write-green-evidence-gate.md", "next-session prompt");
  assertIncludes(
    nextPrompt,
    "Future research-mode reviewed runs must include `research-mode-no-write-scan` command and exit status in scanner evidence.",
    "next-session prompt"
  );

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      pkg.scripts[scriptName].includes("node benchmarks/scripts/check-research-mode-no-write-green-evidence-gate.js"),
      `${scriptName} must include research mode no-write green evidence gate check`
    );
    assert(
      pkg.scripts[scriptName].includes("node benchmarks/scripts/check-research-mode-no-write-scan.js"),
      `${scriptName} must include research-mode no-write scanner check after acceptable green evidence exists`
    );
  }

  for (const artifact of promotedScannerArtifacts) {
    assert(fs.existsSync(path.join(root, artifact)), `promoted scanner artifact is missing after acceptable green evidence: ${artifact}`);
  }

  console.log("research mode no-write green evidence gate check passed");
}

main();
