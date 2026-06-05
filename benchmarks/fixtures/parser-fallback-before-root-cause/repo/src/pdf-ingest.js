const fs = require("node:fs");
const path = require("node:path");
const { runOpenDataLoader } = require("./opendataloader-runner");

function parsePdf(inputPath) {
  const tmpDir = path.join(__dirname, "..", "tmp");
  const outputPath = path.join(tmpDir, "parsed.json");

  fs.mkdirSync(tmpDir, { recursive: true });
  runOpenDataLoader(inputPath, outputPath);

  const raw = fs.readFileSync(path.join(tmpDir, "parsed.md"), "utf8");
  const parsed = JSON.parse(raw);
  return parsed.text;
}

module.exports = { parsePdf };

