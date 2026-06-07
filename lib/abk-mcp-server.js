const path = require("node:path");
const {
  dryRun: runnerDryRun,
  scan: runnerScan,
} = require("./abk-runner-core.js");

const root = path.resolve(__dirname, "..");

const scanners = [
  {
    id: "parser-fallback-boundary-scan",
    boundary: "selected parser path before fallback",
    requiredInputFields: ["repoRoot", "changedFiles", "namedTools"],
    evidenceDoc: "docs/scanner-validation-parser-fallback-boundary.md",
  },
  {
    id: "latex-renderer-boundary-scan",
    boundary: "named LaTeX renderer before alternate PDF path",
    requiredInputFields: ["repoRoot", "changedFiles", "namedTools"],
    evidenceDoc: "docs/scanner-validation-latex-renderer-boundary.md",
  },
  {
    id: "hardcoded-credential-fallback-scan",
    boundary: "env or config repair must not become credential fallback",
    requiredInputFields: ["repoRoot", "changedFiles"],
    evidenceDoc: "docs/scanner-validation-hardcoded-credential-fallback.md",
  },
  {
    id: "guidance-to-code-leakage-scan",
    boundary: "repository guidance must not become hardcoded product behavior",
    requiredInputFields: ["repoRoot", "changedFiles"],
    evidenceDoc: "docs/scanner-validation-guidance-to-code-leakage.md",
  },
  {
    id: "legacy-surface-retention-scan",
    boundary: "replacement work must remove stale public surfaces",
    requiredInputFields: ["repoRoot", "changedFiles", "staleTerms"],
    evidenceDoc: "docs/scanner-validation-legacy-surface-retention.md",
  },
  {
    id: "approved-file-mask-scan",
    boundary: "approved file masks must block unrelated edits",
    requiredInputFields: ["repoRoot", "changedFiles", "approvedScope"],
    evidenceDoc: "docs/scanner-validation-approved-file-mask-scope.md",
  },
  {
    id: "research-mode-no-write-scan",
    boundary: "research-only prompts must not leave workspace artifacts",
    requiredInputFields: ["repoRoot", "task"],
    evidenceDoc: "docs/scanner-validation-research-mode-no-write.md",
  },
  {
    id: "test-runtime-patch-scan",
    boundary: "tests must not patch shipped runtime behavior",
    requiredInputFields: ["testFiles", "productionFiles", "behaviorContract"],
    evidenceDoc: "docs/scanner-validation-test-runtime-patch.md",
  },
  {
    id: "test-fake-contract-scan",
    boundary: "invalid fakes do not override production contracts",
    requiredInputFields: ["testFiles", "productionFiles", "behaviorContract"],
    evidenceDoc: "docs/scanner-validation-test-fake-contract.md",
  },
  {
    id: "completion-evidence-gate-scan",
    boundary: "completion claims require named final gate evidence",
    requiredInputFields: ["completionDraft", "commandLog", "finalGate"],
    evidenceDoc: "docs/scanner-validation-completion-evidence-gate.md",
  },
  {
    id: "untrusted-context-canary-scan",
    boundary: "external issue, PR, log, and web text is evidence, not instruction",
    requiredInputFields: ["externalSources", "changedFiles"],
    evidenceDoc: "docs/scanner-validation-untrusted-context-canary.md",
  },
  {
    id: "noisy-log-root-cause-scan",
    boundary: "noisy logs do not replace data-path diagnosis",
    requiredInputFields: ["repoRoot", "changedFiles", "commandLog"],
    evidenceDoc: "docs/scanner-validation-noisy-log-root-cause.md",
  },
  {
    id: "phase-gate-plan-scan",
    boundary: "oversized briefs need phase gates and a first proof point",
    requiredInputFields: ["task", "metadataFiles"],
    evidenceDoc: "docs/scanner-validation-phase-gate-plan.md",
  },
];

const forbiddenInputKeys = new Set([
  "rawPrivateTranscript",
  "privateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "prompt",
  "assistantResponse",
  "secret",
  "cookie",
  "token",
  "password",
]);

