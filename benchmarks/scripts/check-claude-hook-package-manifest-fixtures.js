const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-package-manifest-fixtures.md");
const validManifestPath = path.join(root, "hooks", "claude", "examples", "package-manifest.valid.json");
const invalidAutoInstallManifestPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "package-manifest.invalid-auto-install.json"
);
const packagePath = path.join(root, "package.json");

const hookIds = [
  "pre_write_boundary_check",
  "post_edit_scope_check",
  "test_integrity_check",
  "completion_evidence_check",
];

const forbiddenManifestKeys = [
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "prompt",
  "assistantResponse",
  "secret",
  "cookie",
  "token",
  "password",
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
  "postInstall",
  "installScript",
  "watcher",
  "connector",
  "dashboard",
  "saasWorkflow",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-packaging-contract.md",
  "hooks/claude/README.md",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function findForbiddenKey(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findForbiddenKey(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (forbiddenManifestKeys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findForbiddenKey(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function validateManifest(manifest) {
  const forbidden = findForbiddenKey(manifest);
  if (forbidden) {
    return { ok: false, reason: `forbidden manifest field ${forbidden}` };
  }

  if (manifest.status !== "fixture-only") {
    return { ok: false, reason: "manifest status must be fixture-only" };
  }

  if (manifest.contract !== "docs/claude-hook-packaging-contract.md") {
    return { ok: false, reason: "manifest must cite docs/claude-hook-packaging-contract.md" };
  }

  if (!manifest.installation || manifest.installation.mode !== "manual-review-only") {
    return { ok: false, reason: "manifest installation mode must be manual-review-only" };
  }

  if (manifest.installation.autoInstall !== false) {
    return { ok: false, reason: "manifest autoInstall must be false" };
  }

  if (!Array.isArray(manifest.hooks) || manifest.hooks.length !== hookIds.length) {
    return { ok: false, reason: "manifest must declare exactly the supported hook ids" };
  }

  for (const hookId of hookIds) {
    const hook = manifest.hooks.find((entry) => entry.hookId === hookId);
    if (!hook) {
      return { ok: false, reason: `missing hook entry ${hookId}` };
    }
    for (const command of [
      "abk-runner map-event --input <hook-event.json>",
      "abk-runner dry-run --input <runner-input.json>",
      "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
    ]) {
      if (!hook.commands || !hook.commands.includes(command)) {
        return { ok: false, reason: `${hookId} missing command ${command}` };
      }
    }
  }

  return { ok: true, reason: "valid" };
}

function main() {
  for (const filePath of [docPath, validManifestPath, invalidAutoInstallManifestPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  for (const phrase of [
    "# Claude Hook Package Manifest Fixtures",
    "docs/claude-hook-packaging-contract.md",
    "hooks/claude/examples/package-manifest.valid.json",
    "hooks/claude/examples/package-manifest.invalid-auto-install.json",
    "fixture-only",
    "manual-review-only",
    "autoInstall",
    "abk-runner map-event --input <hook-event.json>",
    "abk-runner dry-run --input <runner-input.json>",
    "abk-runner scan --input <runner-input.json> --scanner <scanner-id>",
    "No raw private transcripts",
    "No automatic hook installation",
    "Do not install Claude hooks yet",
    "Do not add installer code",
    "Do not execute scanners before map-event succeeds",
    "Do not generate final copy",
  ]) {
    assert.ok(doc.includes(phrase), `Claude hook package manifest fixtures doc missing phrase: ${phrase}`);
  }

  const validManifest = readJson(validManifestPath);
  const validResult = validateManifest(validManifest);
  assert.equal(validResult.ok, true, `valid package manifest should pass: ${validResult.reason}`);

  const invalidAutoInstallManifest = readJson(invalidAutoInstallManifestPath);
  const invalidResult = validateManifest(invalidAutoInstallManifest);
  assert.equal(invalidResult.ok, false, "invalid auto-install manifest should fail");
  assert.ok(
    invalidResult.reason.includes("autoInstall") || invalidResult.reason.includes("forbidden manifest field"),
    `invalid auto-install reason mismatch: ${invalidResult.reason}`
  );

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-package-manifest-fixtures.md"),
      `${relativePath} must link docs/claude-hook-package-manifest-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js`
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-package-manifest-fixtures.js`
    );
  }

  console.log("Claude hook package manifest fixtures check passed");
}

main();
