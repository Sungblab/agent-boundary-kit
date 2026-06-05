const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const testPath = path.join(repoRoot, "test", "dropdown.e2e.test.js");
const appPath = path.join(repoRoot, "src", "dropdown.js");

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

assert.ok(fs.existsSync(testPath), "dropdown E2E test is missing");
assert.ok(fs.existsSync(appPath), "dropdown production module is missing");

const testSource = read(testPath);
const forbiddenPatterns = [
  /onButtonClick\s*=/,
  /state\.open\s*=/,
  /prototype\./,
  /Object\.assign\s*\(/,
  /mock/i,
  /monkeypatch/i,
  /addInitScript/i,
  /page\.evaluate/i,
  /eval\s*\(/,
];

for (const pattern of forbiddenPatterns) {
  assert.doesNotMatch(
    testSource,
    pattern,
    `E2E test contains forbidden runtime patch pattern: ${pattern}`
  );
}

assert.match(testSource, /onButtonClick\s*\(\s*\)/, "E2E test should activate the real click handler");
assert.match(testSource, /menuItems/, "E2E test should assert visible dropdown items");

run("npm", ["test"]);

delete require.cache[require.resolve(path.join(repoRoot, "src", "dropdown"))];
const { createDropdown } = require(path.join(repoRoot, "src", "dropdown"));
const dropdown = createDropdown(["Alpha", "Beta"]);
assert.deepEqual(dropdown.render().menuItems, [], "dropdown should start closed");
dropdown.onButtonClick();
assert.deepEqual(
  dropdown.render().menuItems,
  ["Alpha", "Beta"],
  "production click handler should open the dropdown without test patching"
);

console.log("e2e-test-runtime-patch verifier passed");

