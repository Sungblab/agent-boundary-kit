const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function readDoc(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${relativePath}: missing required case study`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function assertIncludes(markdown, expected, label) {
  if (!markdown.includes(expected)) {
    throw new Error(`${label}: missing ${expected}`);
  }
}

const researchModeCaseStudy = readDoc("docs/case-study-research-mode-no-write.md");
const testPassingCaseStudy = readDoc("docs/case-study-test-passing-not-merge-worthy.md");

for (const required of [
  "# Case Study: Research Mode No Write",
  "case-22",
  "research-mode-no-write",
  "intent command misrouting",
  "benchmarks/results/research-mode-no-write-codex-cli-0.135.0-closed-001.md",
  "benchmarks/results/research-mode-no-write-codex-cli-0.135.0-closed-002.md",
  "docs/scanner-validation-research-mode-no-write.md",
  "docs/scanner-application-research-mode-no-write.md",
  "benchmarks/scripts/scan-research-mode-no-write.js",
  "What ABK Adds",
  "Limits",
]) {
  assertIncludes(researchModeCaseStudy, required, "research mode no-write case study");
}

for (const required of [
  "# Case Study: Test-Passing Not Merge-Worthy",
  "test-passing-not-merge-worthy",
  "docs/web-research-agent-boundary-failures-2026.md#priority-4-test-passing-not-merge-worthy-case-study",
  "test-passing over correctness",
  "evidence-free completion",
  "release-gate-before-completion",
  "bad-test-fake-precedence",
  "e2e-test-runtime-patch",
  "overmocked-test-bypasses-contract",
  "What ABK Adds",
  "Evidence Gap",
  "Limits",
]) {
  assertIncludes(testPassingCaseStudy, required, "test-passing not-merge-worthy case study");
}

console.log("case studies check passed");
