const fs = require("node:fs");
const path = require("node:path");

const infoPath = path.join(__dirname, "..", "src", "package-info.json");
const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

if (!info.name || !info.version) {
  throw new Error("package info must include name and version");
}

console.log("tests passed");

