const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function readText(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`${relativePath}: missing`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(markdown, expected, label) {
  assert(markdown.includes(expected), `${label}: missing ${expected}`);
}

const codexManifest = readJson("plugins/codex-agent-boundary-kit/.codex-plugin/plugin.json");
assert(codexManifest.name === "agent-boundary-kit", "Codex plugin name mismatch");
assert(codexManifest.skills === "./skills/", "Codex plugin must package skills");
const codexMcpServers = codexManifest.mcpServers || codexManifest.mcp_servers;
assert(codexMcpServers && codexMcpServers.abk, "Codex plugin must declare ABK MCP server");
assert(codexMcpServers.abk.command === "abk-mcp-server", "Codex plugin must use abk-mcp-server command");
assert(codexManifest.hooks === "./hooks/hooks.json", "Codex plugin must point to reviewed hook config");
assert(codexManifest.interface && codexManifest.interface.displayName === "Agent Boundary Kit", "Codex plugin must include interface metadata");

const marketplace = readJson(".agents/plugins/marketplace.json");
assert(marketplace.name === "agent-boundary-kit-local", "Codex marketplace name mismatch");
const marketplaceEntry = marketplace.plugins.find((plugin) => plugin.name === "agent-boundary-kit");
assert(marketplaceEntry, "Codex marketplace must expose agent-boundary-kit");
assert(
  marketplaceEntry.source && marketplaceEntry.source.path === "./plugins/codex-agent-boundary-kit",
  "Codex marketplace must point to Codex plugin candidate"
);

const codexSkill = readText("plugins/codex-agent-boundary-kit/skills/boundary-check/SKILL.md");
assertIncludes(codexSkill, "Agent Boundary Kit", "Codex plugin skill");
assertIncludes(codexSkill, "abk-mcp-server", "Codex plugin skill");
assertIncludes(codexSkill, "docs/scanner-coverage-matrix.md", "Codex plugin skill");

const codexHooks = readJson("plugins/codex-agent-boundary-kit/hooks/hooks.json");
assert(codexHooks.hooks, "Codex plugin hooks file must contain hooks object");
assert(!JSON.stringify(codexHooks).includes("install"), "Codex plugin hooks must not install hooks");

const claudeManifest = readJson("plugins/claude-code-agent-boundary-kit/plugin.json");
assert(claudeManifest.name === "agent-boundary-kit", "Claude Code plugin name mismatch");
assert(claudeManifest.version, "Claude Code plugin must include version");
assert(claudeManifest.mcpServers && claudeManifest.mcpServers.abk, "Claude Code plugin must declare ABK MCP server");
assert(claudeManifest.mcpServers.abk.command === "abk-mcp-server", "Claude Code plugin must use abk-mcp-server command");
assert(Array.isArray(claudeManifest.hooks), "Claude Code plugin must declare reviewed hook entries");

const claudeSkill = readText("plugins/claude-code-agent-boundary-kit/skills/abk-boundary-check/SKILL.md");
assertIncludes(claudeSkill, "Agent Boundary Kit", "Claude plugin skill");
assertIncludes(claudeSkill, "abk-mcp-server", "Claude plugin skill");
assertIncludes(claudeSkill, "docs/scanner-coverage-matrix.md", "Claude plugin skill");

const claudeCommand = readText("plugins/claude-code-agent-boundary-kit/commands/abk-boundary-review.md");
assertIncludes(claudeCommand, "boundary failure", "Claude slash command");
assertIncludes(claudeCommand, "list_scanners", "Claude slash command");
assertIncludes(claudeCommand, "scan", "Claude slash command");

const readme = readText("README.md");
for (const required of [
  ".agents/plugins/marketplace.json",
  "plugins/codex-agent-boundary-kit",
  "plugins/claude-code-agent-boundary-kit",
  "Codex plugin candidate",
  "Claude Code plugin candidate",
]) {
  assertIncludes(readme, required, "README plugin candidate section");
}

console.log("native plugin candidates check passed");
