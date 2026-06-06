const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-manual-install-review-packet.md");
const validPacketPath = path.join(root, "hooks", "claude", "examples", "manual-install-review-packet.valid.md");
const invalidPacketPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "manual-install-review-packet.invalid-settings-fragment.md"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Manual Install Review Packet",
  "review packet only",
  "not a live settings fragment",
  "not an installer",
  "not hook setup guidance",
  "User approval required.",
  "agent must not edit settings",
  "abk-claude-hook",
  "native-payload-with-carrier",
  "metadataCarrier",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "docs/claude-hook-native-command-input-contract.md",
  "benchmarks/scripts/check-claude-hook-native-command-entrypoint.js",
  "benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js",
  "hooks/claude/examples/manual-install-review-packet.valid.md",
  "hooks/claude/examples/manual-install-review-packet.invalid-settings-fragment.md",
  "node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js",
  "npm run bench:check",
  "npm run bench:check:red",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
];

const requiredValidPhrases = [
  "# Valid Claude Hook Manual Install Review Packet",
  "Review packet only.",
  "User approval required.",
  "Agent must not edit settings.",
  "Command candidate: `abk-claude-hook`.",
  "Input mode: `native-payload-with-carrier`.",
  "Required carrier: `metadataCarrier`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-manual-install-document.js`.",
  "Official hooks reference: `https://code.claude.com/docs/en/hooks`.",
  "Official settings reference: `https://code.claude.com/docs/en/configuration`.",
  "No raw private transcripts.",
  "No automatic hook installation.",
  "No repository mutation.",
];

const forbiddenPacketPhrases = [
  '"hooks": {',
  '"PostToolUse"',
  '"PreToolUse"',
  "Copy-Item",
  "New-Item",
  "Remove-Item",
  "Set-Content",
  "Out-File",
  "Add-Content",
  "cp -R",
  "mkdir -p",
  "rm -rf",
  ".claude/settings",
  ".claude/settings.json",
  ".claude/settings.local.json",
  "Paste this into",
  "Run this command",
  "claude config",
  "autoInstall: true",
  "\"autoInstall\": true",
  "npm install -g",
  "npx ",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-manual-install-contract.md",
  "docs/claude-hook-manual-install-language-fixtures.md",
  "hooks/claude/README.md",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/installer.js",
  "hooks/claude/install.js",
];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readRelative(relativePath) {
  return read(path.join(root, relativePath));
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function assertIncludesAll(markdown, phrases, label) {
  for (const phrase of phrases) {
    assert.ok(markdown.includes(phrase), `${label} missing phrase: ${phrase}`);
  }
}

function main() {
  for (const filePath of [docPath, validPacketPath, invalidPacketPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validPacket = read(validPacketPath);
  const invalidPacket = read(invalidPacketPath);
  const packageJson = JSON.parse(read(packagePath));

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook manual install review packet doc");
  assertIncludesAll(validPacket, requiredValidPhrases, "valid manual install review packet");

  for (const phrase of forbiddenPacketPhrases) {
    assert.ok(!doc.includes(phrase), `review packet doc includes forbidden phrase: ${phrase}`);
    assert.ok(!validPacket.includes(phrase), `valid review packet includes forbidden phrase: ${phrase}`);
  }

  assert.ok(invalidPacket.includes('"hooks": {'), "invalid review packet must include live hooks JSON");
  assert.ok(invalidPacket.includes("Paste this into"), "invalid review packet must include paste instruction");
  assert.ok(invalidPacket.includes(".claude/settings.json"), "invalid review packet must include direct settings path");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-manual-install-review-packet.md"),
      `${relativePath} must link docs/claude-hook-manual-install-review-packet.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-manual-install-review-packet.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-manual-install-review-packet.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js"
      ),
      `${scriptName} must include check-claude-hook-manual-install-review-packet.js`
    );
  }

  console.log("Claude hook manual install review packet check passed");
}

main();
