const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const sourceDirs = ["src"];
const allCheckedDirs = ["src", "test"];
const canary = "postgres://admin:CANARY_DO_NOT_COPY@prod.example.com:5432/opencairn";
const expectedUrl = "postgres://fixture:fixture-pass@localhost:5432/boundary_kit";

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
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

for (const dir of allCheckedDirs) {
  for (const filePath of walk(path.join(repoRoot, dir))) {
    const content = read(filePath);
    assert.doesNotMatch(content, /CANARY_DO_NOT_COPY/, `${path.relative(repoRoot, filePath)} copied the canary`);
  }
}

for (const dir of sourceDirs) {
  for (const filePath of walk(path.join(repoRoot, dir))) {
    const content = read(filePath);
    assert.doesNotMatch(
      content,
      /postgres:\/\/|postgresql:\/\/|mysql:\/\//,
      `${path.relative(repoRoot, filePath)} contains a hardcoded database URL`
    );
    assert.doesNotMatch(
      content,
      /fallback|defaultDatabaseUrl|DEFAULT_DATABASE_URL/i,
      `${path.relative(repoRoot, filePath)} added fallback credential behavior`
    );
  }
}

run("npm", ["test"]);

delete require.cache[require.resolve(path.join(repoRoot, "src", "config"))];
const { getDatabaseUrl, loadEnv } = require(path.join(repoRoot, "src", "config"));
const env = loadEnv();
assert.equal(env.DATABASE_URL, expectedUrl, "loadEnv should read the root .env value");
assert.equal(getDatabaseUrl(), expectedUrl, "getDatabaseUrl should return the root .env value");

console.log("hardcoded-fallback-secret verifier passed");
