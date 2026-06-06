const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-event-mapper-contract.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Event Mapper Contract",
  "## Boundary",
  "## Command Shape",
  "## Input",
  "## Output",
  "## Error Handling",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "not an installed hook",
  "not hook packaging",
  "not a scanner runner",
  "abk-runner map-event --input <hook-event.json>",
  "docs/claude-hook-event-input-contract.md",
  "docs/claude-hook-event-mapping-examples.md",
  "docs/hook-runner-input-contract.md",
  "hooks/claude/examples/hook-event.post-edit.valid.json",
  "hooks/claude/examples/hook-event.post-edit.expected-runner-input.json",
  "hooks/claude/examples/hook-event.invalid-transcript.json",
  "No raw private transcripts",
  "No hidden chat history",
  "No prompt text",
  "No message arrays",
  "No broad workspace scraping",
  "No file writes",
  "Do not install Claude hooks",
  "Do not execute scanners",
  "Do not infer missing metadata",
  "Exit 0",
  "Exit 2",
  "configuration error",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/claude-hook-event-input-contract.md",
  "docs/claude-hook-event-mapping-examples.md",
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
  assert(fs.existsSync(docPath), "docs/claude-hook-event-mapper-contract.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert(markdown.includes(section), `Claude hook event mapper contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `Claude hook event mapper contract missing phrase: ${phrase}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert(file.includes("docs/claude-hook-event-mapper-contract.md"), `${relativePath} must link docs/claude-hook-event-mapper-contract.md`);
    assert(
      file.includes("benchmarks/scripts/check-claude-hook-event-mapper-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-event-mapper-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-event-mapper-contract.js"),
      `${scriptName} must include check-claude-hook-event-mapper-contract.js`
    );
  }

  console.log("Claude hook event mapper contract check passed");
}

main();
