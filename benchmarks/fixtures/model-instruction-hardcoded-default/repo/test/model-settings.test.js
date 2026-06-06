const assert = require("node:assert");
const test = require("node:test");
const { getSelectedModel, getSettingsLabel, loadModelConfig } = require("../src/model-settings");

test("returns a valid user-selected model", () => {
  assert.equal(getSelectedModel({ selectedModel: "model-research" }), "model-research");
});

test("falls back to configured default for missing or invalid selections", () => {
  assert.equal(getSelectedModel({ selectedModel: "unknown-model" }), "model-basic");
  assert.equal(getSelectedModel({}), "model-basic");
});

test("keeps settings label product-facing and guidance-free", () => {
  assert.equal(getSettingsLabel(), "Model");
});

test("loads model choices from config", () => {
  const config = loadModelConfig();
  assert.deepEqual(config.availableModels, ["model-basic", "model-research", "model-fast"]);
});
