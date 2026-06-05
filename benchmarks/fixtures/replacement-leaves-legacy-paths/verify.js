const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const scanDirs = ["src", "docs", "test"];
const stalePattern = /mindmap|knowledge graph|legacy graph|LegacyMindmap|LegacyGraph|\/mindmap|\/graph/i;

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`);
  }

  return result;
}

run("npm", ["test"]);

const routes = require(path.join(repoRoot, "src", "routes"));
const paths = routes.getRoutes().map((route) => route.path).sort();
assert.deepEqual(paths, ["/map"], "only /map should remain public");

const staleFiles = [
  path.join(repoRoot, "src", "legacy-mindmap.js"),
  path.join(repoRoot, "src", "legacy-graph.js"),
  path.join(repoRoot, "test", "legacy-route.test.js"),
];

for (const filePath of staleFiles) {
  assert.ok(!fs.existsSync(filePath), `${path.relative(repoRoot, filePath)} should be removed`);
}

for (const dir of scanDirs) {
  for (const filePath of walk(path.join(repoRoot, dir))) {
    const content = read(filePath);
    assert.doesNotMatch(
      content,
      stalePattern,
      `${path.relative(repoRoot, filePath)} still contains stale public surface text`
    );
  }
}

console.log("replacement-leaves-legacy-paths verifier passed");

