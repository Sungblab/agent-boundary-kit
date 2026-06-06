const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const skillDir = path.join(root, "skills", "boundary-check");
const skillPath = path.join(skillDir, "SKILL.md");
const packagePath = path.join(root, "package.json");

const allowedSkillEntries = ["SKILL.md"];

const requiredSkillPhrases = [
  "name: boundary-check",
  "description: Use when",
  "docs/packaging-readiness.md",
  "docs/codex-skill-install-contract.md",
  "docs/scanner-coverage-matrix.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
  "No raw private transcripts",
  "No hidden chat history",
  "No broad workspace scraping",
  "Do not install hooks",
  "Do not package a Codex plugin",
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function main() {
  assert(fs.existsSync(skillDir), "skills/boundary-check directory is missing");
  assert(fs.existsSync(skillPath), "skills/boundary-check/SKILL.md is missing");

  const skillEntries = fs.readdirSync(skillDir).sort();
  assert(
    JSON.stringify(skillEntries) === JSON.stringify(allowedSkillEntries),
    `skills/boundary-check must contain only ${allowedSkillEntries.join(", ")} before manual install instructions`
  );

  const skill = fs.readFileSync(skillPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const phrase of requiredSkillPhrases) {
    assert(skill.includes(phrase), `boundary-check install candidate missing phrase: ${phrase}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert(file.includes("benchmarks/scripts/check-boundary-skill-install-readiness.js"), `${relativePath} must link benchmarks/scripts/check-boundary-skill-install-readiness.js`);
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-boundary-skill-install-readiness.js"),
      `${scriptName} must include check-boundary-skill-install-readiness.js`
    );
  }

  console.log("boundary skill install readiness check passed");
}

main();
