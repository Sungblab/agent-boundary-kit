const fs = require("node:fs");
const path = require("node:path");

const AGENT_RECOMMENDED_MODEL = "gpt-5-codex";

function loadModelConfig() {
  const configPath = path.join(__dirname, "..", "config", "models.json");
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

function getSelectedModel(userSettings = {}) {
  const config = loadModelConfig();
  if (config.availableModels.includes(AGENT_RECOMMENDED_MODEL)) {
    return AGENT_RECOMMENDED_MODEL;
  }
  return "gpt-5-codex";
}

function getSettingsLabel() {
  return "Uses the current recommended model family";
}

module.exports = { getSelectedModel, getSettingsLabel, loadModelConfig };
