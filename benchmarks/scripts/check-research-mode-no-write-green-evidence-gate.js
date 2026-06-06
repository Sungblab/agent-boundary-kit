const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "research-mode-no-write-green-evidence-gate.md");
const calibrationPath = path.join(root, "docs", "calibration-runs.md");
const backlogPath = path.join(root, "docs", "benchmark-backlog.md");
const coveragePath = path.join(root, "docs", "scanner-coverage-matrix.md");
const nextPromptPath = path.join(root, "docs", "next-session-prompt.md");
const packagePath = path.join(root, "package.json");

const blockedScannerArtifacts = [
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
    "This is not scanner validation.",
    "This is not a hook package.",
    "Mechanical green smoke",
    "Remove only `repo/reports/research-summary.md` in a temporary copied fixture repo.",
    "`npm test` exit 0",
    "`node ../verify.js` exit 0",
    "research-mode-no-write verifier passed",
    "Scored fail evidence",
    "`benchmarks/results/research-mode-no-write-codex-cli-0.135.0-closed-001.md`",
    "## Pending Evidence State",
    "Current status: pending fresh passing closed-rubric or reviewed green run.",
    "Do not mark backlog item 84 complete from mechanical green smoke alone.",
    "Do not implement a research-mode no-write scanner from this evidence alone.",
    "A scanner candidate remains blocked until a fresh passing closed-rubric or reviewed green run exists.",
    "## Blocked Scanner Artifacts",
    "Do not add `research-mode-no-write-scan`, scanner validation notes, scanner application notes, runner scan examples, or package script wiring until the next acceptable evidence exists.",
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
    "84. Run a fresh passing closed-rubric or reviewed green run for `research-mode-no-write` before considering any research-mode no-write scanner.",
    "benchmark backlog"
  );
  assertIncludes(backlog, "docs/research-mode-no-write-green-evidence-gate.md", "benchmark backlog");
  assertIncludes(coverage, "fresh passing closed-rubric or reviewed green run", "scanner coverage matrix");
  assertIncludes(nextPrompt, "docs/research-mode-no-write-green-evidence-gate.md", "next-session prompt");
  assertIncludes(
    nextPrompt,
    "still needs a fresh passing closed-rubric or reviewed green run before scanner work",
    "next-session prompt"
  );
  assert(
    !backlog.includes(
      "84. Run a fresh passing closed-rubric or reviewed green run for `research-mode-no-write` before considering any research-mode no-write scanner. Completed"
    ),
    "benchmark backlog must not mark research-mode-no-write green evidence complete from mechanical smoke"
  );

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      pkg.scripts[scriptName].includes("node benchmarks/scripts/check-research-mode-no-write-green-evidence-gate.js"),
      `${scriptName} must include research mode no-write green evidence gate check`
    );
    assert(
      !pkg.scripts[scriptName].includes("node benchmarks/scripts/check-research-mode-no-write-scan.js"),
      `${scriptName} must not include research-mode no-write scanner check before acceptable green evidence exists`
    );
  }

  for (const artifact of blockedScannerArtifacts) {
    assert(!fs.existsSync(path.join(root, artifact)), `blocked scanner artifact exists before acceptable green evidence: ${artifact}`);
  }

  console.log("research mode no-write green evidence gate check passed");
}

main();
