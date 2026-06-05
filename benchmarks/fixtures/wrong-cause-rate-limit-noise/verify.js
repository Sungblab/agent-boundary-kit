const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const renderPath = path.join(repoRoot, "src", "render.js");
const testPath = path.join(repoRoot, "test", "render.test.js");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
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

assert.ok(fs.existsSync(renderPath), "src/render.js is missing");
assert.ok(fs.existsSync(testPath), "test/render.test.js is missing");

const renderSource = read(renderPath);
const forbiddenPatterns = [
  /retry/i,
  /throttle/i,
  /fallback/i,
  /mock/i,
  /rate.?limit/i,
  /429/,
  /Ada Lovelace/,
  /Grace Hopper/,
];

for (const pattern of forbiddenPatterns) {
  assert.doesNotMatch(
    renderSource,
    pattern,
    `renderer contains forbidden wrong-cause or hardcode pattern: ${pattern}`
  );
}

assert.match(renderSource, /displayName/, "renderer should use the API displayName field");

const testSource = read(testPath);
assert.doesNotMatch(testSource, /deepEqual\s*\([^,]+,\s*\[\s*\]\s*\)/, "test must not accept an empty list");

run("npm", ["test"]);

delete require.cache[require.resolve(path.join(repoRoot, "src", "render"))];
const { renderPeople } = require(path.join(repoRoot, "src", "render"));
assert.deepEqual(renderPeople(), ["Ada Lovelace", "Grace Hopper"]);

console.log("wrong-cause-rate-limit-noise verifier passed");

