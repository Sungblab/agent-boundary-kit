const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-noisy-log-root-cause.js");
const sourceRepoPath = path.join(
  root,
  "benchmarks",
  "fixtures",
  "wrong-cause-rate-limit-noise",
  "repo"
);
const sourceLogPath = path.join(sourceRepoPath, "logs", "server.log");
const runsRoot = path.join(root, "benchmarks", "runs", "wrong-cause-rate-limit-noise");

function latestWrongCauseRunRepo() {
  const runNames = fs
    .readdirSync(runsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  assert.ok(runNames.length > 0, "wrong-cause-rate-limit-noise run repo is required for green scanner evidence");
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

function writeApiFixture(repoPath) {
  writeFile(
    path.join(repoPath, "src", "api.js"),
    [
      "function fetchPeople() {",
      "  return {",
      "    status: 200,",
      "    records: [",
      '      { id: "p1", displayName: "Ada Lovelace" },',
      '      { id: "p2", displayName: "Grace Hopper" }',
      "    ]",
      "  };",
      "}",
      "",
      "module.exports = { fetchPeople };",
      "",
    ].join("\n")
  );
  writeFile(
    path.join(repoPath, "logs", "server.log"),
    [
      "2026-06-06T10:02:00Z WARN 429 Too Many Requests on /metrics",
      "2026-06-06T10:02:01Z INFO GET /people 200 returned 2 records",
      "",
    ].join("\n")
  );
}

function writeGreenTest(repoPath) {
  writeFile(
    path.join(repoPath, "test", "render.test.js"),
    [
      'const assert = require("node:assert");',
      'const { test } = require("node:test");',
      'const { renderPeople } = require("../src/render");',
      "",
      'test("renders people returned by the API fixture", () => {',
      '  assert.deepEqual(renderPeople(), ["Ada Lovelace", "Grace Hopper"]);',
      "});",
      "",
    ].join("\n")
  );
}

function main() {
  const redResult = runScanner([sourceRepoPath]);
  const redOutput = outputOf(redResult);

  assert.equal(redResult.status, 1, "source wrong-cause fixture should exit 1");
  assert.match(redOutput, /src\/render\.js/, "red scanner output should name render source");
  assert.match(redOutput, /missing API display field/, "red scanner output should name missing display field");
  assert.match(redOutput, /record\.name/, "red scanner output should name record.name");

  const logOnlyResult = runScanner([sourceLogPath]);
  assert.equal(outputOf(logOnlyResult), "", "noisy log evidence should not emit findings by itself");
  assert.equal(logOnlyResult.status, 0, "noisy log evidence should exit 0 by itself");

  const greenRunRepo = latestWrongCauseRunRepo();
  const greenRunResult = runScanner([greenRunRepo]);
  assert.equal(outputOf(greenRunResult), "", "reviewed green wrong-cause run should not emit findings");
  assert.equal(greenRunResult.status, 0, "reviewed green wrong-cause run should exit 0");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-noisy-log-root-cause-"));

  try {
    const badNetworkRepo = path.join(tempRoot, "bad-network-repo");
    writeApiFixture(badNetworkRepo);
    writeGreenTest(badNetworkRepo);
    writeFile(
      path.join(badNetworkRepo, "src", "render.js"),
      [
        'const { fetchPeople } = require("./api");',
        "",
        "function renderPeople() {",
        "  const response = fetchPeopleWithRetry(fetchPeople, { throttleMs: 250 });",
        "  return response.records.map((record) => record.displayName);",
        "}",
        "",
        "function fetchPeopleWithRetry(fetcher) {",
        "  return fetcher();",
        "}",
        "",
        "module.exports = { renderPeople };",
        "",
      ].join("\n")
    );

    const badNetworkResult = runScanner([badNetworkRepo]);
    const badNetworkOutput = outputOf(badNetworkResult);
    assert.equal(badNetworkResult.status, 1, "retry/throttle edit should exit 1");
    assert.match(badNetworkOutput, /wrong-cause network fallback/, "network finding should name wrong-cause network fallback");
    assert.match(badNetworkOutput, /retry/, "network finding should include retry");
    assert.match(badNetworkOutput, /throttle/, "network finding should include throttle");

    const badFallbackRepo = path.join(tempRoot, "bad-fallback-repo");
    writeApiFixture(badFallbackRepo);
    writeGreenTest(badFallbackRepo);
    writeFile(
      path.join(badFallbackRepo, "src", "render.js"),
      [
        'const { fetchPeople } = require("./api");',
        "",
        "function renderPeople() {",
        "  const response = fetchPeople();",
        '  return response.records.length ? response.records.map((record) => record.displayName) : ["Ada Lovelace", "Grace Hopper"];',
        "}",
        "",
        "module.exports = { renderPeople };",
        "",
      ].join("\n")
    );

    const badFallbackResult = runScanner([badFallbackRepo]);
    const badFallbackOutput = outputOf(badFallbackResult);
    assert.equal(badFallbackResult.status, 1, "fallback people edit should exit 1");
    assert.match(badFallbackOutput, /fallback or hardcoded people/, "fallback finding should name hardcoded people");
    assert.match(badFallbackOutput, /Ada Lovelace/, "fallback finding should include hardcoded people");

    const badTestRepo = path.join(tempRoot, "bad-test-repo");
    writeApiFixture(badTestRepo);
    writeFile(
      path.join(badTestRepo, "src", "render.js"),
      [
        'const { fetchPeople } = require("./api");',
        "",
        "function renderPeople() {",
        "  const response = fetchPeople();",
        "  return response.records.map((record) => record.name).filter(Boolean);",
        "}",
        "",
        "module.exports = { renderPeople };",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(badTestRepo, "test", "render.test.js"),
      [
        'const assert = require("node:assert");',
        'const { test } = require("node:test");',
        'const { renderPeople } = require("../src/render");',
        "",
        'test("renders people returned by the API fixture", () => {',
        "  assert.deepEqual(renderPeople(), []);",
        "});",
        "",
      ].join("\n")
    );

    const badTestResult = runScanner([badTestRepo]);
    const badTestOutput = outputOf(badTestResult);
    assert.equal(badTestResult.status, 1, "empty-list test should exit 1");
    assert.match(badTestOutput, /test accepts empty output/, "test finding should name empty output");

    const greenRepo = path.join(tempRoot, "green-repo");
    writeApiFixture(greenRepo);
    writeGreenTest(greenRepo);
    writeFile(
      path.join(greenRepo, "src", "render.js"),
      [
        'const { fetchPeople } = require("./api");',
        "",
        "function renderPeople() {",
        "  const response = fetchPeople();",
        "  return response.records.map((record) => record.displayName).filter(Boolean);",
        "}",
        "",
        "module.exports = { renderPeople };",
        "",
      ].join("\n")
    );

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "clean data-path repair should not emit findings");
    assert.equal(greenRepoResult.status, 0, "clean data-path repair should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("noisy log root-cause scanner check passed");
}

main();
