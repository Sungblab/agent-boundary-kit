const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-user-owned-target-review-packet.md");
const validPacketPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review-packet.valid.md"
);
const invalidAppliedSettingsPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "user-owned-target-review-packet.invalid-agent-applied-settings.md"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook User-Owned Target Review Packet",
  "manual review packet only",
  "not settings application",
  "not an installed hook",
  "not an installer",
  "not a setup script",
  "User-owned target review evidence required.",
  "Agent must not edit settings.",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
  "docs/claude-hook-user-approved-install-language.md",
  "docs/claude-hook-settings-fragment-review.md",
  "docs/claude-hook-wrapper-wiring-review.md",
  "hooks/claude/examples/user-owned-target-review-packet.valid.md",
  "hooks/claude/examples/user-owned-target-review-packet.invalid-agent-applied-settings.md",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js",
  "node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js",
  "node benchmarks/scripts/check-claude-hook-install-application-contract.js",
  "node benchmarks/scripts/check-claude-hook-user-approved-install-language.js",
  "node benchmarks/scripts/check-claude-hook-settings-fragment-review.js",
  "No raw private transcripts",
  "No automatic hook installation",
  "No repository mutation",
  "Do not install Claude hooks",
  "Do not create or edit Claude configuration files",
  "Do not publish shell copy commands",
  "npm run bench:check",
  "npm run bench:check:red",
];

const requiredValidPhrases = [
  "# Valid Claude Hook User-Owned Target Review Packet",
  "Manual review packet only.",
  "User-owned target review evidence required.",
  "Agent must not edit settings.",
  "Source text role: `explicit-install-request`.",
  "Target ownership: user-owned.",
  "Target location: outside this repository.",
  "Target scope: reviewed.",
  "Backup evidence: recorded.",
  "Preflight evidence: recorded.",
  "Settings mutation: not attempted.",
  "Review status: review-only.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-install-application-contract.js`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-user-approved-install-language.js`.",
  "Evidence gate: `node benchmarks/scripts/check-claude-hook-settings-fragment-review.js`.",
  "No raw private transcripts.",
  "No automatic hook installation.",
  "No repository mutation.",
];

const forbiddenPacketPhrases = [
  '"hooks": {',
  '"PostToolUse"',
  '"PreToolUse"',
  "Paste this into",
  "Run this command",
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
  "claude config",
  "npm install -g",
  "npx ",
  "autoInstall: true",
  "\"autoInstall\": true",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-user-owned-target-review-evidence.md",
  "docs/claude-hook-user-owned-target-checklist.md",
  "docs/claude-hook-install-application-contract.md",
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
  "hooks/claude/wrapper.js",
  "hooks/claude/wrapper.ps1",
  "hooks/claude/wrapper.sh",
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
  for (const filePath of [docPath, validPacketPath, invalidAppliedSettingsPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = read(docPath);
  const validPacket = read(validPacketPath);
  const invalidAppliedSettings = read(invalidAppliedSettingsPath);
  const packageJson = JSON.parse(read(packagePath));

  assertIncludesAll(doc, requiredDocPhrases, "Claude hook user-owned target review packet doc");
  assertIncludesAll(validPacket, requiredValidPhrases, "valid target review packet");

  for (const phrase of forbiddenPacketPhrases) {
    assert.ok(!doc.includes(phrase), `target review packet doc includes forbidden phrase: ${phrase}`);
    assert.ok(!validPacket.includes(phrase), `valid target review packet includes forbidden phrase: ${phrase}`);
  }

  assert.ok(invalidAppliedSettings.includes("Paste this into"), "invalid packet must include paste instruction");
  assert.ok(invalidAppliedSettings.includes("Set-Content"), "invalid packet must include settings mutation command");
  assert.ok(
    invalidAppliedSettings.includes(".claude/settings.json"),
    "invalid packet must include direct settings path"
  );

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-user-owned-target-review-packet.md"),
      `${relativePath} must link docs/claude-hook-user-owned-target-review-packet.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js"
      ),
      `${scriptName} must include check-claude-hook-user-owned-target-review-packet.js`
    );
  }

  console.log("Claude hook user-owned target review packet check passed");
}

main();
