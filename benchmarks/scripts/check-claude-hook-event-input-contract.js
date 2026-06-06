const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-event-input-contract.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Event Input Contract",
  "## Boundary",
  "## Allowed Event Fields",
  "## Event To Runner Input Mapping",
  "## Rejected Event Fields",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "not an installed hook",
  "not hook packaging",
  "not a runner implementation",
  "docs/hook-runner-input-contract.md",
  "docs/hook-runner-selection-matrix.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "docs/hook-scanner-contracts.md",
  "No raw private transcripts",
  "No hidden chat history",
  "No broad workspace scraping",
  "No prompt text",
  "No message arrays",
  "No inferred metadata",
  "explicit event metadata",
  "configuration error",
  "runner input",
  "Do not package hooks yet",
  "Do not install Claude hooks",
  "Do not execute scanners",
];

const hookSpecs = [
  "hooks/claude/pre-write-boundary-check.md",
  "hooks/claude/post-edit-scope-check.md",
  "hooks/claude/test-integrity-check.md",
  "hooks/claude/completion-evidence-check.md",
];

const hookIds = [
  "pre_write_boundary_check",
  "post_edit_scope_check",
  "test_integrity_check",
  "completion_evidence_check",
];

const allowedEventFields = [
  "hookId",
  "repoRoot",
  "task",
  "changedFiles",
  "diffPath",
  "approvedScope",
  "offLimits",
  "namedTools",
  "staleTerms",
  "externalSources",
  "finalGate",
  "commandLog",
  "completionDraft",
  "metadataFiles",
  "testFiles",
  "productionFiles",
  "behaviorContract",
];

const rejectedEventFields = [
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "prompt",
  "assistantResponse",
  "secret",
  "cookie",
  "token",
  "password",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/hook-runner-minimal-plan.md",
  "docs/hook-runner-input-contract.md",
  "docs/hook-runner-selection-matrix.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
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
  assert(fs.existsSync(docPath), "docs/claude-hook-event-input-contract.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert(markdown.includes(section), `Claude hook event input contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `Claude hook event input contract missing phrase: ${phrase}`);
  }

  for (const hookSpec of hookSpecs) {
    assert(markdown.includes(hookSpec), `Claude hook event input contract missing hook spec: ${hookSpec}`);
  }

  for (const hookId of hookIds) {
    assert(markdown.includes(hookId), `Claude hook event input contract missing hook id: ${hookId}`);
  }

  for (const field of allowedEventFields) {
    assert(markdown.includes(field), `Claude hook event input contract missing allowed event field: ${field}`);
  }

  for (const field of rejectedEventFields) {
    assert(markdown.includes(field), `Claude hook event input contract missing rejected event field: ${field}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert(file.includes("docs/claude-hook-event-input-contract.md"), `${relativePath} must link docs/claude-hook-event-input-contract.md`);
    assert(
      file.includes("benchmarks/scripts/check-claude-hook-event-input-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-event-input-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-event-input-contract.js"),
      `${scriptName} must include check-claude-hook-event-input-contract.js`
    );
  }

  console.log("Claude hook event input contract check passed");
}

main();