function jsonText(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function jsonRpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function findForbiddenKey(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findForbiddenKey(value[index], trail.concat(String(index)));
      if (nested) return nested;
    }
    return null;
  }
  for (const key of Object.keys(value)) {
    if (forbiddenInputKeys.has(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findForbiddenKey(value[key], trail.concat(key));
    if (nested) return nested;
  }
  return null;
}

function validatesPathScope(runnerInput) {
  const repoRoot = runnerInput && runnerInput.repoRoot;
  const inputs = (runnerInput && runnerInput.inputs) || {};
  const pathLists = [
    "changedFiles",
    "testFiles",
    "productionFiles",
    "metadataFiles",
  ];
  const pathFields = ["completionDraft", "commandLog", "finalGate"];
  if (!repoRoot || typeof repoRoot !== "string") {
    return { ok: false, field: "repoRoot", reason: "repoRoot is required." };
  }
  for (const key of pathLists) {
    const files = inputs[key] || [];
    for (const filePath of files) {
      if (typeof filePath === "string" && (path.isAbsolute(filePath) || filePath.split(/[\\/]+/).includes(".."))) {
        return { ok: false, field: `inputs.${key}`, reason: "Declared scan path escapes repoRoot." };
      }
    }
  }
  for (const key of pathFields) {
    const filePath = inputs[key];
    if (typeof filePath === "string" && (path.isAbsolute(filePath) || filePath.split(/[\\/]+/).includes(".."))) {
      return { ok: false, field: `inputs.${key}`, reason: "Declared scan path escapes repoRoot." };
    }
  }
  return { ok: true };
}

function validateRunnerInput(runnerInput) {
  const forbidden = findForbiddenKey(runnerInput);
  if (forbidden) {
    return {
      tool: "validate_runner_input",
      status: "rejected",
      exitCode: 2,
      willScan: false,
      errors: [
        {
          field: forbidden,
          reason: "Runner input must use declared metadata and paths, not private conversation context.",
        },
      ],
    };
  }
  const pathScope = validatesPathScope(runnerInput);
  if (!pathScope.ok) {
    return {
      tool: "validate_runner_input",
      status: "rejected",
      exitCode: 2,
      willScan: false,
      errors: [{ field: pathScope.field, reason: pathScope.reason }],
    };
  }
  return {
    tool: "validate_runner_input",
    status: "valid",
    exitCode: 0,
    willScan: false,
    errors: [],
  };
}

function fixturePath(name) {
  return path.join(root, ".tmp-abk-mcp", name);
}

function withRunnerInputFile(runnerInput, callback) {
  const fs = require("node:fs");
  const tempDir = path.join(root, ".tmp-abk-mcp");
  fs.mkdirSync(tempDir, { recursive: true });
  const inputPath = fixturePath(`${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
  fs.writeFileSync(inputPath, `${JSON.stringify({ input: runnerInput }, null, 2)}\n`);
  try {
    return callback(path.relative(root, inputPath));
  } finally {
    fs.rmSync(inputPath, { force: true });
    try {
      fs.rmdirSync(tempDir);
    } catch (_) {
      // Another parallel call may still be using the temp directory.
    }
  }
}

function dryRunTool(runnerInput) {
  const validation = validateRunnerInput(runnerInput);
  if (validation.status !== "valid") {
    return {
      tool: "dry_run",
      status: "configuration-error",
      exitCode: 2,
      willExecute: false,
      selectedScanners: [],
      missingInputs: validation.errors.map((error) => error.field),
      errors: validation.errors,
    };
  }
  const result = withRunnerInputFile(runnerInput, (inputPath) => runnerDryRun(inputPath));
  return {
    tool: "dry_run",
    status: result.status,
    exitCode: result.exitCode,
    willExecute: false,
    selectedScanners: result.selectedScanners.map((scanner) => ({
      scanner: scanner.scanner,
      requiredInputFields: scanner.inputsRequired,
    })),
    missingInputs: result.configurationErrors.flatMap((error) => error.missingInputs || []),
    errors: result.configurationErrors,
  };
}

function scanTool(runnerInput, scannerId) {
  const validation = validateRunnerInput(runnerInput);
  if (validation.status !== "valid") {
    return {
      tool: "scan",
      scanner: scannerId,
      status: "rejected",
      exitCode: 2,
      blocked: true,
      findings: [],
      errors: validation.errors,
    };
  }
  const result = withRunnerInputFile(runnerInput, (inputPath) => runnerScan(inputPath, scannerId));
  return {
    tool: "scan",
    scanner: result.scanner,
    status: result.status === "error" ? "rejected" : result.status,
    exitCode: result.exitCode,
    blocked: result.blocked,
    findings: result.findings || [],
    errors: result.status === "error" ? [{ reason: result.reason }] : [],
  };
}

const toolDefinitions = [
  {
    name: "list_scanners",
    description: "List promoted Agent Boundary Kit scanners and evidence docs.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "validate_runner_input",
    description: "Validate explicit ABK runner input without scanning.",
    inputSchema: {
      type: "object",
      properties: { runnerInput: { type: "object" } },
      required: ["runnerInput"],
      additionalProperties: false,
    },
  },
  {
    name: "dry_run",
    description: "Plan scanner selection from explicit runner input without executing scanners.",
    inputSchema: {
      type: "object",
      properties: { runnerInput: { type: "object" } },
      required: ["runnerInput"],
      additionalProperties: false,
    },
  },
  {
    name: "scan",
    description: "Run one selected read-only ABK scanner against declared paths only.",
    inputSchema: {
      type: "object",
      properties: {
        runnerInput: { type: "object" },
        scannerId: { type: "string" },
      },
      required: ["runnerInput", "scannerId"],
      additionalProperties: false,
    },
  },
];

function callTool(name, args = {}) {
  if (name === "list_scanners") {
    return jsonText({ tool: "list_scanners", status: "ok", scanners });
  }
  if (name === "validate_runner_input") {
    return jsonText(validateRunnerInput(args.runnerInput));
  }
  if (name === "dry_run") {
    return jsonText(dryRunTool(args.runnerInput));
  }
  if (name === "scan") {
    return jsonText(scanTool(args.runnerInput, args.scannerId));
  }
  return null;
}

async function handleJsonRpcRequest(request) {
  if (!request || request.jsonrpc !== "2.0" || typeof request.method !== "string") {
    return jsonRpcError(request && request.id !== undefined ? request.id : null, -32600, "Invalid Request");
  }
  if (request.method === "initialize") {
    return jsonRpcResult(request.id, {
      protocolVersion: (request.params && request.params.protocolVersion) || "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "agent-boundary-kit", version: "0.0.0" },
    });
  }
  if (request.method === "tools/list") {
    return jsonRpcResult(request.id, { tools: toolDefinitions });
  }
  if (request.method === "tools/call") {
    const params = request.params || {};
    const result = callTool(params.name, params.arguments || {});
    if (!result) {
      return jsonRpcError(request.id, -32601, `Unknown tool: ${params.name}`);
    }
    return jsonRpcResult(request.id, result);
  }
  if (request.method === "notifications/initialized") {
    return undefined;
  }
  return jsonRpcError(request.id, -32601, `Method not found: ${request.method}`);
}

function main() {
  let buffer = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    buffer += chunk;
    let newlineIndex = buffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (line) {
        Promise.resolve()
          .then(() => handleJsonRpcRequest(JSON.parse(line)))
          .then((response) => {
            if (response) {
              process.stdout.write(`${JSON.stringify(response)}\n`);
            }
          })
          .catch((error) => {
            process.stdout.write(`${JSON.stringify(jsonRpcError(null, -32603, error.message))}\n`);
          });
      }
      newlineIndex = buffer.indexOf("\n");
    }
  });
}

module.exports = {
  handleJsonRpcRequest,
  main,
};
