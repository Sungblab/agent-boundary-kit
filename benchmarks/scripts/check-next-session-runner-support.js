const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const nextPromptPath = path.join(root, "docs", "next-session-prompt.md");
const packagePath = path.join(root, "package.json");

const runnerScanners = [
  "parser-fallback-boundary-scan",
  "latex-renderer-boundary-scan",
  "hardcoded-credential-fallback-scan",
  "guidance-to-code-leakage-scan",
  "legacy-surface-retention-scan",
  "approved-file-mask-scan",
  "research-mode-no-write-scan",
  "test-runtime-patch-scan",
  "test-fake-contract-scan",
  "completion-evidence-gate-scan",
  "untrusted-context-canary-scan",
  "noisy-log-root-cause-scan",
  "phase-gate-plan-scan",
];

const runnerScripts = [
  "benchmarks/scripts/scan-guidance-to-code-leakage.js",
  "benchmarks/scripts/scan-approved-file-mask-scope.js",
  "benchmarks/scripts/scan-research-mode-no-write.js",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const markdown = fs.readFileSync(nextPromptPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const supportLine = markdown
    .split(/\r?\n/)
    .find((line) => line.includes("The local runner currently supports bounded"));

  assert(supportLine, "next-session prompt must include local runner support summary");

  for (const scanner of runnerScanners) {
    assert(supportLine.includes(scanner), `local runner support summary missing scanner: ${scanner}`);
  }

  for (const script of runnerScripts) {
    assert(markdown.includes(script), `next-session prompt missing runner scanner script: ${script}`);
  }

  for (const phrase of [
    "Future model-instruction reviewed runs must include `guidance-to-code-leakage-scan` command and exit status in scanner evidence.",
    "Future approved-file-mask reviewed runs must include `approved-file-mask-scan` command and exit status in scanner evidence.",
    "Future research-mode reviewed runs must include `research-mode-no-write-scan` command and exit status in scanner evidence.",
  ]) {
    assert(markdown.includes(phrase), `next-session prompt missing promoted scanner result guidance: ${phrase}`);
  }

  assert(!supportLine.includes("11 scanners"), "next-session prompt must not claim 11 scanners");

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-next-session-runner-support.js"),
      `${scriptName} must include check-next-session-runner-support.js`
    );
  }

  console.log(`next-session runner support check passed (${runnerScanners.length} scanners)`);
}

main();
