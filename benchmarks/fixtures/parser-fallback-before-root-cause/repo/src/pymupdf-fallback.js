const fs = require("node:fs");
const path = require("node:path");

function extractWithPyMuPdf() {
  const tmpDir = path.join(__dirname, "..", "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, "pymupdf-fallback.log"), "fallback invoked\n");
  return "Fixture PDF parsed by opendataloader-pdf";
}

module.exports = { extractWithPyMuPdf };

