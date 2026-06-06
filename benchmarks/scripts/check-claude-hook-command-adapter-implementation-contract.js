const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-command-adapter-implementation-contract.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Claude Hook Command Adapter Implementation Contract",
  "## Boundary",
  "## Preconditions",
  "## Allowed Entrypoint Shape",
  "## Temporary File Contract",
  "## Runner Chain",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
];

const requiredPhrases = [
  "implementation contract only",
  "not an installed hook",
  "not an installer",
  "not hook setup guidance",
  "bin/abk-claude-hook.js",
  "lib/abk-claude-hook-adapter.js",
  "docs/claude-hook-command-adapter-contract.md",
  "docs/claude-hook-command-adapter-fixtures.md",
  "docs/claude-hook-event-mapper-contract.md",
  "docs/claude-hook-event-mapper-output-fixtures.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "hooks/claude/examples/command-adapter.stdin.post-edit.valid.json",
  "hooks/claude/examples/command-adapter.expected-runner-input.post-edit.json",
  "hooks/claude/examples/command-adapter.stdin.invalid-transcript.json",
  "hooks/claude/examples/command-adapter.invalid-transcript-output.json",
  "read stdin only",
  "parse one JSON payload",
  "write temporary hook-event and runner-input files only under an explicit temporary directory",
  "delete temporary files before exit",
  "preserve runner exit codes",
  "abk-runner map-event --input <hook-event.json>",
  "abk-runner dry-run --input <runner-input.json>",
  "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
  "map-event must run before dry-run",
  "scan must not run when map-event fails",
  "scan must not run when dry-run fails",
  "No raw private transcripts",
  "No hidden chat history",
  "No prompt text",
  "No message arrays",
  "No repository mutation",
  "No automatic hook installation",
  "Do not install Claude hooks yet",
  "Do not publish copy commands yet",
  "Do not create or edit Claude configuration files",
  "Do not add hook setup commands",
  "Do not generate final copy",
  "node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-contract.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-command-adapter-contract.md",
  "docs/claude-hook-command-adapter-fixtures.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "hooks/claude/README.md",
];

const forbiddenContractPhrases = [
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  ".claude/settings",
  ".claude/settings.json",
  "claude config",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/adapter.js",
  "hooks/claude/adapter.ps1",
  "hooks/claude/adapter.sh",
];

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function main() {
  assert.ok(
    fs.existsSync(docPath),
    "docs/claude-hook-command-adapter-implementation-contract.md is missing"
  );

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert.ok(markdown.includes(section), `Claude hook command adapter implementation contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert.ok(markdown.includes(phrase), `Claude hook command adapter implementation contract missing phrase: ${phrase}`);
  }

  for (const phrase of forbiddenContractPhrases) {
    assert.ok(!markdown.includes(phrase), `Claude hook command adapter implementation contract includes forbidden phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook adapter/install path exists before implementation: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-command-adapter-implementation-contract.md"),
      `${relativePath} must link docs/claude-hook-command-adapter-implementation-contract.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js"
      ),
      `${scriptName} must include check-claude-hook-command-adapter-implementation-contract.js`
    );
  }

  console.log("Claude hook command adapter implementation contract check passed");
}

main();
