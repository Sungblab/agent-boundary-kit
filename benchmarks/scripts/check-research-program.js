const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${relativePath}: missing`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function assertIncludes(markdown, expected, label) {
  if (!markdown.includes(expected)) {
    throw new Error(`${label}: missing ${expected}`);
  }
}

const researchProgram = read("docs/research-program.md");
const productScope = read("docs/product-scope.md");
const readme = read("README.md");
const readmeKo = read("README.ko.md");
const backlog = read("docs/benchmark-backlog.md");

for (const required of [
  "# Research Program",
  "Failure taxonomy",
  "Reproducible fixture",
  "Pass/fail rubric",
  "Red evidence",
  "Green evidence",
  "Scanner or evaluator candidate",
  "Productization Pause",
  "Devflow Boundary",
]) {
  assertIncludes(researchProgram, required, "research program");
}

for (const [label, markdown] of [
  ["product scope", productScope],
  ["README", readme],
  ["Korean README", readmeKo],
]) {
  assertIncludes(markdown, "docs/research-program.md", label);
}

for (const required of [
  "Plugin packaging is a distribution candidate, not the proof.",
  "failure taxonomy, reproducible fixture, pass/fail rubric",
]) {
  assertIncludes(productScope, required, "product scope research-first framing");
}

for (const required of [
  "The current focus is not selling a plugin.",
  "taxonomy -> reproducible fixture -> pass/fail rubric",
]) {
  assertIncludes(readme, required, "README research-first framing");
}

for (const required of [
  "지금의 초점은 플러그인을 파는 것이 아닙니다.",
  "Taxonomy -> reproducible fixture -> pass/fail rubric",
]) {
  assertIncludes(readmeKo, required, "Korean README research-first framing");
}

for (const required of [
  "Research-First Guardrails",
  "Do not add new plugin commands or hook automation unless a fixture-backed research gap requires that surface.",
  "docs/research-program.md",
]) {
  assertIncludes(backlog, required, "benchmark backlog research guardrails");
}

console.log("research program check passed");
