const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const matrixPath = path.join(root, "docs", "hook-runner-selection-matrix.md");

const hooks = [
  {
    id: "pre_write_boundary_check",
    spec: "hooks/claude/pre-write-boundary-check.md",
    scanners: ["phase-gate-plan-scan"],
    scripts: ["benchmarks/scripts/scan-phase-gate-plan.js"],
    inputs: ["task", "metadataFiles"],
  },
  {
    id: "post_edit_scope_check",
    spec: "hooks/claude/post-edit-scope-check.md",
    scanners: [
      "parser-fallback-boundary-scan",
      "latex-renderer-boundary-scan",
      "hardcoded-credential-fallback-scan",
      "guidance-to-code-leakage-scan",
      "legacy-surface-retention-scan",
      "untrusted-context-canary-scan",
      "noisy-log-root-cause-scan",
    ],
    scripts: [
      "benchmarks/scripts/scan-parser-fallback-boundary.js",
      "benchmarks/scripts/scan-latex-renderer-boundary.js",
      "benchmarks/scripts/scan-hardcoded-credential-fallback.js",
      "benchmarks/scripts/scan-guidance-to-code-leakage.js",
      "benchmarks/scripts/scan-legacy-surface-retention.js",
      "benchmarks/scripts/scan-untrusted-context-canary.js",
      "benchmarks/scripts/scan-noisy-log-root-cause.js",
    ],
    inputs: ["repoRoot", "changedFiles", "namedTools", "staleTerms", "externalSources", "commandLog"],
  },
  {
    id: "test_integrity_check",
    spec: "hooks/claude/test-integrity-check.md",
    scanners: ["test-runtime-patch-scan", "test-fake-contract-scan", "noisy-log-root-cause-scan"],
    scripts: [
      "benchmarks/scripts/scan-test-runtime-patch.js",
      "benchmarks/scripts/scan-test-fake-contract.js",
      "benchmarks/scripts/scan-noisy-log-root-cause.js",
    ],
    inputs: ["testFiles", "productionFiles", "behaviorContract", "commandLog"],
  },
  {
    id: "completion_evidence_check",
    spec: "hooks/claude/completion-evidence-check.md",
    scanners: ["completion-evidence-gate-scan", "untrusted-context-canary-scan", "phase-gate-plan-scan"],
    scripts: [
      "benchmarks/scripts/scan-completion-evidence-gate.js",
      "benchmarks/scripts/scan-untrusted-context-canary.js",
      "benchmarks/scripts/scan-phase-gate-plan.js",
    ],
    inputs: ["completionDraft", "commandLog", "finalGate", "externalSources", "metadataFiles"],
  },
];

const linkedDocs = [
  "docs/hook-runner-minimal-plan.md",
  "docs/hook-runner-dry-run-spec.md",
  "docs/enforcement-surfaces.md",
  "docs/benchmark-backlog.md",
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
  assert(fs.existsSync(matrixPath), "docs/hook-runner-selection-matrix.md is missing");

  const markdown = fs.readFileSync(matrixPath, "utf8");

  for (const phrase of [
    "# Hook Runner Selection Matrix",
    "not an installed hook",
    "not a runner implementation",
    "No raw private transcripts",
    "No hidden chat history",
    "No broad workspace scraping",
    "No inference from private chat context",
    "Missing required inputs must return configuration error",
    "Do not package hooks yet",
    "docs/scanner-coverage-matrix.md",
    "docs/hook-runner-input-contract.md",
    "docs/hook-runner-output-contract.md",
    "docs/hook-runner-dry-run-spec.md",
  ]) {
    assert(markdown.includes(phrase), `selection matrix missing phrase: ${phrase}`);
  }

  for (const hook of hooks) {
    assert(markdown.includes(hook.id), `selection matrix missing hook id: ${hook.id}`);
    assert(markdown.includes(hook.spec), `selection matrix missing hook spec: ${hook.spec}`);
    for (const scanner of hook.scanners) {
      assert(markdown.includes(scanner), `selection matrix missing scanner: ${scanner}`);
    }
    for (const script of hook.scripts) {
      assert(markdown.includes(script), `selection matrix missing script: ${script}`);
      assert(fs.existsSync(path.join(root, script)), `scanner script does not exist: ${script}`);
    }
    for (const input of hook.inputs) {
      assert(markdown.includes(input), `selection matrix missing declared input: ${input}`);
    }
  }

  for (const phrase of [
    "Select zero scanners when no predicate matches",
    "Select every scanner whose predicate matches",
    "Do not infer stale terms",
    "Do not infer named tools",
    "Do not infer final gates",
  ]) {
    assert(markdown.includes(phrase), `selection matrix missing selection rule: ${phrase}`);
  }

  for (const relativePath of linkedDocs) {
    assert(
      readRelative(relativePath).includes("docs/hook-runner-selection-matrix.md"),
      `${relativePath} must link docs/hook-runner-selection-matrix.md`
    );
  }

  console.log(`hook runner selection matrix check passed (${hooks.length} hooks)`);
}

main();
