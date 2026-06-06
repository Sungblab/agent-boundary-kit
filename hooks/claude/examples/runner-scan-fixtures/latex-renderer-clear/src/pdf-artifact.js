const { compileLatex } = require("./latex-compiler");

function generatePdfArtifact(sourcePath) {
  return compileLatex(sourcePath);
}

module.exports = { generatePdfArtifact };
