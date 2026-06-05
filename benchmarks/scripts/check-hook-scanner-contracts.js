const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const contractPath = path.join(root, "docs", "hook-scanner-contracts.md");
const hookReadmePath = path.join(root, "hooks", "claude", "README.md");

const hookSpecs = [
  {
    file: "hooks/claude/pre-write-boundary-check.md",
    scanners: ["scan-phase-gate-plan.js"],
  },
  {
    file: "hooks/claude/post-edit-scope-check.md",
    scanners: [
      "scan-parser-fallback-boundary.js",
      "scan-latex-renderer-boundary.js",
      "scan-hardcoded-credential-fallback.js",
      "scan-legacy-surface-retention.js",
      "scan-untrusted-context-canary.js",
      "scan-noisy-log-root-cause.js",
    ],
  },
  {
    file: "hooks/claude/test-integrity-check.md",
    scanners: [
      "scan-test-runtime-patch.js",
      "scan-test-fake-contract.js",
      "scan-noisy-log-root-cause.js",
    ],
  },
  {
    file: "hooks/claude/completion-evidence-check.md",
    scanners: [
      "scan-completion-evidence-gate.js",
      "scan-untrusted-context-canary.js",
      "scan-phase-gate-plan.js",
    ],
  },
];

const requiredSharedPhrases = [
  "# Hook Scanner Contracts",
  "not installed hooks",
  "read-only",
  "No raw private transcripts",
  "Exit 0",
  "Exit 1",
  "Exit 2",
  "docs/scanner-coverage-matrix.md",
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
  assert(fs.existsSync(contractPath), "docs/hook-scanner-contracts.md is missing");

  const contract = fs.readFileSync(contractPath, "utf8");
  for (const phrase of requiredSharedPhrases) {
    assert(contract.includes(phrase), `hook scanner contract missing phrase: ${phrase}`);
  }

  for (const spec of hookSpecs) {
    assert(contract.includes(spec.file), `hook scanner contract missing hook spec: ${spec.file}`);
    const specMarkdown = readRelative(spec.file);
    assert(specMarkdown.includes("## Scanner Contract"), `${spec.file}: missing ## Scanner Contract`);
    assert(specMarkdown.includes("Input contract:"), `${spec.file}: missing Input contract`);
    assert(specMarkdown.includes("Output contract:"), `${spec.file}: missing Output contract`);
    assert(specMarkdown.includes("No raw private transcripts"), `${spec.file}: missing transcript boundary`);

    for (const scanner of spec.scanners) {
      assert(contract.includes(scanner), `hook scanner contract missing scanner: ${scanner}`);
      assert(specMarkdown.includes(scanner), `${spec.file}: missing scanner ${scanner}`);
    }
  }

  const readme = fs.readFileSync(hookReadmePath, "utf8");
  assert(readme.includes("docs/hook-scanner-contracts.md"), "hooks README must link hook scanner contracts");

  console.log(`hook scanner contract check passed (${hookSpecs.length} hook specs)`);
}

main();
