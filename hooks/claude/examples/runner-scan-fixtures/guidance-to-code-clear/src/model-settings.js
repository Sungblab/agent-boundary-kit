const fs = require("node:fs");
const path = require("node:path");

function loadModelConfig() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config", "models.json"), "utf8"));
}

function getSelectedModel(userSettings = {}) {
  const config = loadModelConfig();
  if (config.availableModels.includes(userSettings.selectedModel)) {
    return userSettings.selectedModel;
  }
  return config.defaultModel;
}

function getSettingsLabel() {
  return "Model";
}

module.exports = { getSelectedModel, getSettingsLabel, loadModelConfig };
