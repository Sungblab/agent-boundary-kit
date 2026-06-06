const { runOpenDataLoader } = require("./opendataloader-runner");

function parsePdf(inputPath) {
  return runOpenDataLoader(inputPath);
}

module.exports = { parsePdf };
