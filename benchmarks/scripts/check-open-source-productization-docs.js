const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function readDoc(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${relativePath}: missing required productization doc`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function assertIncludes(markdown, expected, label) {
  if (!markdown.includes(expected)) {
    throw new Error(`${label}: missing ${expected}`);
  }
}

const productScope = readDoc("docs/product-scope.md");
const contribution = readDoc("docs/contributing-boundary-failures.md");
const intakeRubric = readDoc("docs/failure-intake-rubric.md");
const fixtureCriteria = readDoc("docs/fixture-promotion-criteria.md");
const scannerCriteria = readDoc("docs/scanner-promotion-criteria.md");
const mcpPrompt = readDoc("docs/next-mcp-server-contract-prompt.md");
const productPlan = readDoc("docs/open-source-productization-plan.md");
const readme = readDoc("README.md");

for (const [label, markdown] of [
  ["product scope", productScope],
  ["contribution format", contribution],
  ["intake rubric", intakeRubric],
  ["fixture promotion criteria", fixtureCriteria],
  ["scanner promotion criteria", scannerCriteria],
  ["MCP prompt", mcpPrompt],
]) {
  assertIncludes(markdown, "Agent Boundary Kit", label);
  assertIncludes(markdown, "boundary failure", label);
  assertIncludes(markdown, "docs/scanner-coverage-matrix.md", label);
}

for (const required of [
  "final copy",
  "internal direction",
  "reference",
  "example",
  "complaint",
  "constraint",
  "evidence",
  "taste signal",
  "workflow command",
]) {
  assertIncludes(productScope, required, "product scope input role taxonomy");
}

for (const required of [
  "Public Contribution Format",
  "Privacy Neutralization Rules",
  "Acceptance Boundary",
  "Do not submit raw private transcripts",
]) {
  assertIncludes(contribution, required, "contribution format");
}

for (const required of [
  "Intake Decision",
  "accepted as research seed",
  "needs neutralization",
  "out of scope",
  "observable pass/fail",
]) {
  assertIncludes(intakeRubric, required, "failure intake rubric");
}

for (const required of [
  "Fixture Promotion Criteria",
  "prompt.md",
  "expected.md",
  "verify.js",
  "red result",
  "green result",
]) {
  assertIncludes(fixtureCriteria, required, "fixture promotion criteria");
}

for (const required of [
  "Scanner Promotion Criteria",
  "fixture-backed",
  "red evidence",
  "green evidence",
  "read-only",
  "explicit runner input",
]) {
  assertIncludes(scannerCriteria, required, "scanner promotion criteria");
}

for (const required of [
  "shared MCP server contract",
  "list_scanners",
  "validate_runner_input",
  "dry_run",
  "scan",
  "Codex",
  "Claude Code",
  "npm run bench:check",
  "npm run bench:check:red",
]) {
  assertIncludes(mcpPrompt, required, "MCP contract prompt");
}

for (const required of [
  "Do not implement SaaS workflow.",
  "Do not build a web reporting UI.",
  "Do not submit to a marketplace.",
  "Do not perform automatic hook installation.",
]) {
  assertIncludes(mcpPrompt, required, "MCP prompt non-goals");
}

for (const required of [
  "docs/product-scope.md",
  "docs/contributing-boundary-failures.md",
  "docs/failure-intake-rubric.md",
  "docs/fixture-promotion-criteria.md",
  "docs/scanner-promotion-criteria.md",
  "docs/next-mcp-server-contract-prompt.md",
]) {
  assertIncludes(productPlan, required, "open-source productization plan");
  assertIncludes(readme, required, "README contract index");
}

console.log("open-source productization docs check passed");
