const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-test-fake-contract.js");
const redRepoPath = path.join(root, "benchmarks", "fixtures", "bad-test-fake-precedence", "repo");

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
  const redResult = runScanner([redRepoPath]);
  const redOutput = outputOf(redResult);

  assert.equal(redResult.status, 1, "red scanner run should exit 1");
  assert.match(redOutput, /fake-users\.js/, "red scanner output should name the fake file");
  assert.match(redOutput, /contact\s*:/, "red scanner output should name the fake-only contact shape");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-test-fake-contract-"));

  try {
    const greenRepo = path.join(tempRoot, "repo");
    writeFile(
      path.join(greenRepo, "test", "fake-users.js"),
      [
        "function makeFakeUsers() {",
        "  return [",
        "    {",
        '      id: "u1",',
        '      email: "ADA@EXAMPLE.COM"',
        "    }",
        "  ];",
        "}",
        "",
        "module.exports = { makeFakeUsers };",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(greenRepo, "test", "normalize-users.test.js"),
      [
        'const assert = require("node:assert");',
        'const { test } = require("node:test");',
        'const { normalizeUsers } = require("../src/normalize-users");',
        'const { makeFakeUsers } = require("./fake-users");',
        "",
        'test("normalizes user email addresses", () => {',
        "  assert.deepEqual(normalizeUsers(makeFakeUsers()), [",
        '    { id: "u1", email: "ada@example.com" }',
        "  ]);",
        "});",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(greenRepo, "src", "normalize-users.js"),
      [
        "function normalizeUsers(users) {",
        "  return users.map((user) => {",
        '    if (typeof user.email !== "string") {',
        '      throw new Error("email must be a string");',
        "    }",
        "",
        "    return {",
        "      id: user.id,",
        "      email: user.email.toLowerCase()",
        "    };",
        "  });",
        "}",
        "",
        "module.exports = { normalizeUsers };",
        "",
      ].join("\n")
    );

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "green scanner run should not emit findings");
    assert.equal(greenRepoResult.status, 0, "green scanner run should exit 0");

    const productionOnlyResult = runScanner([path.join(greenRepo, "src", "normalize-users.js")]);
    assert.equal(outputOf(productionOnlyResult), "", "valid production contract should not emit findings");
    assert.equal(productionOnlyResult.status, 0, "valid production contract should exit 0");

    const badProduction = path.join(tempRoot, "bad-production.js");
    writeFile(
      badProduction,
      [
        "function normalizeUsers(users) {",
        "  return users.map((user) => ({",
        "    id: user.id,",
        "    email: user.contact.email",
        "  }));",
        "}",
        "",
      ].join("\n")
    );

    const badProductionResult = runScanner([badProduction]);
    const badProductionOutput = outputOf(badProductionResult);
    assert.equal(badProductionResult.status, 1, "production contact.email run should exit 1");
    assert.match(badProductionOutput, /bad-production\.js/, "production finding should name the file");
    assert.match(badProductionOutput, /contact\.email/, "production finding should name contact.email");

    const unrelatedFallback = path.join(greenRepo, "src", "python-pdf-fallback.js");
    writeFile(
      unrelatedFallback,
      [
        'const fs = require("node:fs");',
        "",
        "function writeFallbackLog(buildDir) {",
        '  fs.writeFileSync(`${buildDir}/python-pdf-fallback.log`, "fallback invoked\\n");',
        "}",
        "",
        "module.exports = { writeFallbackLog };",
        "",
      ].join("\n")
    );

    const unrelatedFallbackResult = runScanner([unrelatedFallback]);
    assert.equal(outputOf(unrelatedFallbackResult), "", "unrelated fallback file should not emit findings");
    assert.equal(unrelatedFallbackResult.status, 0, "unrelated fallback file should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("test fake contract scanner check passed");
}

main();
