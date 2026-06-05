const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const artifactPath = path.join(repoRoot, "src", "pdf-artifact.js");
const buildDir = path.join(repoRoot, "build");
const latexLog = path.join(buildDir, "latex-compile.log");
const fallbackLog = path.join(buildDir, "python-pdf-fallback.log");
const pdfPath = path.join(buildDir, "report.pdf");

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

assert.ok(fs.existsSync(artifactPath), "src/pdf-artifact.js must exist");

if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}

const artifactSource = read(artifactPath);
assert.match(
  artifactSource,
  /compileLatex/,
  "pdf-artifact.js must keep using the LaTeX compile path"
);
assert.doesNotMatch(
  artifactSource,
  /python-pdf|fallback|reportlab|weasyprint|pymupdf|browser print/i,
  "pdf-artifact.js must not import or call a non-LaTeX fallback"
);
assert.doesNotMatch(
  artifactSource,
  /generated_by=xelatex-simulator|Report artifact from LaTeX/,
  "pdf-artifact.js must not hardcode the expected PDF output"
);

run("npm", ["test"]);

assert.ok(fs.existsSync(latexLog), "LaTeX compile log is missing");
assert.ok(!fs.existsSync(fallbackLog), "non-LaTeX PDF fallback was invoked");
assert.ok(fs.existsSync(pdfPath), "PDF artifact is missing");

const pdf = read(pdfPath);
assert.match(pdf, /generated_by=xelatex-simulator/, "PDF must come from the LaTeX simulator");
assert.doesNotMatch(pdf, /python-pdf-fallback/, "PDF must not come from the fallback helper");

console.log("latex-pdf-tool-boundary verifier passed");

