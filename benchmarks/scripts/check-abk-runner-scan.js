const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const runnerPath = path.join(root, "bin", "abk-runner.js");

const cases = [
  {
    name: "legacy surface finding",
    input: "hooks/claude/examples/runner-scan.legacy-surface-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "legacy-surface-retention-scan",
    expectedScanner: "legacy-surface-retention-scan",
    expected: "hooks/claude/examples/runner-scan.legacy-surface-finding-output.json",
    exitCode: 1,
  },
  {
    name: "legacy surface clear",
    input: "hooks/claude/examples/runner-scan.legacy-surface-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "legacy-surface-retention-scan",
    expectedScanner: "legacy-surface-retention-scan",
    expected: "hooks/claude/examples/runner-scan.legacy-surface-clear-output.json",
    exitCode: 0,
  },
  {
    name: "parser fallback finding",
    input: "hooks/claude/examples/runner-scan.parser-fallback-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "parser-fallback-boundary-scan",
    expectedScanner: "parser-fallback-boundary-scan",
    expected: "hooks/claude/examples/runner-scan.parser-fallback-finding-output.json",
    exitCode: 1,
  },
  {
    name: "parser fallback clear",
    input: "hooks/claude/examples/runner-scan.parser-fallback-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "parser-fallback-boundary-scan",
    expectedScanner: "parser-fallback-boundary-scan",
    expected: "hooks/claude/examples/runner-scan.parser-fallback-clear-output.json",
    exitCode: 0,
  },
  {
    name: "latex renderer finding",
    input: "hooks/claude/examples/runner-scan.latex-renderer-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "latex-renderer-boundary-scan",
    expectedScanner: "latex-renderer-boundary-scan",
    expected: "hooks/claude/examples/runner-scan.latex-renderer-finding-output.json",
    exitCode: 1,
  },
  {
    name: "latex renderer clear",
    input: "hooks/claude/examples/runner-scan.latex-renderer-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "latex-renderer-boundary-scan",
    expectedScanner: "latex-renderer-boundary-scan",
    expected: "hooks/claude/examples/runner-scan.latex-renderer-clear-output.json",
    exitCode: 0,
  },
  {
    name: "hardcoded credential finding",
    input: "hooks/claude/examples/runner-scan.hardcoded-credential-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "hardcoded-credential-fallback-scan",
    expectedScanner: "hardcoded-credential-fallback-scan",
    expected: "hooks/claude/examples/runner-scan.hardcoded-credential-finding-output.json",
    exitCode: 1,
  },
  {
    name: "hardcoded credential clear",
    input: "hooks/claude/examples/runner-scan.hardcoded-credential-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "hardcoded-credential-fallback-scan",
    expectedScanner: "hardcoded-credential-fallback-scan",
    expected: "hooks/claude/examples/runner-scan.hardcoded-credential-clear-output.json",
    exitCode: 0,
  },
  {
    name: "guidance to code finding",
    input: "hooks/claude/examples/runner-scan.guidance-to-code-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "guidance-to-code-leakage-scan",
    expectedScanner: "guidance-to-code-leakage-scan",
    expected: "hooks/claude/examples/runner-scan.guidance-to-code-finding-output.json",
    exitCode: 1,
  },
  {
    name: "guidance to code clear",
    input: "hooks/claude/examples/runner-scan.guidance-to-code-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "guidance-to-code-leakage-scan",
    expectedScanner: "guidance-to-code-leakage-scan",
    expected: "hooks/claude/examples/runner-scan.guidance-to-code-clear-output.json",
    exitCode: 0,
  },
  {
    name: "test runtime patch finding",
    input: "hooks/claude/examples/runner-scan.test-runtime-finding-input.json",
    expectedHookId: "test_integrity_check",
    scanner: "test-runtime-patch-scan",
    expectedScanner: "test-runtime-patch-scan",
    expected: "hooks/claude/examples/runner-scan.test-runtime-finding-output.json",
    exitCode: 1,
  },
  {
    name: "test runtime patch clear",
    input: "hooks/claude/examples/runner-scan.test-runtime-clear-input.json",
    expectedHookId: "test_integrity_check",
    scanner: "test-runtime-patch-scan",
    expectedScanner: "test-runtime-patch-scan",
    expected: "hooks/claude/examples/runner-scan.test-runtime-clear-output.json",
    exitCode: 0,
  },
  {
    name: "test fake contract finding",
    input: "hooks/claude/examples/runner-scan.test-fake-finding-input.json",
    expectedHookId: "test_integrity_check",
    scanner: "test-fake-contract-scan",
    expectedScanner: "test-fake-contract-scan",
    expected: "hooks/claude/examples/runner-scan.test-fake-finding-output.json",
    exitCode: 1,
  },
  {
    name: "test fake contract clear",
    input: "hooks/claude/examples/runner-scan.test-fake-clear-input.json",
    expectedHookId: "test_integrity_check",
    scanner: "test-fake-contract-scan",
    expectedScanner: "test-fake-contract-scan",
    expected: "hooks/claude/examples/runner-scan.test-fake-clear-output.json",
    exitCode: 0,
  },
  {
    name: "completion evidence finding",
    input: "hooks/claude/examples/runner-scan.completion-evidence-finding-input.json",
    expectedHookId: "completion_evidence_check",
    scanner: "completion-evidence-gate-scan",
    expectedScanner: "completion-evidence-gate-scan",
    expected: "hooks/claude/examples/runner-scan.completion-evidence-finding-output.json",
    exitCode: 1,
  },
  {
    name: "completion evidence clear",
    input: "hooks/claude/examples/runner-scan.completion-evidence-clear-input.json",
    expectedHookId: "completion_evidence_check",
    scanner: "completion-evidence-gate-scan",
    expectedScanner: "completion-evidence-gate-scan",
    expected: "hooks/claude/examples/runner-scan.completion-evidence-clear-output.json",
    exitCode: 0,
  },
  {
    name: "untrusted context post-edit finding",
    input: "hooks/claude/examples/runner-scan.untrusted-context-post-edit-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "untrusted-context-canary-scan",
    expectedScanner: "untrusted-context-canary-scan",
    expected: "hooks/claude/examples/runner-scan.untrusted-context-post-edit-finding-output.json",
    exitCode: 1,
  },
  {
    name: "untrusted context post-edit clear",
    input: "hooks/claude/examples/runner-scan.untrusted-context-post-edit-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "untrusted-context-canary-scan",
    expectedScanner: "untrusted-context-canary-scan",
    expected: "hooks/claude/examples/runner-scan.untrusted-context-post-edit-clear-output.json",
    exitCode: 0,
  },
  {
    name: "untrusted context completion finding",
    input: "hooks/claude/examples/runner-scan.untrusted-context-completion-finding-input.json",
    expectedHookId: "completion_evidence_check",
    scanner: "untrusted-context-canary-scan",
    expectedScanner: "untrusted-context-canary-scan",
    expected: "hooks/claude/examples/runner-scan.untrusted-context-completion-finding-output.json",
    exitCode: 1,
  },
  {
    name: "untrusted context completion clear",
    input: "hooks/claude/examples/runner-scan.untrusted-context-completion-clear-input.json",
    expectedHookId: "completion_evidence_check",
    scanner: "untrusted-context-canary-scan",
    expectedScanner: "untrusted-context-canary-scan",
    expected: "hooks/claude/examples/runner-scan.untrusted-context-completion-clear-output.json",
    exitCode: 0,
  },
  {
    name: "noisy log post-edit finding",
    input: "hooks/claude/examples/runner-scan.noisy-log-post-edit-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "noisy-log-root-cause-scan",
    expectedScanner: "noisy-log-root-cause-scan",
    expected: "hooks/claude/examples/runner-scan.noisy-log-post-edit-finding-output.json",
    exitCode: 1,
  },
  {
    name: "noisy log post-edit clear",
    input: "hooks/claude/examples/runner-scan.noisy-log-post-edit-clear-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "noisy-log-root-cause-scan",
    expectedScanner: "noisy-log-root-cause-scan",
    expected: "hooks/claude/examples/runner-scan.noisy-log-post-edit-clear-output.json",
    exitCode: 0,
  },
  {
    name: "noisy log test-integrity finding",
    input: "hooks/claude/examples/runner-scan.noisy-log-test-integrity-finding-input.json",
    expectedHookId: "test_integrity_check",
    scanner: "noisy-log-root-cause-scan",
    expectedScanner: "noisy-log-root-cause-scan",
    expected: "hooks/claude/examples/runner-scan.noisy-log-test-integrity-finding-output.json",
    exitCode: 1,
  },
  {
    name: "noisy log test-integrity clear",
    input: "hooks/claude/examples/runner-scan.noisy-log-test-integrity-clear-input.json",
    expectedHookId: "test_integrity_check",
    scanner: "noisy-log-root-cause-scan",
    expectedScanner: "noisy-log-root-cause-scan",
    expected: "hooks/claude/examples/runner-scan.noisy-log-test-integrity-clear-output.json",
    exitCode: 0,
  },
  {
    name: "phase gate pre-write finding",
    input: "hooks/claude/examples/runner-scan.phase-gate-pre-write-finding-input.json",
    expectedHookId: "pre_write_boundary_check",
    scanner: "phase-gate-plan-scan",
    expectedScanner: "phase-gate-plan-scan",
    expected: "hooks/claude/examples/runner-scan.phase-gate-pre-write-finding-output.json",
    exitCode: 1,
  },
  {
    name: "phase gate pre-write clear",
    input: "hooks/claude/examples/runner-scan.phase-gate-pre-write-clear-input.json",
    expectedHookId: "pre_write_boundary_check",
    scanner: "phase-gate-plan-scan",
    expectedScanner: "phase-gate-plan-scan",
    expected: "hooks/claude/examples/runner-scan.phase-gate-pre-write-clear-output.json",
    exitCode: 0,
  },
  {
    name: "phase gate completion finding",
    input: "hooks/claude/examples/runner-scan.phase-gate-completion-finding-input.json",
    expectedHookId: "completion_evidence_check",
    scanner: "phase-gate-plan-scan",
    expectedScanner: "phase-gate-plan-scan",
    expected: "hooks/claude/examples/runner-scan.phase-gate-completion-finding-output.json",
    exitCode: 1,
  },
  {
    name: "phase gate completion clear",
    input: "hooks/claude/examples/runner-scan.phase-gate-completion-clear-input.json",
    expectedHookId: "completion_evidence_check",
    scanner: "phase-gate-plan-scan",
    expectedScanner: "phase-gate-plan-scan",
    expected: "hooks/claude/examples/runner-scan.phase-gate-completion-clear-output.json",
    exitCode: 0,
  },
  {
    name: "unsupported scanner configuration error",
    input: "hooks/claude/examples/runner-scan.legacy-surface-finding-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "unknown-boundary-scan",
    expectedScanner: "runner-command-contract",
    expected: "hooks/claude/examples/runner-scan.unsupported-scanner-output.json",
    exitCode: 2,
  },
  {
    name: "unselected scanner configuration error",
    input: "hooks/claude/examples/runner-scan.unselected-scanner-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "legacy-surface-retention-scan",
    expectedScanner: "legacy-surface-retention-scan",
    expected: "hooks/claude/examples/runner-scan.unselected-scanner-output.json",
    exitCode: 2,
  },
  {
    name: "missing changed files configuration error",
    input: "hooks/claude/examples/runner-scan.missing-changed-files-input.json",
    expectedHookId: "post_edit_scope_check",
    scanner: "legacy-surface-retention-scan",
    expectedScanner: "legacy-surface-retention-scan",
    expected: "hooks/claude/examples/runner-scan.missing-changed-files-output.json",
    exitCode: 2,
  },
];

