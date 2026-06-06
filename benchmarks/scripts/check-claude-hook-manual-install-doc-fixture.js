const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-manual-install-doc-fixture.md");
const validDocPath = path.join(root, "hooks", "claude", "examples", "manual-install-doc.valid.md");
const invalidMutatingDocPath = path.join(root, "hooks", "claude", "examples", "manual-install-doc.invalid-mutating.md");
const packagePath = path.join(root, "package.json");

const requiredPhrases = [
  "# Claude Hook Manual Install Documentation Fixture",
  "docs/claude-hook-package-manifest-fixtures.md",
  "docs/claude-hook-packaging-contract.md",
  "hooks/claude/examples/package-manifest.valid.json",
  "hooks/claude/examples/manual-install-doc.valid.md",
  "hooks/claude/examples/manual-install-doc.invalid-mutating.md",
  "documentation fixture only",
  "manual-review-only",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks yet",
  "Do not add installer code",
  "Do not provide copy commands",
  "Do not create or edit Claude configuration files",
  "Do not execute scanners before map-event succeeds",
  "Do not generate final copy",
  "node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js",
  "node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js",
  "npm run bench:check",
  "npm run bench:check:red",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-packaging-contract.md",
  "docs/claude-hook-package-manifest-fixtures.md",
  "hooks/claude/README.md",
];

const forbiddenValidDocPhrases = [
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  "postInstall",
  "installScript",
  "autoInstall: true",
  "\"autoInstall\": true",
  "claude config",
  ".claude/settings",
  ".claude/settings.json",
];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function main() {
  for (const filePath of [docPath, validDocPath, invalidMutatingDocPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validDoc = read(validDocPath);
  const invalidDoc = read(invalidMutatingDocPath);
  const packageJson = JSON.parse(read(packagePath));

  for (const phrase of requiredPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook manual install doc fixture missing phrase: ${phrase}`);
  }

  assert.ok(validDoc.includes("manual-review-only"), "valid manual install doc must say manual-review-only");
  assert.ok(validDoc.includes("documentation fixture only"), "valid manual install doc must say documentation fixture only");
  assert.ok(validDoc.includes("No repository mutation"), "valid manual install doc must say No repository mutation");
  assert.ok(
    validDoc.includes("hooks/claude/examples/package-manifest.valid.json"),
    "valid manual install doc must cite the package manifest fixture"
  );

  for (const phrase of forbiddenValidDocPhrases) {
    assert.ok(!validDoc.includes(phrase), `valid manual install doc includes forbidden phrase: ${phrase}`);
  }

  assert.ok(invalidDoc.includes("Copy-Item"), "invalid mutating doc must include Copy-Item");
  assert.ok(invalidDoc.includes(".claude/settings.json"), "invalid mutating doc must include .claude/settings.json");

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-manual-install-doc-fixture.md"),
      `${relativePath} must link docs/claude-hook-manual-install-doc-fixture.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js"
      ),
      `${scriptName} must include check-claude-hook-manual-install-doc-fixture.js`
    );
  }

  console.log("Claude hook manual install documentation fixture check passed");
}

main();
