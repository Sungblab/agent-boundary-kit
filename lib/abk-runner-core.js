const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

const nonGoals = [
  "Do not execute scanners",
  "Do not install hooks",
  "Do not write files",
  "Do not write final responses",
];

const forbiddenKeys = [
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "secret",
  "cookie",
  "token",
  "password",
];

const hookIds = [
  "pre_write_boundary_check",
  "post_edit_scope_check",
  "test_integrity_check",
  "completion_evidence_check",
];

const runnerCommandContract = "runner-command-contract";

const scannerCatalog = {
  "parser-fallback-boundary-scan": {
    script: "benchmarks/scripts/scan-parser-fallback-boundary.js",
    inputsRequired: ["repoRoot", "changedFiles", "namedTools"],
  },
  "latex-renderer-boundary-scan": {
    script: "benchmarks/scripts/scan-latex-renderer-boundary.js",
    inputsRequired: ["repoRoot", "changedFiles", "namedTools"],
  },
  "hardcoded-credential-fallback-scan": {
    script: "benchmarks/scripts/scan-hardcoded-credential-fallback.js",
    inputsRequired: ["repoRoot", "changedFiles"],
  },
  "legacy-surface-retention-scan": {
    script: "benchmarks/scripts/scan-legacy-surface-retention.js",
    inputsRequired: ["repoRoot", "changedFiles", "staleTerms"],
  },
  "untrusted-context-canary-scan": {
    script: "benchmarks/scripts/scan-untrusted-context-canary.js",
    inputsRequired: ["externalSources", "changedFiles"],
  },
  "noisy-log-root-cause-scan": {
    script: "benchmarks/scripts/scan-noisy-log-root-cause.js",
    inputsRequired: ["repoRoot", "changedFiles", "commandLog"],
  },
  "test-runtime-patch-scan": {
    script: "benchmarks/scripts/scan-test-runtime-patch.js",
    inputsRequired: ["testFiles", "productionFiles", "behaviorContract"],
  },
  "test-fake-contract-scan": {
    script: "benchmarks/scripts/scan-test-fake-contract.js",
    inputsRequired: ["testFiles", "productionFiles", "behaviorContract"],
  },
  "completion-evidence-gate-scan": {
    script: "benchmarks/scripts/scan-completion-evidence-gate.js",
    inputsRequired: ["completionDraft", "commandLog", "finalGate"],
  },
  "phase-gate-plan-scan": {
    script: "benchmarks/scripts/scan-phase-gate-plan.js",
    inputsRequired: ["task", "metadataFiles"],
  },
};

function toDisplayPath(inputPath) {
  return inputPath.replaceAll("\\", "/");
}

function writeJson(value, exitCode) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
  process.exitCode = exitCode;
}

