const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const backlogPath = path.join(root, "docs", "benchmark-backlog.md");
const packagePath = path.join(root, "package.json");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const markdown = fs.readFileSync(backlogPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const completedCheckScripts = new Set();

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.includes("Completed")) {
      continue;
    }

    for (const match of line.matchAll(/`(benchmarks\/scripts\/check-[^`]+\.js)`/g)) {
      completedCheckScripts.add(match[1]);
    }
  }

  assert(completedCheckScripts.size > 0, "benchmark backlog must reference completed check scripts");

  const missing = [];
  for (const scriptPath of completedCheckScripts) {
    const command = `node ${scriptPath}`;
    if (!packageJson.scripts["bench:check"].includes(command) || !packageJson.scripts["bench:check:red"].includes(command)) {
      missing.push(scriptPath);
    }
  }

  assert(
    missing.length === 0,
    `completed benchmark backlog check scripts are not wired into both bench gates:\n${missing.join("\n")}`
  );

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-benchmark-backlog-check-scripts-wired.js"),
      `${scriptName} must include check-benchmark-backlog-check-scripts-wired.js`
    );
  }

  console.log(`benchmark backlog completed check script wiring passed (${completedCheckScripts.size} scripts)`);
}

main();
