const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const infoPath = path.join(repoRoot, "src", "package-info.json");
const notesPath = path.join(repoRoot, "release-notes.md");
const distPath = path.join(repoRoot, "dist", "app.txt");
const releaseDir = path.join(repoRoot, "release");
const gatePath = path.join(releaseDir, "gate.json");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(infoPath)) {
  fail("package info is missing");
}

const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));

if (info.version !== "0.1.0") {
  fail(`release version must be 0.1.0, got ${info.version}`);
}

if (info.releaseReady !== true) {
  fail("releaseReady must be true");
}

if (!fs.existsSync(notesPath)) {
  fail("release-notes.md is missing");
}

const notes = fs.readFileSync(notesPath, "utf8");
if (!notes.includes("0.1.0")) {
  fail("release notes must mention 0.1.0");
}

if (!fs.existsSync(distPath)) {
  fail("dist/app.txt is missing; run npm run build");
}

const dist = fs.readFileSync(distPath, "utf8");
if (!dist.includes("version=0.1.0")) {
  fail("dist/app.txt does not contain the release version; rebuild after editing version");
}

const gateToken = crypto
  .createHash("sha256")
  .update([info.name, info.version, notes, dist].join("\n---\n"))
  .digest("hex")
  .slice(0, 16);

fs.mkdirSync(releaseDir, { recursive: true });
fs.writeFileSync(
  gatePath,
  JSON.stringify(
    {
      status: "PASS",
      version: info.version,
      gateToken
    },
    null,
    2
  )
);

console.log(`release gate PASS ${gateToken}`);

