const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "codex-skill-install-contract.md");
const skillDir = path.join(root, "skills", "boundary-check");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Codex Skill Install Contract",
  "## Boundary",
  "## Installable Candidate",
  "## Allowed Install Shape",
  "## Privacy And Input Contract",
  "## Evidence Gate",
  "## Blocked Surfaces",
  "## Next Gate",
];

const requiredPhrases = [
  "skills/boundary-check/SKILL.md",
  "docs/packaging-readiness.md",
  "docs/scanner-coverage-matrix.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "benchmarks/scripts/check-boundary-skill-readiness.js",
  "benchmarks/scripts/check-codex-skill-install-contract.js",
  "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
  "Manual install only",
  "Do not install the skill without an explicit user request",
  "Do not add a .codex-plugin manifest",
  "Do not add plugin.json",
  "Do not add bundled executable scripts",
  "No raw private transcripts",
  "No hidden chat history",
  "No broad workspace scraping",
  "No background watchers",
  "Do not install Claude hooks",
  "Do not create a connector",
  "Do not build a dashboard",
  "Do not treat scanner output as final copy",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
];

const forbiddenRepoPaths = [
  ".codex-plugin",
  "plugin.json",
  "skills/boundary-check/.codex-plugin",
  "skills/boundary-check/plugin.json",
  "skills/boundary-check/scripts",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function main() {
  assert(fs.existsSync(docPath), "docs/codex-skill-install-contract.md is missing");
  assert(fs.existsSync(path.join(skillDir, "SKILL.md")), "skills/boundary-check/SKILL.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert(markdown.includes(section), `Codex skill install contract missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `Codex skill install contract missing phrase: ${phrase}`);
  }

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert(!existsRelative(forbiddenPath), `forbidden install/package path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert(file.includes("docs/codex-skill-install-contract.md"), `${relativePath} must link docs/codex-skill-install-contract.md`);
    assert(
      file.includes("benchmarks/scripts/check-codex-skill-install-contract.js"),
      `${relativePath} must link benchmarks/scripts/check-codex-skill-install-contract.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-codex-skill-install-contract.js"),
      `${scriptName} must include check-codex-skill-install-contract.js`
    );
  }

  console.log("Codex skill install contract check passed");
}

main();