function findForbiddenKey(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findForbiddenKey(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (forbiddenKeys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findForbiddenKey(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function configurationOutput(hookId, inputPath, scanner, missingInputs, reason) {
  return {
    mode: "dry-run-plan",
    hookId,
    inputPath: toDisplayPath(inputPath),
    status: "configuration-error",
    exitCode: 2,
    selectedScanners: [],
    configurationErrors: [
      {
        scanner,
        missingInputs,
        reason,
      },
    ],
    nonGoals,
  };
}

function executionErrorOutput(hookId, scanner, reason, inputsUsed = []) {
  return {
    hookId,
    scanner,
    status: "error",
    exitCode: 2,
    blocked: true,
    reason,
    inputsUsed,
    findings: [],
  };
}

function scannerPlan(scanner) {
  const entry = scannerCatalog[scanner];
  return {
    scanner,
    script: entry.script,
    inputsRequired: entry.inputsRequired,
    willExecute: false,
  };
}

function hasAnyText(value) {
  return Array.isArray(value) && value.length > 0;
}

function includesTool(namedTools, pattern) {
  return hasAnyText(namedTools) && namedTools.some((tool) => tool.toLowerCase().includes(pattern));
}

function changedPathMatches(changedFiles, pattern) {
  return hasAnyText(changedFiles) && changedFiles.some((filePath) => pattern.test(filePath));
}

function selectScanners(input) {
  const inputs = input.inputs || {};
  const changedFiles = inputs.changedFiles || [];
  const selected = [];

  if (input.hookId === "pre_write_boundary_check") {
    if (input.task && input.task.type === "planning-only" && hasAnyText(inputs.metadataFiles)) {
      selected.push("phase-gate-plan-scan");
    }
  }

  if (input.hookId === "post_edit_scope_check") {
    if (
      includesTool(inputs.namedTools, "opendataloader") &&
      changedPathMatches(changedFiles, /ingest|parser|pdf/i)
    ) {
      selected.push("parser-fallback-boundary-scan");
    }
    if (includesTool(inputs.namedTools, "latex") && changedPathMatches(changedFiles, /export|pdf|render/i)) {
      selected.push("latex-renderer-boundary-scan");
    }
    if (changedPathMatches(changedFiles, /config|env/i)) {
      selected.push("hardcoded-credential-fallback-scan");
    }
    if (hasAnyText(inputs.staleTerms)) {
      selected.push("legacy-surface-retention-scan");
    }
    if (hasAnyText(inputs.externalSources)) {
      selected.push("untrusted-context-canary-scan");
    }
    if (inputs.commandLog && changedPathMatches(changedFiles, /data|api|render|view/i)) {
      selected.push("noisy-log-root-cause-scan");
    }
  }

  if (input.hookId === "test_integrity_check") {
    if (hasAnyText(inputs.testFiles) && hasAnyText(inputs.productionFiles) && inputs.behaviorContract) {
      selected.push("test-runtime-patch-scan");
      selected.push("test-fake-contract-scan");
    }
    if (inputs.commandLog) {
      selected.push("noisy-log-root-cause-scan");
    }
  }

  if (input.hookId === "completion_evidence_check") {
    if (inputs.completionDraft && inputs.commandLog && inputs.finalGate) {
      selected.push("completion-evidence-gate-scan");
    }
    if (inputs.completionDraft && hasAnyText(inputs.externalSources)) {
      selected.push("untrusted-context-canary-scan");
    }
    if (input.task && hasAnyText(inputs.metadataFiles)) {
      selected.push("phase-gate-plan-scan");
    }
  }

  return selected;
}

function planOutput(input, inputPath) {
  return {
    mode: "dry-run-plan",
    hookId: input.hookId,
    inputPath: toDisplayPath(inputPath),
    status: "planned",
    exitCode: 0,
    selectedScanners: selectScanners(input).map(scannerPlan),
    configurationErrors: [],
    nonGoals,
  };
}

function readRunnerInput(inputPath) {
  const parsed = JSON.parse(fs.readFileSync(path.resolve(root, inputPath), "utf8"));
  return parsed.input || parsed;
}

function dryRun(inputPath) {
  const input = readRunnerInput(inputPath);
  const hookId = typeof input.hookId === "string" ? input.hookId : "unknown";

  const forbiddenKey = findForbiddenKey(input);
  if (forbiddenKey) {
    return configurationOutput(
      hookId,
      inputPath,
      "runner-input-contract",
      [forbiddenKey],
      "Runner input includes forbidden private or credential-like metadata."
    );
  }

  if (!input.task) {
    return configurationOutput(
      hookId,
      inputPath,
      "runner-input-contract",
      ["task"],
      "Runner input task metadata is missing."
    );
  }

  if (!hookIds.includes(hookId)) {
    return configurationOutput(
      hookId,
      inputPath,
      "runner-input-contract",
      ["hookId"],
      "Runner input hookId is unsupported."
    );
  }

  return planOutput(input, inputPath);
}

function declaredInput(input, key) {
  if (key === "repoRoot" || key === "task") {
    return input[key];
  }

  return input.inputs ? input.inputs[key] : undefined;
}

function missingRequiredInputs(input, scanner) {
  return scannerCatalog[scanner].inputsRequired.filter((key) => {
    const value = declaredInput(input, key);
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === undefined || value === null || value === "";
  });
}

function resolveChangedFileArgs(input) {
  const repoRoot = path.resolve(root, input.repoRoot);
  const changedFiles = input.inputs.changedFiles || [];

  return changedFiles.map((filePath) => {
    const resolved = path.resolve(repoRoot, filePath);
    if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
      throw new Error(`changed file is outside repoRoot: ${filePath}`);
    }
    return resolved;
  });
}

function scannerArgs(input, scanner) {
  if (scanner === "legacy-surface-retention-scan") {
    return resolveChangedFileArgs(input);
  }

  throw new Error(`unsupported scanner id: ${scanner}`);
}

function parseScannerFindingLine(line) {
  const match = /^(.+):(\d+): (.+)$/.exec(line);
  if (!match) {
    return null;
  }

  return {
    path: toDisplayPath(match[1]),
    line: Number(match[2]),
    rule: "stale-public-surface",
    detail: match[3],
  };
}

function parseScannerFindings(stdout) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(parseScannerFindingLine)
    .filter(Boolean);
}

function scanOutput(input, scanner, result) {
  const inputsUsed = scannerCatalog[scanner].inputsRequired;
  const exitCode = result.status === null ? 2 : result.status;

  if (exitCode === 0) {
    return {
      hookId: input.hookId,
      scanner,
      status: "clear",
      exitCode: 0,
      blocked: false,
      reason: "no stale public surface finding for declared inputs",
      inputsUsed,
      findings: [],
    };
  }

  if (exitCode === 1) {
    return {
      hookId: input.hookId,
      scanner,
      status: "finding",
      exitCode: 1,
      blocked: true,
      reason: "stale public surface term found",
      inputsUsed,
      findings: parseScannerFindings(result.stdout),
    };
  }

  const reason = (result.stderr || result.stdout || "scanner invocation error").trim();
  return executionErrorOutput(input.hookId, scanner, reason, inputsUsed);
}

function scan(inputPath, scanner) {
  const input = readRunnerInput(inputPath);
  const hookId = typeof input.hookId === "string" ? input.hookId : "unknown";
  const outputScanner = scannerCatalog[scanner] ? scanner : runnerCommandContract;

  const forbiddenKey = findForbiddenKey(input);
  if (forbiddenKey) {
    return executionErrorOutput(
      hookId,
      outputScanner,
      "Runner input includes forbidden private or credential-like metadata."
    );
  }

  if (!input.task) {
    return executionErrorOutput(hookId, outputScanner, "Runner input task metadata is missing.");
  }

  if (!hookIds.includes(hookId)) {
    return executionErrorOutput(hookId, outputScanner, "Runner input hookId is unsupported.");
  }

  if (scanner !== "legacy-surface-retention-scan") {
    return executionErrorOutput(hookId, outputScanner, "Runner scanner id is unsupported.");
  }

  if (!selectScanners(input).includes(scanner)) {
    return executionErrorOutput(hookId, scanner, "Runner scanner id is not selected by declared input.");
  }

  const missingInputs = missingRequiredInputs(input, scanner);
  if (missingInputs.length > 0) {
    return executionErrorOutput(
      hookId,
      scanner,
      `Runner input is missing required declared inputs: ${missingInputs.join(", ")}.`,
      scannerCatalog[scanner].inputsRequired
    );
  }

  let args;
  try {
    args = scannerArgs(input, scanner);
  } catch (error) {
    return executionErrorOutput(hookId, scanner, error.message, scannerCatalog[scanner].inputsRequired);
  }

  const script = path.join(root, scannerCatalog[scanner].script);
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
  });

  return scanOutput(input, scanner, result);
}

function main(args = process.argv.slice(2)) {
  const [command, flag, inputPath, scannerFlag, scanner] = args;

  if (command === "dry-run" && flag === "--input" && inputPath && scannerFlag === undefined) {
    const output = dryRun(inputPath);
    writeJson(output, output.exitCode);
    return;
  }

  if (command === "scan" && flag === "--input" && inputPath && scannerFlag === "--scanner" && scanner) {
    const output = scan(inputPath, scanner);
    writeJson(output, output.exitCode);
    return;
  }

  if (command !== "dry-run" && command !== "scan") {
    process.stderr.write(
      "Usage: abk-runner dry-run --input <runner-input.json>\nUsage: abk-runner scan --input <runner-input.json> --scanner <scanner-id>\n"
    );
    process.exitCode = 2;
    return;
  }

  process.stderr.write(`Usage: abk-runner ${command} --input <runner-input.json>\n`);
  process.exitCode = 2;
}

module.exports = {
  dryRun,
  main,
  scan,
  selectScanners,
};
