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

const contract = readText("docs/mcp-server-contract.md");

for (const required of [
  "Agent Boundary Kit MCP Server Contract",
  "Codex",
  "Claude Code",
  "docs/scanner-coverage-matrix.md",
  "docs/hook-runner-read-only-execution-contract.md",
  "list_scanners",
  "validate_runner_input",
  "dry_run",
  "scan",
  "explicit runner input",
  "read-only",
  "No private transcripts.",
  "No hidden agent state.",
  "No broad user home directories.",
  "No automatic hook installation.",
  "No marketplace submission.",
  "No hosted workflow.",
  "scanner output is evidence, not final copy",
]) {
  assertIncludes(contract, required, "MCP server contract");
}

const fixtures = [
  "mcp/examples/list-scanners.request.json",
  "mcp/examples/list-scanners.response.json",
  "mcp/examples/validate-runner-input.valid.request.json",
  "mcp/examples/validate-runner-input.valid.response.json",
  "mcp/examples/validate-runner-input.rejected-private-context.request.json",
  "mcp/examples/validate-runner-input.rejected-private-context.response.json",
  "mcp/examples/dry-run.valid.request.json",
  "mcp/examples/dry-run.valid.response.json",
  "mcp/examples/scan.valid.request.json",
  "mcp/examples/scan.valid.response.json",
  "mcp/examples/scan.rejected-overbroad-path.request.json",
  "mcp/examples/scan.rejected-overbroad-path.response.json",
];

for (const fixture of fixtures) {
  readJson(fixture);
}

const listResponse = readJson("mcp/examples/list-scanners.response.json");
assert(listResponse.tool === "list_scanners", "list_scanners response must name tool");
assert(Array.isArray(listResponse.scanners), "list_scanners response must include scanners array");
assert(listResponse.scanners.length === 13, "list_scanners response must include 13 promoted scanners");
for (const scanner of listResponse.scanners) {
  assert(scanner.id, "scanner entry must include id");
  assert(scanner.boundary, `${scanner.id}: missing boundary`);
  assert(Array.isArray(scanner.requiredInputFields), `${scanner.id}: missing requiredInputFields`);
  assert(scanner.evidenceDoc && scanner.evidenceDoc.startsWith("docs/"), `${scanner.id}: missing evidenceDoc`);
}

const validValidateRequest = readJson("mcp/examples/validate-runner-input.valid.request.json");
assert(validValidateRequest.tool === "validate_runner_input", "valid validate request tool mismatch");
assert(validValidateRequest.arguments.runnerInput, "valid validate request must wrap runnerInput");
assert(!validValidateRequest.arguments.runnerInput.privateTranscript, "valid validate request must not include private transcript");

const validValidateResponse = readJson("mcp/examples/validate-runner-input.valid.response.json");
assert(validValidateResponse.status === "valid", "valid validate response must be valid");
assert(validValidateResponse.willScan === false, "validate_runner_input must not scan");

const rejectedValidateRequest = readJson("mcp/examples/validate-runner-input.rejected-private-context.request.json");
assert(
  rejectedValidateRequest.arguments.runnerInput.privateTranscript,
  "rejected validate request must exercise private context rejection"
);

const rejectedValidateResponse = readJson("mcp/examples/validate-runner-input.rejected-private-context.response.json");
assert(rejectedValidateResponse.status === "rejected", "rejected validate response must be rejected");
assert(rejectedValidateResponse.exitCode === 2, "rejected validate response must use exitCode 2");
assert(!JSON.stringify(rejectedValidateResponse).includes("private note text"), "rejected output must not echo private context");

const dryRunRequest = readJson("mcp/examples/dry-run.valid.request.json");
assert(dryRunRequest.tool === "dry_run", "dry-run request tool mismatch");
assert(dryRunRequest.arguments.runnerInput, "dry-run request must wrap runnerInput");

const dryRunResponse = readJson("mcp/examples/dry-run.valid.response.json");
assert(dryRunResponse.status === "planned", "dry-run response must be planned");
assert(dryRunResponse.willExecute === false, "dry-run response must not execute scanners");
assert(Array.isArray(dryRunResponse.selectedScanners), "dry-run response must include selectedScanners");

const scanRequest = readJson("mcp/examples/scan.valid.request.json");
assert(scanRequest.tool === "scan", "scan request tool mismatch");
assert(scanRequest.arguments.scannerId, "scan request must include scannerId");
assert(scanRequest.arguments.runnerInput, "scan request must wrap runnerInput");

const scanResponse = readJson("mcp/examples/scan.valid.response.json");
assert(scanResponse.status === "clear", "scan response fixture must be clear");
assert(scanResponse.exitCode === 0, "scan clear response must use exitCode 0");
assert(scanResponse.finalCopy === undefined, "scan response must not emit final copy");

const rejectedScanRequest = readJson("mcp/examples/scan.rejected-overbroad-path.request.json");
assert(rejectedScanRequest.tool === "scan", "rejected scan request tool mismatch");
assert(
  JSON.stringify(rejectedScanRequest.arguments.runnerInput).includes(".."),
  "rejected scan request must exercise overbroad path rejection"
);

const rejectedScanResponse = readJson("mcp/examples/scan.rejected-overbroad-path.response.json");
assert(rejectedScanResponse.status === "rejected", "rejected scan response must be rejected");
assert(rejectedScanResponse.exitCode === 2, "rejected scan response must use exitCode 2");
assert(rejectedScanResponse.blocked === true, "rejected scan response must block");

console.log("MCP server contract check passed");
