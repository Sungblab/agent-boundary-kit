const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertJsonText(content) {
  assert(Array.isArray(content), "MCP tool result content must be an array");
  assert(content.length === 1, "MCP tool result must return one content item");
  assert(content[0].type === "text", "MCP tool result must use text content");
  return JSON.parse(content[0].text);
}

assert(packageJson.bin["abk-mcp-server"] === "bin/abk-mcp-server.js", "package bin must expose abk-mcp-server");
assert(fs.existsSync(path.join(root, "bin", "abk-mcp-server.js")), "bin/abk-mcp-server.js must exist");
assert(fs.existsSync(path.join(root, "lib", "abk-mcp-server.js")), "lib/abk-mcp-server.js must exist");

const { handleJsonRpcRequest } = require(path.join(root, "lib", "abk-mcp-server.js"));

async function call(request) {
  return handleJsonRpcRequest(request);
}

async function main() {
  const initialize = await call({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "abk-contract-check", version: "0.0.0" },
    },
  });
  assert(initialize.result.protocolVersion, "initialize must return protocolVersion");
  assert(initialize.result.serverInfo.name === "agent-boundary-kit", "initialize must name server");
  assert(initialize.result.capabilities.tools, "initialize must advertise tools capability");

  const tools = await call({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  const toolNames = tools.result.tools.map((tool) => tool.name).sort();
  assert(
    JSON.stringify(toolNames) === JSON.stringify(["dry_run", "list_scanners", "scan", "validate_runner_input"]),
    `tools/list mismatch: ${toolNames.join(", ")}`
  );

  const listScanners = await call({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: "list_scanners", arguments: {} },
  });
  const listPayload = assertJsonText(listScanners.result.content);
  assert(listPayload.tool === "list_scanners", "list_scanners payload must name tool");
  assert(listPayload.scanners.length === 13, "list_scanners must return 13 scanners");

  const validInput = {
    hookId: "post_edit_scope_check",
    repoRoot: "hooks/claude/examples/runner-scan-fixtures/legacy-clear",
    task: {
      type: "public-surface-replacement",
      summary: "Replace stale public product wording.",
    },
    inputs: {
      changedFiles: ["docs/overview.md"],
      staleTerms: ["old product name"],
    },
  };

  const validate = await call({
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: { name: "validate_runner_input", arguments: { runnerInput: validInput } },
  });
  const validatePayload = assertJsonText(validate.result.content);
  assert(validatePayload.status === "valid", "validate_runner_input must accept valid input");
  assert(validatePayload.willScan === false, "validate_runner_input must not scan");

  const rejected = await call({
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: {
      name: "validate_runner_input",
      arguments: {
        runnerInput: {
          ...validInput,
          privateTranscript: "private note text",
        },
      },
    },
  });
  const rejectedPayload = assertJsonText(rejected.result.content);
  assert(rejectedPayload.status === "rejected", "validate_runner_input must reject private transcript fields");
  assert(!JSON.stringify(rejectedPayload).includes("private note text"), "rejected output must not echo private text");

  const dryRun = await call({
    jsonrpc: "2.0",
    id: 6,
    method: "tools/call",
    params: { name: "dry_run", arguments: { runnerInput: validInput } },
  });
  const dryRunPayload = assertJsonText(dryRun.result.content);
  assert(dryRunPayload.status === "planned", "dry_run must return planned status");
  assert(dryRunPayload.willExecute === false, "dry_run must not execute scanners");

  const scan = await call({
    jsonrpc: "2.0",
    id: 7,
    method: "tools/call",
    params: {
      name: "scan",
      arguments: {
        scannerId: "legacy-surface-retention-scan",
        runnerInput: validInput,
      },
    },
  });
  const scanPayload = assertJsonText(scan.result.content);
  assert(scanPayload.status === "clear", "scan must return clear fixture status");
  assert(scanPayload.exitCode === 0, "scan clear fixture must use exitCode 0");
  assert(scanPayload.finalCopy === undefined, "scan must not emit final copy");

  const overbroad = await call({
    jsonrpc: "2.0",
    id: 8,
    method: "tools/call",
    params: {
      name: "scan",
      arguments: {
        scannerId: "legacy-surface-retention-scan",
        runnerInput: {
          ...validInput,
          inputs: {
            changedFiles: ["../../outside.md"],
            staleTerms: ["old product name"],
          },
        },
      },
    },
  });
  const overbroadPayload = assertJsonText(overbroad.result.content);
  assert(overbroadPayload.status === "rejected", "scan must reject paths that escape repoRoot");
  assert(overbroadPayload.exitCode === 2, "overbroad path rejection must use exitCode 2");

  const unknown = await call({
    jsonrpc: "2.0",
    id: 9,
    method: "tools/call",
    params: { name: "unknown_tool", arguments: {} },
  });
  assert(unknown.error && unknown.error.code === -32601, "unknown tools must return JSON-RPC method error");

  console.log("abk MCP server check passed");
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
