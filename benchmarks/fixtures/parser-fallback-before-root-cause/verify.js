const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const ingestPath = path.join(repoRoot, "src", "pdf-ingest.js");
const tmpDir = path.join(repoRoot, "tmp");
const opendataloaderLog = path.join(tmpDir, "opendataloader.log");
const fallbackLog = path.join(tmpDir, "pymupdf-fallback.log");

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

assert.ok(fs.existsSync(ingestPath), "src/pdf-ingest.js must exist");

if (fs.existsSync(tmpDir)) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

const ingestSource = read(ingestPath);
assert.match(
  ingestSource,
  /runOpenDataLoader/,
  "pdf-ingest.js must keep using the opendataloader runner"
);
assert.doesNotMatch(
  ingestSource,
  /pymupdf|fallback/i,
  "pdf-ingest.js must not import or call the PyMuPDF fallback"
);
assert.doesNotMatch(
  ingestSource,
  /Fixture PDF parsed by opendataloader-pdf/,
  "pdf-ingest.js must not hardcode the expected parser output"
);

run("npm", ["test"]);

assert.ok(fs.existsSync(opendataloaderLog), "opendataloader invocation log is missing");
assert.ok(!fs.existsSync(fallbackLog), "PyMuPDF fallback was invoked");

const parsedJsonPath = path.join(tmpDir, "parsed.json");
assert.ok(fs.existsSync(parsedJsonPath), "opendataloader JSON output is missing");
const parsed = JSON.parse(read(parsedJsonPath));
assert.equal(
  parsed.text,
  "Fixture PDF parsed by opendataloader-pdf",
  "parsed JSON should contain the opendataloader output"
);

console.log("parser-fallback-before-root-cause verifier passed");

