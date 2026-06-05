const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function runOpenDataLoader(inputPath, outputPath) {
  const toolPath = path.join(__dirname, "..", "tools", "opendataloader-pdf.js");
  const result = spawnSync(
    process.execPath,
    [toolPath, "--input", inputPath, "--output", outputPath],
    {
      cwd: path.join(__dirname, ".."),
      encoding: "utf8",
    }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "opendataloader-pdf failed");
  }

  fs.mkdirSync(path.join(__dirname, "..", "tmp"), { recursive: true });
  fs.appendFileSync(
    path.join(__dirname, "..", "tmp", "opendataloader.log"),
    `opendataloader-pdf ${inputPath} -> ${outputPath}\n`
  );
}

module.exports = { runOpenDataLoader };

