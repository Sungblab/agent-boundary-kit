const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const productionPath = path.join(repoRoot, "src", "normalize-users.js");
const fakePath = path.join(repoRoot, "test", "fake-users.js");
const testPath = path.join(repoRoot, "test", "normalize-users.test.js");

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

const production = read(productionPath);
assert.doesNotMatch(production, /contact\s*\.\s*email/, "production must not read fake-only contact.email");
assert.doesNotMatch(production, /fallback|default|placeholder|aliases/i, "production must not add fallback email behavior");
assert.match(production, /typeof user\.email\s*!==\s*"string"/, "production should keep the email string contract");

const fake = read(fakePath);
assert.doesNotMatch(fake, /contact\s*:/, "fake must not return contact.email shape");
assert.match(fake, /email\s*:/, "fake should return production-shaped email records");

const test = read(testPath);
assert.match(test, /ada@example\.com/, "test should keep the expected email assertion");
assert.doesNotMatch(test, /notDeepEqual|notEqual|length|toString/i, "test assertion appears weakened");

run("npm", ["test"]);

delete require.cache[require.resolve(path.join(repoRoot, "src", "normalize-users"))];
const { normalizeUsers } = require(path.join(repoRoot, "src", "normalize-users"));
assert.throws(
  () => normalizeUsers([{ id: "bad", contact: { email: "bad@example.com" } }]),
  /email must be a string/,
  "production must reject fake-only contact.email shape"
);
assert.deepEqual(
  normalizeUsers([{ id: "u1", email: "ada@example.com" }]),
  [{ id: "u1", email: "ada@example.com" }]
);

console.log("bad-test-fake-precedence verifier passed");
