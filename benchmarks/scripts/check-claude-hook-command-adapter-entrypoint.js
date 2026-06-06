const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const binPath = path.join(root, "bin", "abk-claude-hook.js");
const adapterPath = path.join(root, "lib", "abk-claude-hook-adapter.js");
const docPath = path.join(root, "docs", "claude-hook-command-adapter-entrypoint.md");
const packagePath = path.join(root, "package.json");
const validStdinPath = path.join(root, "hooks", "claude", "examples", "command-adapter.stdin.post-edit.valid.json");
const invalidTranscriptStdinPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "command-adapter.stdin.invalid-transcript.json"
);
const validOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "adapter-entrypoint.valid-plan-output.json"
);
const invalidTranscriptOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "adapter-entrypoint.invalid-transcript-output.json"
);

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

const requiredDocPhrases = [
  "# Claude Hook Command Adapter Entrypoint",
  "## Boundary",
  "## Command Shape",
  "## Current Implementation",
  "## Evidence Gate",
  "## Non-Goals",
  "## Next Gate",
  "bin/abk-claude-hook.js",
  "lib/abk-claude-hook-adapter.js",
  "read stdin only",
  "temporary files",
  "delete temporary files before exit",
  "preserve runner exit codes",
  "No raw private transcripts",
  "No message arrays",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not execute scanners in this entrypoint",
  "Do not generate final copy",
  "node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js",
  "node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-command-adapter-implementation-contract.md",
  "docs/claude-hook-command-adapter-entrypoint-fixtures.md",
  "hooks/claude/README.md",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function tempAdapterDirs() {
  return fs
    .readdirSync(os.tmpdir(), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("abk-claude-hook-"))
    .map((entry) => entry.name)
    .sort();
}

function runAdapter(inputPath) {
  const input = fs.readFileSync(inputPath, "utf8");
  return spawnSync(process.execPath, [binPath], {
    cwd: root,
    encoding: "utf8",
    input,
  });
}

function assertNoTempLeak(before, after, label) {
  const leaked = after.filter((entry) => !before.includes(entry));
  assert.deepEqual(leaked, [], `${label}: adapter left temp directories: ${leaked.join(", ")}`);
}

function assertThinBin() {
  const source = fs.readFileSync(binPath, "utf8");
  assert.ok(source.startsWith("#!/usr/bin/env node\n"), "adapter bin must keep the node shebang");
  assert.ok(
    source.includes('require("../lib/abk-claude-hook-adapter.js")'),
    "adapter bin must import the adapter module"
  );
  assert.ok(source.includes("main()"), "adapter bin must delegate to adapter main");
  assert.ok(!source.includes("scan("), "adapter bin must not contain scan logic");
  assert.ok(!source.includes("Copy-Item"), "adapter bin must not contain install commands");
  assert.ok(!source.includes(".claude/settings"), "adapter bin must not edit Claude settings");
  assert.ok(
    source.split(/\r?\n/).filter((line) => line.trim().length > 0).length <= 6,
    "adapter bin must stay a thin wrapper"
  );
}

function main() {
  assert.ok(fs.existsSync(binPath), "bin/abk-claude-hook.js is missing");
  assert.ok(fs.existsSync(adapterPath), "lib/abk-claude-hook-adapter.js is missing");
  assert.ok(fs.existsSync(docPath), "docs/claude-hook-command-adapter-entrypoint.md is missing");

  const doc = fs.readFileSync(docPath, "utf8");
  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook command adapter entrypoint doc missing phrase: ${phrase}`);
  }

  const packageJson = readJson(packagePath);
  assert.equal(packageJson.bin["abk-claude-hook"], "bin/abk-claude-hook.js", "package bin must expose abk-claude-hook");

  assertThinBin();

  const adapter = require(adapterPath);
  assert.equal(typeof adapter.runAdapterFromStdinText, "function", "adapter module must export runAdapterFromStdinText");
  assert.equal(typeof adapter.main, "function", "adapter module must export main");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert.ok(
      file.includes("docs/claude-hook-command-adapter-entrypoint.md"),
      `${relativePath} must link docs/claude-hook-command-adapter-entrypoint.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js"),
      `${scriptName} must include check-claude-hook-command-adapter-entrypoint.js`
    );
  }

  const validBefore = tempAdapterDirs();
  const validResult = runAdapter(validStdinPath);
  const validAfter = tempAdapterDirs();
  assertNoTempLeak(validBefore, validAfter, "valid stdin");
  assert.equal(validResult.status, 0, `valid stdin: exit code mismatch\nstderr=${validResult.stderr}`);
  assert.equal(validResult.stderr, "", "valid stdin: stderr should be empty");
  assert.deepEqual(JSON.parse(validResult.stdout), readJson(validOutputPath), "valid stdin: output mismatch");

  const invalidBefore = tempAdapterDirs();
  const invalidResult = runAdapter(invalidTranscriptStdinPath);
  const invalidAfter = tempAdapterDirs();
  assertNoTempLeak(invalidBefore, invalidAfter, "invalid transcript stdin");
  assert.equal(invalidResult.status, 2, `invalid transcript stdin: exit code mismatch\nstderr=${invalidResult.stderr}`);
  assert.equal(invalidResult.stderr, "", "invalid transcript stdin: stderr should be empty");
  assert.deepEqual(
    JSON.parse(invalidResult.stdout),
    readJson(invalidTranscriptOutputPath),
    "invalid transcript stdin: output mismatch"
  );

  console.log("Claude hook command adapter entrypoint check passed");
}

main();
