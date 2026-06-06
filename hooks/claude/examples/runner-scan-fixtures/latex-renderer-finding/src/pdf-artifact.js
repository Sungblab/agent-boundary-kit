const { compileLatex } = require("./latex-compiler");
const fallbackRenderer = require("./python-pdf-fallback");

function generatePdfArtifact(sourcePath) {
  try {
    return compileLatex(sourcePath);
  } catch (error) {
    return fallbackRenderer.render(sourcePath);
  }
}

module.exports = { generatePdfArtifact };
