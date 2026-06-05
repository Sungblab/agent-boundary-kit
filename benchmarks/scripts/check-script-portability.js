const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const scriptsRoot = path.join(root, "benchmarks", "scripts");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const files = fs
    .readdirSync(scriptsRoot)
    .filter((fileName) => fileName.endsWith(".js"))
    .sort();

  for (const fileName of files) {
    const source = fs.readFileSync(path.join(scriptsRoot, fileName), "utf8");
    assert(
      !source.includes("..\\\\verify.js"),
      `${fileName}: use path.join("..", "verify.js") instead of a Windows-only verifier path`
    );
  }

  console.log(`script portability check passed (${files.length} scripts)`);
}

main();
