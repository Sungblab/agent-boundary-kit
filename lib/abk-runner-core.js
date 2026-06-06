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

const topLevelEventFields = ["hookId", "repoRoot", "task"];
const eventInputFields = [
  "changedFiles",
  "diffPath",
  "approvedScope",
  "offLimits",
  "namedTools",
  "staleTerms",
  "externalSources",
  "finalGate",
  "commandLog",
  "completionDraft",
  "metadataFiles",
  "testFiles",
  "productionFiles",
  "behaviorContract",
];
const allowedEventFields = topLevelEventFields.concat(eventInputFields);
const rejectedEventFields = [
  "rawPrivateTranscript",
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
];

const runnerCommandContract = "runner-command-contract";
const executableScanners = new Set([
  "parser-fallback-boundary-scan",
  "latex-renderer-boundary-scan",
  "hardcoded-credential-fallback-scan",
  "guidance-to-code-leakage-scan",
  "legacy-surface-retention-scan",
  "test-runtime-patch-scan",
  "test-fake-contract-scan",
  "completion-evidence-gate-scan",
  "untrusted-context-canary-scan",
  "noisy-log-root-cause-scan",
  "phase-gate-plan-scan",
]);

const scannerCatalog = {
  "parser-fallback-boundary-scan": {
    script: "benchmarks/scripts/scan-parser-fallback-boundary.js",
    inputsRequired: ["repoRoot", "changedFiles", "namedTools"],
    output: {
      clearReason: "no parser fallback boundary finding for declared inputs",
      findingReason: "parser fallback boundary violation found",
      findingRule: "parser-fallback-boundary",
    },
  },
  "latex-renderer-boundary-scan": {
    script: "benchmarks/scripts/scan-latex-renderer-boundary.js",
    inputsRequired: ["repoRoot", "changedFiles", "namedTools"],
    output: {
      clearReason: "no LaTeX renderer boundary finding for declared inputs",
      findingReason: "non-LaTeX renderer boundary violation found",
      findingRule: "latex-renderer-boundary",
    },
  },
  "hardcoded-credential-fallback-scan": {
    script: "benchmarks/scripts/scan-hardcoded-credential-fallback.js",
    inputsRequired: ["repoRoot", "changedFiles"],
    output: {
      clearReason: "no hardcoded credential fallback finding for declared inputs",
      findingReason: "hardcoded credential fallback found",
      findingRule: "hardcoded-credential-fallback",
    },
  },
  "guidance-to-code-leakage-scan": {
    script: "benchmarks/scripts/scan-guidance-to-code-leakage.js",
    inputsRequired: ["repoRoot", "changedFiles"],
    output: {
      clearReason: "no guidance-to-code leakage finding for declared inputs",
      findingReason: "repository guidance leaked into product behavior",
      findingRule: "guidance-to-code-leakage",
    },
  },
  "legacy-surface-retention-scan": {
    script: "benchmarks/scripts/scan-legacy-surface-retention.js",
    inputsRequired: ["repoRoot", "changedFiles", "staleTerms"],
    output: {
      clearReason: "no stale public surface finding for declared inputs",
      findingReason: "stale public surface term found",
      findingRule: "stale-public-surface",
    },
  },
  "untrusted-context-canary-scan": {
    script: "benchmarks/scripts/scan-untrusted-context-canary.js",
    inputsRequired: ["externalSources", "changedFiles"],
    output: {
      clearReason: "external evidence is referenced without routing untrusted instructions into trusted output",
      findingReason: "untrusted external context leaked into trusted output",
      findingRule: "untrusted-context-canary",
    },
  },
  "noisy-log-root-cause-scan": {
    script: "benchmarks/scripts/scan-noisy-log-root-cause.js",
    inputsRequired: ["repoRoot", "changedFiles", "commandLog"],
    output: {
      clearReason: "no noisy log root-cause finding for declared inputs",
      findingReason: "wrong-cause data-path behavior found",
      findingRule: "noisy-log-root-cause",
    },
  },
  "test-runtime-patch-scan": {
    script: "benchmarks/scripts/scan-test-runtime-patch.js",
    inputsRequired: ["testFiles", "productionFiles", "behaviorContract"],
    output: {
      clearReason: "no test runtime patch finding for declared inputs",
      findingReason: "test runtime patching found",
      findingRule: "test-runtime-patch",
    },
  },
  "test-fake-contract-scan": {
    script: "benchmarks/scripts/scan-test-fake-contract.js",
    inputsRequired: ["testFiles", "productionFiles", "behaviorContract"],
    output: {
      clearReason: "no test fake contract finding for declared inputs",
      findingReason: "test fake contract mismatch found",
      findingRule: "test-fake-contract",
    },
  },
  "completion-evidence-gate-scan": {
    script: "benchmarks/scripts/scan-completion-evidence-gate.js",
    inputsRequired: ["completionDraft", "commandLog", "finalGate"],
    output: {
      clearReason: "no completion evidence finding for declared inputs",
      findingReason: "completion artifact exists before final gate evidence",
      findingRule: "completion-before-final-gate",
    },
  },
  "phase-gate-plan-scan": {
    script: "benchmarks/scripts/scan-phase-gate-plan.js",
    inputsRequired: ["task", "metadataFiles"],
    output: {
      clearReason: "no phase gate planning finding for declared inputs",
      findingReason: "oversized planning without phase-gate evidence found",
      findingRule: "phase-gate-plan",
    },
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

function findRejectedEventField(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findRejectedEventField(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (rejectedEventFields.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findRejectedEventField(value[key], trail.concat(key));
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

function eventConfigurationErrorOutput(hookId, reason) {
  return {
    hookId,
    status: "error",
    exitCode: 2,
    blocked: true,
    reason,
    inputsUsed: [],
    findings: [],
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

function scannerInputsRequired(input, scanner) {
  if (scanner === "untrusted-context-canary-scan" && input.hookId === "completion_evidence_check") {
    return ["externalSources", "completionDraft"];
  }

  if (scanner === "noisy-log-root-cause-scan" && input.hookId === "test_integrity_check") {
    return ["testFiles", "productionFiles", "commandLog"];
  }

  return scannerCatalog[scanner].inputsRequired;
}

function scannerPlan(input, scanner) {
  const entry = scannerCatalog[scanner];
  return {
    scanner,
    script: entry.script,
    inputsRequired: scannerInputsRequired(input, scanner),
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

function taskSummaryMatches(task, pattern) {
  return Boolean(task && typeof task.summary === "string" && pattern.test(task.summary));
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
    if (
      changedPathMatches(changedFiles, /model|settings|ai/i) &&
      taskSummaryMatches(input.task, /model|AI|settings|default|selection|product behavior/i)
    ) {
      selected.push("guidance-to-code-leakage-scan");
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
    selectedScanners: selectScanners(input).map((scanner) => scannerPlan(input, scanner)),
    configurationErrors: [],
    nonGoals,
  };
}

function readRunnerInput(inputPath) {
  const parsed = JSON.parse(fs.readFileSync(path.resolve(root, inputPath), "utf8"));
  return parsed.input || parsed;
}

function readHookEvent(inputPath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, inputPath), "utf8"));
}

function hookEventId(event) {
  return event && typeof event.hookId === "string" ? event.hookId : "unknown";
}

function mapHookEventToRunnerInput(event) {
  const inputs = {};
  for (const key of eventInputFields) {
    if (event[key] !== undefined) {
      inputs[key] = event[key];
    }
  }

  return {
    hookId: event.hookId,
    repoRoot: event.repoRoot,
    task: event.task,
    inputs,
  };
}

function validateHookEvent(event) {
  const rejected = findRejectedEventField(event);
  if (rejected) {
    return { ok: false, reason: `rejected event field ${rejected}` };
  }

  if (!event || typeof event !== "object" || Array.isArray(event)) {
    return { ok: false, reason: "event must be an object" };
  }

  for (const key of Object.keys(event)) {
    if (!allowedEventFields.includes(key)) {
      return { ok: false, reason: `unknown event field ${key}` };
    }
  }

  for (const key of topLevelEventFields) {
    if (event[key] === undefined) {
      return { ok: false, reason: `missing required event field ${key}` };
    }
  }

  return { ok: true, reason: "valid" };
}

function mapEvent(inputPath) {
  let event;
  try {
    event = readHookEvent(inputPath);
  } catch (error) {
    return eventConfigurationErrorOutput("unknown", "hook event JSON could not be parsed");
  }

  const validation = validateHookEvent(event);
  if (!validation.ok) {
    return eventConfigurationErrorOutput(hookEventId(event), validation.reason);
  }

  return mapHookEventToRunnerInput(event);
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
  return scannerInputsRequired(input, scanner).filter((key) => {
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

function resolveInputFileArgs(input, key) {
  const repoRoot = path.resolve(root, input.repoRoot || ".");
  const files = input.inputs[key] || [];

  return files.map((filePath) => {
    const resolved = path.resolve(repoRoot, filePath);
    if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
      throw new Error(`${key} entry is outside repoRoot: ${filePath}`);
    }
    return resolved;
  });
}

function resolveInputPathArg(input, key) {
  const repoRoot = path.resolve(root, input.repoRoot || ".");
  const filePath = input.inputs[key];
  const resolved = path.resolve(repoRoot, filePath);
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`${key} entry is outside repoRoot: ${filePath}`);
  }
  return resolved;
}

function resolveRepoRootArg(input) {
  return path.resolve(root, input.repoRoot);
}

function scannerArgs(input, scanner) {
  if (
    scanner === "parser-fallback-boundary-scan" ||
    scanner === "latex-renderer-boundary-scan" ||
    scanner === "hardcoded-credential-fallback-scan" ||
    scanner === "guidance-to-code-leakage-scan" ||
    scanner === "legacy-surface-retention-scan"
  ) {
    return resolveChangedFileArgs(input);
  }

  if (scanner === "test-runtime-patch-scan") {
    return resolveInputFileArgs(input, "testFiles");
  }

  if (scanner === "test-fake-contract-scan") {
    return [...resolveInputFileArgs(input, "testFiles"), ...resolveInputFileArgs(input, "productionFiles")];
  }

  if (scanner === "completion-evidence-gate-scan") {
    return [resolveRepoRootArg(input)];
  }

  if (scanner === "untrusted-context-canary-scan") {
    if (input.hookId === "completion_evidence_check") {
      return [resolveInputPathArg(input, "completionDraft")];
    }
    return resolveChangedFileArgs(input);
  }

  if (scanner === "noisy-log-root-cause-scan") {
    if (input.hookId === "test_integrity_check") {
      return [...resolveInputFileArgs(input, "testFiles"), ...resolveInputFileArgs(input, "productionFiles")];
    }
    return resolveChangedFileArgs(input);
  }

  if (scanner === "phase-gate-plan-scan") {
    return resolveInputFileArgs(input, "metadataFiles");
  }

  throw new Error(`unsupported scanner id: ${scanner}`);
}

function parseScannerFindingLine(line, scanner) {
  const lineMatch = /^(.+):(\d+): (.+)$/.exec(line);
  if (lineMatch) {
    return {
      path: toDisplayPath(lineMatch[1]),
      line: Number(lineMatch[2]),
      rule: scannerCatalog[scanner].output.findingRule,
      detail: lineMatch[3],
    };
  }

  const fileMatch = /^(.+?): ([^:]+): (.+)$/.exec(line);
  if (fileMatch) {
    return {
      path: toDisplayPath(fileMatch[1]),
      line: 1,
      rule: scannerCatalog[scanner].output.findingRule,
      detail: `${fileMatch[2]}: ${fileMatch[3]}`,
    };
  }

  return null;
}

function parseScannerFindings(stdout, scanner) {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => parseScannerFindingLine(line, scanner))
    .filter(Boolean);
}

function scanOutput(input, scanner, result) {
  const inputsUsed = scannerInputsRequired(input, scanner);
  const output = scannerCatalog[scanner].output;
  const exitCode = result.status === null ? 2 : result.status;

  if (exitCode === 0) {
    return {
      hookId: input.hookId,
      scanner,
      status: "clear",
      exitCode: 0,
      blocked: false,
      reason: output.clearReason,
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
      reason: output.findingReason,
      inputsUsed,
      findings: parseScannerFindings(result.stdout, scanner),
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

  if (!executableScanners.has(scanner)) {
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
      scannerInputsRequired(input, scanner)
    );
  }

  let args;
  try {
    args = scannerArgs(input, scanner);
  } catch (error) {
    return executionErrorOutput(hookId, scanner, error.message, scannerInputsRequired(input, scanner));
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

  if (command === "map-event" && flag === "--input" && inputPath && scannerFlag === undefined) {
    const output = mapEvent(inputPath);
    writeJson(output, output.exitCode || 0);
    return;
  }

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

  if (command !== "map-event" && command !== "dry-run" && command !== "scan") {
    process.stderr.write(
      "Usage: abk-runner map-event --input <hook-event.json>\nUsage: abk-runner dry-run --input <runner-input.json>\nUsage: abk-runner scan --input <runner-input.json> --scanner <scanner-id>\n"
    );
    process.exitCode = 2;
    return;
  }

  if (command === "map-event") {
    process.stderr.write("Usage: abk-runner map-event --input <hook-event.json>\n");
    process.exitCode = 2;
    return;
  }

  process.stderr.write(`Usage: abk-runner ${command} --input <runner-input.json>\n`);
  process.exitCode = 2;
}

module.exports = {
  dryRun,
  main,
  mapEvent,
  scan,
  selectScanners,
};
