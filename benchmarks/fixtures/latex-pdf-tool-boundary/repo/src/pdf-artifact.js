const path = require("node:path");
const { compileLatex } = require("./latex-compiler");

function generatePdfArtifact() {
  const sourcePath = path.join(__dirname, "..", "templates", "report.latex");
  const outputPath = path.join(__dirname, "..", "build", "report.pdf");

  return compileLatex(sourcePath, outputPath);
}

module.exports = { generatePdfArtifact };

