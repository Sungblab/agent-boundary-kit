const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const benchmarksRoot = path.join(root, "benchmarks");
const fixturesRoot = path.join(benchmarksRoot, "fixtures");
const manifestPath = path.join(benchmarksRoot, "fixture-manifest.json");
const runRed = process.argv.includes("--red");

const requiredTopLevelFiles = ["prompt.md", "trap.md", "expected.md", "notes.md", "verify.js"];
const cleanupDirs = ["tmp", "build", "dist", "release"];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function listFixtureDirs() {
  return fs
    .readdirSync(fixturesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function safeRemoveGeneratedDirs(repoRoot) {
  for (const name of cleanupDirs) {
    const target = path.join(repoRoot, name);
    if (!fs.existsSync(target)) {
      continue;
    }

    const resolved = fs.realpathSync(target);
    const resolvedRepo = fs.realpathSync(repoRoot);
    assert(
      resolved.startsWith(resolvedRepo),
      `refusing to clean outside fixture repo: ${resolved}`
    );
    fs.rmSync(resolved, { recursive: true, force: true });
  }
}

function runVerifierExpectingFailure(fixtureId) {
  const repoRoot = path.join(fixturesRoot, fixtureId, "repo");
  safeRemoveGeneratedDirs(repoRoot);

  const result = spawnSync(process.execPath, [path.join("..", "verify.js")], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  safeRemoveGeneratedDirs(repoRoot);

  assert(
    result.status !== 0,
    `${fixtureId}: initial verifier unexpectedly passed`
  );
}

function main() {
  const manifest = readJson(manifestPath);
  assert(Array.isArray(manifest.fixtures), "manifest.fixtures must be an array");

  const ids = manifest.fixtures.map((fixture) => fixture.id);
  const uniqueIds = new Set(ids);
  assert(uniqueIds.size === ids.length, "fixture ids must be unique");

  const dirs = listFixtureDirs();
  const sortedIds = [...ids].sort();
  assert(
    JSON.stringify(dirs) === JSON.stringify(sortedIds),
    `fixture directories must match manifest ids\nmanifest=${sortedIds.join(",")}\ndirs=${dirs.join(",")}`
  );

  for (const fixture of manifest.fixtures) {
    const fixtureDir = path.join(fixturesRoot, fixture.id);
    const repoDir = path.join(fixtureDir, "repo");

    assert(fs.existsSync(fixtureDir), `${fixture.id}: fixture directory is missing`);
    assert(fs.existsSync(repoDir), `${fixture.id}: repo directory is missing`);
    assert(fs.existsSync(path.join(repoDir, "package.json")), `${fixture.id}: repo package.json is missing`);

    for (const file of requiredTopLevelFiles) {
      assert(fs.existsSync(path.join(fixtureDir, file)), `${fixture.id}: ${file} is missing`);
    }

    assert(
      fixture.initialVerifier === "fail",
      `${fixture.id}: initialVerifier must be "fail"`
    );
    assert(
      Array.isArray(fixture.failureTypes) && fixture.failureTypes.length > 0,
      `${fixture.id}: failureTypes must be non-empty`
    );

    if (runRed) {
      runVerifierExpectingFailure(fixture.id);
    }
  }

  const suffix = runRed ? " and red-state checks" : "";
  console.log(`fixture manifest${suffix} passed (${manifest.fixtures.length} fixtures)`);
}

main();
