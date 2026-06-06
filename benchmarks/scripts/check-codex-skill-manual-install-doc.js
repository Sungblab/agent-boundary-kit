const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "codex-skill-manual-install.md");
const packagePath = path.join(root, "package.json");

const requiredSections = [
  "# Codex Skill Manual Install",
  "## Boundary",
  "## Preconditions",
  "## Manual Install",
  "## Verify",
  "## Uninstall",
  "## Non-Goals",
];

const requiredPhrases = [
  "Do not run these commands unless the user explicitly requests installation",
  "manual copy only",
  "skills/boundary-check",
  "SKILL.md",
  "docs/codex-skill-install-contract.md",
  "benchmarks/scripts/check-boundary-skill-install-readiness.js",
  "node benchmarks/scripts/check-boundary-skill-install-readiness.js",
  "node benchmarks/scripts/check-codex-skill-manual-install-doc.js",
  "npm run bench:check",
  "npm run bench:check:red",
  "New-Item -ItemType Directory",
  "Copy-Item -Recurse",
  "mkdir -p",
  "cp -R",
  "No raw private transcripts",
  "No hidden chat history",
  "No broad workspace scraping",
  "Do not add a .codex-plugin manifest",
  "Do not add plugin.json",
  "Do not install Claude hooks",
  "Do not create a connector",
  "Do not build a dashboard",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/codex-skill-install-contract.md",
  "docs/packaging-readiness.md",
];

const forbiddenPhrases = [
  "C:\\Users\\Sungbin",
  "background watcher",
  "auto-install",
  "plugin marketplace",
  "connector setup",
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
  assert(fs.existsSync(docPath), "docs/codex-skill-manual-install.md is missing");

  const markdown = fs.readFileSync(docPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const section of requiredSections) {
    assert(markdown.includes(section), `Codex skill manual install doc missing section: ${section}`);
  }

  for (const phrase of requiredPhrases) {
    assert(markdown.includes(phrase), `Codex skill manual install doc missing phrase: ${phrase}`);
  }

  for (const phrase of forbiddenPhrases) {
    assert(!markdown.includes(phrase), `Codex skill manual install doc includes forbidden phrase: ${phrase}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert(file.includes("docs/codex-skill-manual-install.md"), `${relativePath} must link docs/codex-skill-manual-install.md`);
    assert(
      file.includes("benchmarks/scripts/check-codex-skill-manual-install-doc.js"),
      `${relativePath} must link benchmarks/scripts/check-codex-skill-manual-install-doc.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-codex-skill-manual-install-doc.js"),
      `${scriptName} must include check-codex-skill-manual-install-doc.js`
    );
  }

  console.log("Codex skill manual install doc check passed");
}

main();
