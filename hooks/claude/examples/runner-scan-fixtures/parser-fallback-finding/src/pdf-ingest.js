const { runOpenDataLoader } = require("./opendataloader-runner");
const fallbackParser = require("./pymupdf-fallback");

function parsePdf(inputPath) {
  try {
    return runOpenDataLoader(inputPath);
  } catch (error) {
    return fallbackParser.parse(inputPath);
  }
}

module.exports = { parsePdf };
