const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runHarness(command) {
  const result = spawnSync(process.execPath, ["bin/abk-runner.js", "harness", command, "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert(result.status === 0, `harness ${command} must exit 0: ${result.stderr || result.stdout}`);
  return JSON.parse(result.stdout);
}

const inspect = runHarness("inspect");
assert(inspect.status === "ok", "harness inspect must report ok");
assert(inspect.product.role.includes("preflight and finish guard"), "harness inspect must describe ABK role");
assert(inspect.product.devflowBoundary.includes("Use Devflow for repo-local work state"), "harness inspect must distinguish Devflow");
assert(inspect.install.preferredCodexMarketplaceCommand === "codex plugin marketplace add Sungblab/agent-boundary-kit", "harness inspect must expose Codex marketplace command");
assert(
  inspect.checks.some((check) => check.path === ".agents/plugins/marketplace.json" && check.ok),
  "harness inspect must validate repo marketplace"
);
assert(
  inspect.checks.some((check) => check.path === "plugins/codex-agent-boundary-kit/.codex-plugin/plugin.json" && check.ok),
  "harness inspect must validate Codex plugin manifest"
);

const plan = runHarness("plan");
assert(Array.isArray(plan.actions), "harness plan must include actions");
assert(
  plan.actions.some((action) => action.id === "codex-marketplace" && action.command.includes("codex plugin marketplace add")),
  "harness plan must include Codex marketplace action"
);
assert(
  plan.actions.some((action) => action.id === "codex-plugin-install" && action.status === "manual-review-required"),
  "harness plan must keep plugin install user-reviewed"
);

const dryInstall = runHarness("install");
assert(dryInstall.installAttempted === false, "harness install without --confirm must be dry-run");
assert(dryInstall.nextCommand === "agent-boundary-kit harness install --confirm", "harness install must print confirm command");

const health = runHarness("health");
assert(health.status === "ok", "harness health must report ok");

console.log("abk harness cli check passed");
