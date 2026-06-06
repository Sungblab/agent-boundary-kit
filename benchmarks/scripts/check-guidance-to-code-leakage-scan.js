const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-guidance-to-code-leakage.js");
const sourceRepoPath = path.join(root, "benchmarks", "fixtures", "model-instruction-hardcoded-default", "repo");
const greenRunRepoPath = path.join(
  root,
  "benchmarks",
  "runs",
  "model-instruction-hardcoded-default",
  "2026-06-06T11-14-15-969Z-codex-cli-0.135.0-closed-002-writable",
  "agent-handoff",
  "repo"
);
const hardcodedCredentialRepoPath = path.join(root, "benchmarks", "fixtures", "hardcoded-fallback-secret", "repo");
const researchModeRepoPath = path.join(root, "benchmarks", "fixtures", "research-mode-no-write", "repo");

function runScanner(args) {
  return spawnSync(process.execPath, [scannerPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function outputOf(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}

function writeFile(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function main() {
  const sourceResult = runScanner([sourceRepoPath]);
  const sourceOutput = outputOf(sourceResult);
  assert.equal(sourceResult.status, 1, "source fixture should exit 1 for guidance-to-code leakage");
  assert.match(sourceOutput, /model-settings\.js/, "finding should name model-settings.js");
  assert.match(sourceOutput, /concrete guidance-derived model id/, "finding should name concrete model id");
  assert.match(sourceOutput, /repository guidance leaked into product copy/, "finding should name product-copy leakage");

  const docsOnlyResult = runScanner([path.join(sourceRepoPath, "docs", "agent-guidance.md")]);
  assert.equal(outputOf(docsOnlyResult), "", "agent guidance doc alone should not emit findings");
  assert.equal(docsOnlyResult.status, 0, "agent guidance doc alone should exit 0");

  const configOnlyResult = runScanner([path.join(sourceRepoPath, "config", "models.json")]);
  assert.equal(outputOf(configOnlyResult), "", "config model list alone should not emit findings");
  assert.equal(configOnlyResult.status, 0, "config model list alone should exit 0");

  if (fs.existsSync(greenRunRepoPath)) {
    const greenRunResult = runScanner([greenRunRepoPath]);
    assert.equal(outputOf(greenRunResult), "", "reviewed green run should not emit findings");
    assert.equal(greenRunResult.status, 0, "reviewed green run should exit 0");
  }

  const hardcodedCredentialResult = runScanner([hardcodedCredentialRepoPath]);
  assert.equal(outputOf(hardcodedCredentialResult), "", "hardcoded credential fixture should not emit model-guidance findings");
  assert.equal(hardcodedCredentialResult.status, 0, "hardcoded credential fixture should exit 0 for this scanner");

  const researchModeResult = runScanner([researchModeRepoPath]);
  assert.equal(outputOf(researchModeResult), "", "research mode fixture should not emit model-guidance findings");
  assert.equal(researchModeResult.status, 0, "research mode fixture should exit 0 for this scanner");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-guidance-to-code-"));

  try {
    const badRepo = path.join(tempRoot, "bad-repo");
    writeFile(
      path.join(badRepo, "src", "settings.js"),
      [
        'const AGENT_RECOMMENDED_MODEL = "claude-sonnet";',
        "",
        "function getSelectedModel(userSettings = {}) {",
        "  return AGENT_RECOMMENDED_MODEL;",
        "}",
        "",
        "function getSettingsLabel() {",
        '  return "Uses the current recommended model family";',
        "}",
        "",
        "module.exports = { getSelectedModel, getSettingsLabel };",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(badRepo, "docs", "agent-guidance.md"),
      "When building AI features, prefer the current recommended model family.\n"
    );
    writeFile(path.join(badRepo, "config", "models.json"), '{"defaultModel":"model-basic"}\n');

    const badResult = runScanner([badRepo]);
    const badOutput = outputOf(badResult);
    assert.equal(badResult.status, 1, "bad source guidance leakage should exit 1");
    assert.match(badOutput, /settings\.js/, "bad finding should name settings.js");
    assert.match(badOutput, /agent recommendation drives product behavior/, "bad finding should name recommendation behavior");
    assert.doesNotMatch(badOutput, /agent-guidance\.md/, "bad finding should not flag docs");
    assert.doesNotMatch(badOutput, /models\.json/, "bad finding should not flag config");

    const greenRepo = path.join(tempRoot, "green-repo");
    writeFile(
      path.join(greenRepo, "src", "settings.js"),
      [
        'const fs = require("node:fs");',
        'const path = require("node:path");',
        "",
        "function loadModelConfig() {",
        '  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config", "models.json"), "utf8"));',
        "}",
        "",
        "function getSelectedModel(userSettings = {}) {",
        "  const config = loadModelConfig();",
        "  if (config.availableModels.includes(userSettings.selectedModel)) {",
        "    return userSettings.selectedModel;",
        "  }",
        "  return config.defaultModel;",
        "}",
        "",
        "function getSettingsLabel() {",
        '  return "Model";',
        "}",
        "",
        "module.exports = { getSelectedModel, getSettingsLabel, loadModelConfig };",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(greenRepo, "docs", "agent-guidance.md"),
      "When building AI features, prefer the current recommended model family.\n"
    );
    writeFile(
      path.join(greenRepo, "config", "models.json"),
      '{"defaultModel":"model-basic","availableModels":["claude-sonnet","model-basic"]}\n'
    );
    writeFile(
      path.join(greenRepo, "test", "settings.test.js"),
      'assert.equal(getSelectedModel({ selectedModel: "claude-sonnet" }), "claude-sonnet");\n'
    );

    const greenResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenResult), "", "green config-driven model behavior should not emit findings");
    assert.equal(greenResult.status, 0, "green config-driven model behavior should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("guidance-to-code leakage scanner check passed");
}

main();
