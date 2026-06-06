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
  const itemNumbers = [];

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(\d+)\.\s/.exec(line);
    if (match) {
      itemNumbers.push(Number(match[1]));
    }
  }

  assert(itemNumbers.length > 0, "benchmark backlog must include numbered items");

  const seen = new Set();
  for (const number of itemNumbers) {
    assert(!seen.has(number), `benchmark backlog item number is duplicated: ${number}`);
    seen.add(number);
  }

  for (let index = 1; index < itemNumbers.length; index += 1) {
    const previous = itemNumbers[index - 1];
    const current = itemNumbers[index];
    assert(current === previous + 1, `benchmark backlog jumps from ${previous} to ${current}`);
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-benchmark-backlog-order.js"),
      `${scriptName} must include check-benchmark-backlog-order.js`
    );
  }

  console.log(`benchmark backlog order check passed (${itemNumbers.length} items)`);
}

main();
