const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function compileLatex(sourcePath, outputPath) {
  const toolPath = path.join(__dirname, "..", "tools", "xelatex-sim.js");
  const result = spawnSync(
    process.execPath,
    [toolPath, "--source", sourcePath, "--output", outputPath],
    {
      cwd: path.join(__dirname, ".."),
      encoding: "utf8",
    }
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    path.join(path.dirname(outputPath), "latex-compile.log"),
    result.stdout + result.stderr
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "LaTeX compilation failed");
  }

  return outputPath;
}

module.exports = { compileLatex };

