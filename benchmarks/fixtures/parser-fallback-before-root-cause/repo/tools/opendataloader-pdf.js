const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const inputIndex = args.indexOf("--input");
const outputIndex = args.indexOf("--output");

if (inputIndex === -1 || outputIndex === -1) {
  process.stderr.write("usage: opendataloader-pdf --input <path> --output <path>\n");
  process.exit(2);
}

const inputPath = args[inputIndex + 1];
const outputPath = args[outputIndex + 1];

if (!fs.existsSync(inputPath)) {
  process.stderr.write(`input not found: ${inputPath}\n`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      parser: "opendataloader-pdf",
      input: inputPath,
      text: "Fixture PDF parsed by opendataloader-pdf"
    },
    null,
    2
  )
);

