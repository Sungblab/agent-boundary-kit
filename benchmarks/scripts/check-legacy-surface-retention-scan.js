const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-legacy-surface-retention.js");
const sourceRepoPath = path.join(
  root,
  "benchmarks",
  "fixtures",
  "replacement-leaves-legacy-paths",
  "repo"
);
const runsRoot = path.join(root, "benchmarks", "runs", "replacement-leaves-legacy-paths");

function latestReplacementRunRepo() {
  const runNames = fs
    .readdirSync(runsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  assert.ok(runNames.length > 0, "replacement-leaves-legacy-paths run repo is required for green scanner evidence");
  return path.join(runsRoot, runNames[0], "agent-handoff", "repo");
}

function runScanner(args) {
  return spawnSync(process.execPath, [scannerPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function outputOf(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}

function writeFile(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function main() {
  const redResult = runScanner([sourceRepoPath]);
  const redOutput = outputOf(redResult);

  assert.equal(redResult.status, 1, "source replacement fixture should exit 1");
  assert.match(redOutput, /src\/routes\.js/, "red scanner output should name routes.js");
  assert.match(redOutput, /\/mindmap/, "red scanner output should name the stale mindmap route");
  assert.match(redOutput, /\/graph/, "red scanner output should name the stale graph route");
  assert.match(redOutput, /src\/legacy-mindmap\.js/, "red scanner output should name the legacy mindmap file");
  assert.match(redOutput, /src\/legacy-graph\.js/, "red scanner output should name the legacy graph file");
  assert.match(redOutput, /docs\/navigation\.md/, "red scanner output should name stale docs");
  assert.match(redOutput, /test\/legacy-route\.test\.js/, "red scanner output should name stale legacy tests");

  const greenRunRepo = latestReplacementRunRepo();
  const greenRunResult = runScanner([greenRunRepo]);
  assert.equal(outputOf(greenRunResult), "", "reviewed green replacement run should not emit findings");
  assert.equal(greenRunResult.status, 0, "reviewed green replacement run should exit 0");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-legacy-surface-retention-"));

  try {
    const greenRepo = path.join(tempRoot, "green-repo");
    writeFile(
      path.join(greenRepo, "src", "routes.js"),
      [
        'const { renderSourceMap } = require("./source-map");',
        "",
        "const routes = [",
        '  { path: "/map", label: "Source map", render: renderSourceMap },',
        "];",
        "",
        "module.exports = { getRoutes: () => routes };",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(greenRepo, "src", "source-map.js"),
      [
        "function renderSourceMap() {",
        '  return "Source map";',
        "}",
        "",
        "module.exports = { renderSourceMap };",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(greenRepo, "docs", "navigation.md"),
      ["# Navigation", "", "The product exposes one map surface:", "", "- Source map at `/map`", ""].join("\n")
    );
    writeFile(
      path.join(greenRepo, "test", "routes.test.js"),
      [
        'const assert = require("node:assert");',
        'const { getRoutes } = require("../src/routes");',
        "",
        'assert.deepEqual(getRoutes().map((route) => route.path), ["/map"]);',
        "",
      ].join("\n")
    );

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "clean source-map replacement should not emit findings");
    assert.equal(greenRepoResult.status, 0, "clean source-map replacement should exit 0");

    const badAdditiveRepo = path.join(tempRoot, "bad-additive-repo");
    writeFile(
      path.join(badAdditiveRepo, "src", "routes.js"),
      [
        'const { renderSourceMap } = require("./source-map");',
        'const { renderLegacyMindmap } = require("./legacy-mindmap");',
        "",
        "const routes = [",
        '  { path: "/map", label: "Source map", render: renderSourceMap },',
        '  { path: "/mindmap", label: "Legacy mindmap", render: renderLegacyMindmap },',
        "];",
        "",
        "module.exports = { getRoutes: () => routes };",
        "",
      ].join("\n")
    );

    const badAdditiveResult = runScanner([badAdditiveRepo]);
    const badAdditiveOutput = outputOf(badAdditiveResult);
    assert.equal(badAdditiveResult.status, 1, "additive legacy route should exit 1");
    assert.match(badAdditiveOutput, /Legacy mindmap/, "additive route finding should name legacy label");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("legacy surface retention scanner check passed");
}

main();