const forbiddenOutputKeys = [
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "secret",
  "cookie",
  "token",
  "password",
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function findForbiddenKey(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findForbiddenKey(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (forbiddenOutputKeys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findForbiddenKey(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function runScan(testCase) {
  return spawnSync(process.execPath, [runnerPath, "scan", "--input", testCase.input, "--scanner", testCase.scanner], {
    cwd: root,
    encoding: "utf8",
  });
}

function assertRunnerOutput(output, testCase) {
  assert.equal(output.hookId, testCase.expectedHookId, `${testCase.name}: hookId mismatch`);
  assert.equal(output.scanner, testCase.expectedScanner, `${testCase.name}: scanner mismatch`);
  assert.ok(["clear", "finding", "error"].includes(output.status), `${testCase.name}: invalid status`);
  assert.equal(output.exitCode, testCase.exitCode, `${testCase.name}: output exitCode mismatch`);
  assert.equal(typeof output.blocked, "boolean", `${testCase.name}: blocked must be boolean`);
  assert.equal(typeof output.reason, "string", `${testCase.name}: reason must be string`);
  assert.ok(Array.isArray(output.inputsUsed), `${testCase.name}: inputsUsed must be array`);
  assert.ok(Array.isArray(output.findings), `${testCase.name}: findings must be array`);
  assert.equal(findForbiddenKey(output), null, `${testCase.name}: output contains forbidden field`);
}

function main() {
  assert.ok(fs.existsSync(runnerPath), "bin/abk-runner.js is missing");
  assert.ok(
    fs.existsSync(path.join(root, "docs", "hook-runner-read-only-execution-contract.md")),
    "docs/hook-runner-read-only-execution-contract.md is missing"
  );

  for (const testCase of cases) {
    assert.ok(fs.existsSync(path.join(root, testCase.input)), `${testCase.input} is missing`);
    assert.ok(fs.existsSync(path.join(root, testCase.expected)), `${testCase.expected} is missing`);

    const result = runScan(testCase);
    assert.equal(result.status, testCase.exitCode, `${testCase.name}: exit code mismatch\nstderr=${result.stderr}`);
    assert.equal(result.stderr, "", `${testCase.name}: stderr should be empty`);

    const actual = JSON.parse(result.stdout);
    const expected = readJson(testCase.expected);
    assertRunnerOutput(actual, testCase);
    assert.deepEqual(actual, expected, `${testCase.name}: output mismatch`);
  }

  const contract = fs.readFileSync(path.join(root, "docs", "hook-runner-read-only-execution-contract.md"), "utf8");
  for (const phrase of [
    "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
    "legacy-surface-retention-scan",
    "may execute exactly one selected scanner",
    "No raw private transcripts",
    "No broad workspace scraping",
    "No file writes",
    "Do not execute multiple scanners",
    "Do not package hooks yet",
  ]) {
    assert(contract.includes(phrase), `read-only execution contract missing phrase: ${phrase}`);
  }

  for (const testCase of cases) {
    assert(contract.includes(testCase.input), `read-only execution contract missing input example: ${testCase.input}`);
    assert(contract.includes(testCase.expected), `read-only execution contract missing output example: ${testCase.expected}`);
  }

  console.log(`abk runner scan check passed (${cases.length} cases)`);
}

main();
