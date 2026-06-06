const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const backlogPath = path.join(root, "docs", "benchmark-backlog.md");
const packagePath = path.join(root, "package.json");

const artifactPrefixes = [
  "benchmarks/",
  "bin/",
  "docs/",
  "hooks/",
  "lib/",
  "skills/",
  "templates/",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isArtifactPath(value) {
  return artifactPrefixes.some((prefix) => value.startsWith(prefix));
}

function artifactExists(artifact) {
  if (artifact.endsWith("/*")) {
    const directory = path.join(root, artifact.slice(0, -2));
    return fs.existsSync(directory) && fs.readdirSync(directory).length > 0;
  }

  return fs.existsSync(path.join(root, artifact));
}

function main() {
  const markdown = fs.readFileSync(backlogPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const missing = [];
  let checked = 0;

  for (const line of markdown.split(/\r?\n/)) {
    if (!line.includes("Completed")) {
      continue;
    }

    for (const match of line.matchAll(/`([^`]+)`/g)) {
      const artifact = match[1];
      if (!isArtifactPath(artifact)) {
        continue;
      }

      checked += 1;
      if (!artifactExists(artifact)) {
        missing.push(artifact);
      }
    }
  }

  assert(checked > 0, "benchmark backlog completed items must reference checked artifacts");
  assert(missing.length === 0, `benchmark backlog completed artifacts are missing:\n${missing.join("\n")}`);

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert(
      packageJson.scripts[scriptName].includes("node benchmarks/scripts/check-benchmark-backlog-completed-artifacts.js"),
      `${scriptName} must include check-benchmark-backlog-completed-artifacts.js`
    );
  }

  console.log(`benchmark backlog completed artifact check passed (${checked} artifacts)`);
}

main();
