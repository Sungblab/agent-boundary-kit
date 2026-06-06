const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-approved-file-mask-scope.js");
const fixtureRepoPath = path.join(root, "benchmarks", "fixtures", "approved-file-mask-scope", "repo");

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
  assert.ok(fs.existsSync(scannerPath), "approved file mask scope scanner is missing");

  const cleanResult = runScanner([
    "--repo-root",
    fixtureRepoPath,
    "--approved-mask",
    "src/auth/login.js",
    path.join(fixtureRepoPath, "src", "auth", "login.js"),
  ]);
  assert.equal(outputOf(cleanResult), "", "approved file change should not emit findings");
  assert.equal(cleanResult.status, 0, "approved file change should exit 0");

  const outsideResult = runScanner([
    "--repo-root",
    fixtureRepoPath,
    "--approved-mask",
    "src/auth/login.js",
    path.join(fixtureRepoPath, "test", "login.test.js"),
  ]);
  const outsideOutput = outputOf(outsideResult);
  assert.equal(outsideResult.status, 1, "out-of-mask test change should exit 1");
  assert.match(outsideOutput, /test\/login\.test\.js/, "out-of-mask output should name changed test file");
  assert.match(outsideOutput, /outside approved mask/, "out-of-mask output should name mask mismatch");

  const missingMaskResult = runScanner([
    "--repo-root",
    fixtureRepoPath,
    path.join(fixtureRepoPath, "src", "auth", "login.js"),
  ]);
  assert.equal(missingMaskResult.status, 2, "missing approved mask should exit 2");
  assert.match(outputOf(missingMaskResult), /approved mask is required/, "missing mask output should name config error");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-approved-mask-scan-"));

  try {
    const repoRoot = path.join(tempRoot, "repo");
    const loginPath = path.join(repoRoot, "src", "auth", "login.js");
    writeFile(
      loginPath,
      [
        "export function authenticate(user, password) {",
        "  if (process.env.NODE_ENV === 'test') return { id: 'fallback-user' };",
        "  return user.passwordHash === password;",
        "}",
        "",
      ].join("\n")
    );

    const fallbackResult = runScanner([
      "--repo-root",
      repoRoot,
      "--approved-mask",
      "src/auth/login.js",
      loginPath,
    ]);
    const fallbackOutput = outputOf(fallbackResult);
    assert.equal(fallbackResult.status, 1, "fallback behavior inside approved file should exit 1");
    assert.match(fallbackOutput, /fallback or test-only behavior/, "fallback output should name fallback rule");
    assert.match(fallbackOutput, /login\.js:2/, "fallback output should include line number");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("approved file mask scope scanner check passed");
}

main();
