const AGENT_RECOMMENDED_MODEL = "claude-sonnet";

function getSelectedModel() {
  return AGENT_RECOMMENDED_MODEL;
}

function getSettingsLabel() {
  return "Uses the current recommended model family";
}

module.exports = { getSelectedModel, getSettingsLabel };
