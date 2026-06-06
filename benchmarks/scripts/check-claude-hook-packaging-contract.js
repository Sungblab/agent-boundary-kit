const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-packaging-contract.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Packaging Contract",
  "## Boundary",
  "## Prerequisites",
  "## Allowed Package Shape",
  "## Runtime Flow",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "not an installed hook",
  "not an installer",
  "not a background watcher",
  "docs/packaging-readiness.md",
  "docs/claude-hook-event-input-contract.md",
  "docs/claude-hook-event-mapping-examples.md",
  "docs/claude-hook-event-mapper-contract.md",
  "docs/claude-hook-event-mapper-output-fixtures.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "docs/hook-runner-selection-matrix.md",
  "docs/scanner-coverage-matrix.md",
  "docs/claude-hook-command-adapter-fixtures.md",
  "abk-runner map-event --input <hook-event.json>",
  "abk-runner dry-run --input <runner-input.json>",
  "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
  "pre_write_boundary_check",
  "post_edit_scope_check",
  "test_integrity_check",
  "completion_evidence_check",
  "No raw private transcripts",
  "No hidden chat history",
  "No prompt text",
  "No message arrays",
  "No broad workspace scraping",
  "No automatic hook installation",
  "No final response generation",
  "Do not install Claude hooks yet",
  "Do not execute scanners before map-event succeeds",
  "Do not infer missing metadata",
  "Do not create connectors",
  "Do not build dashboards",
  "Do not add SaaS workflow",
  "node benchmarks/scripts/check-claude-hook-packaging-contract.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js",
  "node benchmarks/scripts/check-abk-runner-map-event.js",
  "node benchmarks/scripts/check-abk-runner-dry-run.js",
  "node benchmarks/scripts/check-abk-runner-scan.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
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
  assert(fs.existsSync(docPath), "docs/claude-hook-packaging-contract.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert(markdown.includes(section), `Claude hook packaging contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `Claude hook packaging contract missing phrase: ${phrase}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert(
      file.includes("docs/claude-hook-packaging-contract.md"),
      `${relativePath} must link docs/claude-hook-packaging-contract.md`
    );
    assert(
      file.includes("benchmarks/scripts/check-claude-hook-packaging-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-packaging-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-packaging-contract.js"),
      `${scriptName} must include check-claude-hook-packaging-contract.js`
    );
  }

  console.log("Claude hook packaging contract check passed");
}

main();
