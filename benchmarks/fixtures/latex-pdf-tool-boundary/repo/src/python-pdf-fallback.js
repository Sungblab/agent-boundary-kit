const fs = require("node:fs");
const path = require("node:path");

function generateWithPythonPdf() {
  const buildDir = path.join(__dirname, "..", "build");
  const outputPath = path.join(buildDir, "report.pdf");
  fs.mkdirSync(buildDir, { recursive: true });
  fs.writeFileSync(path.join(buildDir, "python-pdf-fallback.log"), "fallback invoked\n");
  fs.writeFileSync(
    outputPath,
    "%PDF-1.4\nReport artifact from LaTeX\nfallback=python-pdf-fallback\n"
  );
  return outputPath;
}

module.exports = { generateWithPythonPdf };

