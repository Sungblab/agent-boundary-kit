const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "scanner-validation-guidance-to-code-leakage.md");
const backlogPath = path.join(root, "docs", "benchmark-backlog.md");
const nextPromptPath = path.join(root, "docs", "next-session-prompt.md");
const packagePath = path.join(root, "package.json");

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
  assert(fs.existsSync(docPath), "docs/scanner-validation-guidance-to-code-leakage.md is missing");

  const doc = read(docPath);
  const backlog = read(backlogPath);
  const nextPrompt = read(nextPromptPath);
  const pkg = JSON.parse(read(packagePath));

  for (const phrase of [
    "# Scanner Validation: Guidance To Code Leakage",
    "future `guidance-to-code-leakage-scan`",
    "The scanner is not implemented yet.",
    "Candidate: `guidance-to-code-leakage-scan`",
    "Scanner script: `benchmarks/scripts/scan-guidance-to-code-leakage.js`",
    "Scanner check: `benchmarks/scripts/check-guidance-to-code-leakage-scan.js`",
    "Fixture: `benchmarks/fixtures/model-instruction-hardcoded-default`",
    "Reviewed failing result: `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-001.md`",
    "Reviewed passing result: `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-002-writable.md`",
    "The scanner should not flag `docs/agent-guidance.md` by itself.",
    "`npm test` exit 1.",
    "`node ../verify.js` exit 1.",
    "`npm test` exit 0.",
    "`node ../verify.js` exit 0.",
    "The read-only scanner is implemented at `benchmarks/scripts/scan-guidance-to-code-leakage.js`.",
    "exit non-zero on source-level guidance-to-code leakage",
    "exit zero on repository guidance files and config files when scanned through a repo path",
    "The script must not:",
    "package a hook",
    "install a connector",
    "expand into a dashboard or workflow tool",
  ]) {
    assertIncludes(doc, phrase, "validation doc");
  }

  assertExcludes(doc, [
    "C:\\Users\\",
    "file://",
    "hooks/claude/install",
    "copy this into settings",
  ], "validation doc");

  assertIncludes(backlog, "docs/scanner-validation-guidance-to-code-leakage.md", "benchmark backlog");
  assertIncludes(nextPrompt, "docs/scanner-validation-guidance-to-code-leakage.md", "next-session prompt");

  assert(
    pkg.scripts["bench:check"].includes("node benchmarks/scripts/check-guidance-to-code-leakage-validation.js"),
    "bench:check must include guidance-to-code validation check"
  );
  assert(
    pkg.scripts["bench:check:red"].includes("node benchmarks/scripts/check-guidance-to-code-leakage-validation.js"),
    "bench:check:red must include guidance-to-code validation check"
  );

  console.log("guidance-to-code leakage validation check passed");
}

main();
