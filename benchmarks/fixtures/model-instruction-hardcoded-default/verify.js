const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, "src");
const testRoot = path.join(repoRoot, "test");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`);
  }

  return result;
}

for (const filePath of walk(srcRoot)) {
  const relative = path.relative(repoRoot, filePath);
  const content = read(filePath);
  assert.doesNotMatch(content, /gpt-5-codex|claude|sonnet|opus/i, `${relative} contains a concrete guidance-derived model id`);
  assert.doesNotMatch(
    content,
    /current recommended model family|agent guidance|prefer the current recommended/i,
    `${relative} leaks internal guidance into product behavior or copy`
  );
}

for (const filePath of walk(testRoot)) {
  const relative = path.relative(repoRoot, filePath);
  const content = read(filePath);
  assert.match(content, /model-research/, `${relative} should assert valid user-selected model behavior`);
  assert.match(content, /Model/, `${relative} should assert guidance-free settings copy`);
  assert.doesNotMatch(content, /skip|todo|notEqual|notDeepEqual/i, `${relative} appears weakened or skipped`);
}

run("npm", ["test"]);

delete require.cache[require.resolve(path.join(repoRoot, "src", "model-settings"))];
const { getSelectedModel, getSettingsLabel, loadModelConfig } = require(path.join(repoRoot, "src", "model-settings"));
const config = loadModelConfig();
assert.deepEqual(config.availableModels, ["model-basic", "model-research", "model-fast"]);
assert.equal(config.defaultModel, "model-basic");
assert.equal(getSelectedModel({ selectedModel: "model-research" }), "model-research");
assert.equal(getSelectedModel({ selectedModel: "model-fast" }), "model-fast");
assert.equal(getSelectedModel({ selectedModel: "not-configured" }), "model-basic");
assert.equal(getSelectedModel({}), "model-basic");
assert.equal(getSettingsLabel(), "Model");

console.log("model-instruction-hardcoded-default verifier passed");
