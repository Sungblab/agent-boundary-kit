const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const sourceIndex = args.indexOf("--source");
const outputIndex = args.indexOf("--output");

if (sourceIndex === -1 || outputIndex === -1) {
  process.stderr.write("usage: xelatex-sim --source <path> --output <path>\n");
  process.exit(2);
}

const sourcePath = args[sourceIndex + 1];
const outputPath = args[outputIndex + 1];

if (!fs.existsSync(sourcePath)) {
  process.stderr.write(`LaTeX source not found: ${sourcePath}\n`);
  process.exit(1);
}

const source = fs.readFileSync(sourcePath, "utf8");

if (!source.includes("\\documentclass")) {
  process.stderr.write("LaTeX source is missing documentclass\n");
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  "%PDF-1.4\nReport artifact from LaTeX\ngenerated_by=xelatex-simulator\n"
);
process.stdout.write(`compiled ${sourcePath} -> ${outputPath}\n`);

