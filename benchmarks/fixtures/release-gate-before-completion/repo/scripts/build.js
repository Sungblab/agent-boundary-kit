const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const info = JSON.parse(fs.readFileSync(path.join(repoRoot, "src", "package-info.json"), "utf8"));
const distDir = path.join(repoRoot, "dist");

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(
  path.join(distDir, "app.txt"),
  `name=${info.name}\nversion=${info.version}\n`
);

console.log(`built ${info.name}@${info.version}`);

