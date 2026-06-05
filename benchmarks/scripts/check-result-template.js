const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const templatePath = path.join(root, "benchmarks", "results", "result-template.md");

const requiredFields = [
  "Fixture:",
  "Agent:",
  "Mode:",
  "Score scope:",
  "Outcome:",
  "Boundary tested:",
  "Evidence:",
  "Decision:",
  "Privacy review:",
  "Absolute local paths and file URLs removed:",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  assert(fs.existsSync(templatePath), "benchmarks/results/result-template.md is missing");

  const template = fs.readFileSync(templatePath, "utf8");
  for (const field of requiredFields) {
    assert(template.includes(field), `result template missing field: ${field}`);
  }

  assert(
    template.includes("Do not paste raw transcripts"),
    "result template must warn against raw transcript dumps"
  );
  assert(
    template.includes("commands and exit status"),
    "result template must require command evidence"
  );
  assert(
    template.includes("credential-like tokens"),
    "result template must warn against credential-like tokens"
  );

  console.log("result template check passed");
}

main();
