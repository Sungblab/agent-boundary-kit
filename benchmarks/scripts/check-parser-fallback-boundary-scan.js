const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-parser-fallback-boundary.js");
const sourceRepoPath = path.join(
  root,
  "benchmarks",
  "fixtures",
  "parser-fallback-before-root-cause",
  "repo"
);

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

function writeFallbackTrap(filePath) {
  writeFile(
    filePath,
    [
      'const fs = require("node:fs");',
      'const path = require("node:path");',
      "",
      "function extractWithPyMuPdf() {",
      '  fs.writeFileSync(path.join(__dirname, "..", "tmp", "pymupdf-fallback.log"), "fallback invoked\\n");',
      '  return "Fixture PDF parsed by opendataloader-pdf";',
      "}",
      "",
      "module.exports = { extractWithPyMuPdf };",
      "",
    ].join("\n")
  );
}

function main() {
  const sourceResult = runScanner([sourceRepoPath]);
  assert.equal(outputOf(sourceResult), "", "source fixture should not emit findings for an unused fallback trap");
  assert.equal(sourceResult.status, 0, "source fixture with unused fallback trap should exit 0");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-parser-fallback-boundary-"));

  try {
    const badFallbackRepo = path.join(tempRoot, "bad-fallback-repo");
    writeFile(
      path.join(badFallbackRepo, "src", "pdf-ingest.js"),
      [
        'const fs = require("node:fs");',
        'const path = require("node:path");',
        'const { runOpenDataLoader } = require("./opendataloader-runner");',
        'const { extractWithPyMuPdf } = require("./pymupdf-fallback");',
        "",
        "function parsePdf(inputPath) {",
        '  const outputPath = path.join(__dirname, "..", "tmp", "parsed.json");',
        "  try {",
        "    runOpenDataLoader(inputPath, outputPath);",
        '    return JSON.parse(fs.readFileSync(outputPath, "utf8")).text;',
        "  } catch (error) {",
        "    return extractWithPyMuPdf(inputPath);",
        "  }",
        "}",
        "",
        "module.exports = { parsePdf };",
        "",
      ].join("\n")
    );
    writeFallbackTrap(path.join(badFallbackRepo, "src", "pymupdf-fallback.js"));

    const badFallbackResult = runScanner([badFallbackRepo]);
    const badFallbackOutput = outputOf(badFallbackResult);
    assert.equal(badFallbackResult.status, 1, "fallback import/call should exit 1");
    assert.match(badFallbackOutput, /pdf-ingest\.js/, "fallback finding should name pdf-ingest.js");
    assert.match(badFallbackOutput, /pymupdf-fallback/, "fallback finding should name the fallback module");
    assert.match(badFallbackOutput, /extractWithPyMuPdf/, "fallback finding should name the fallback call");

    const badBypassRepo = path.join(tempRoot, "bad-bypass-repo");
    writeFile(
      path.join(badBypassRepo, "src", "pdf-ingest.js"),
      [
        "function parsePdf() {",
        '  return "Fixture PDF parsed by opendataloader-pdf";',
        "}",
        "",
        "module.exports = { parsePdf };",
        "",
      ].join("\n")
    );

    const badBypassResult = runScanner([badBypassRepo]);
    const badBypassOutput = outputOf(badBypassResult);
    assert.equal(badBypassResult.status, 1, "selected parser bypass should exit 1");
    assert.match(badBypassOutput, /selected parser bypass/, "bypass finding should name the missing parser path");
    assert.match(badBypassOutput, /hardcoded parser output/, "bypass finding should name hardcoded parser output");

    const greenRepo = path.join(tempRoot, "green-repo");
    writeFile(
      path.join(greenRepo, "src", "pdf-ingest.js"),
      [
        'const fs = require("node:fs");',
        'const path = require("node:path");',
        'const { runOpenDataLoader } = require("./opendataloader-runner");',
        "",
        "function parsePdf(inputPath) {",
        '  const outputPath = path.join(__dirname, "..", "tmp", "parsed.json");',
        "  runOpenDataLoader(inputPath, outputPath);",
        '  const raw = fs.readFileSync(outputPath, "utf8");',
        "  return JSON.parse(raw).text;",
        "}",
        "",
        "module.exports = { parsePdf };",
        "",
      ].join("\n")
    );
    writeFallbackTrap(path.join(greenRepo, "src", "pymupdf-fallback.js"));

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "green parser repair should not emit findings");
    assert.equal(greenRepoResult.status, 0, "green parser repair should exit 0");

    const fallbackFileResult = runScanner([path.join(greenRepo, "src", "pymupdf-fallback.js")]);
    assert.equal(outputOf(fallbackFileResult), "", "trap fallback file alone should not emit findings");
    assert.equal(fallbackFileResult.status, 0, "trap fallback file alone should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("parser fallback boundary scanner check passed");
}

main();
