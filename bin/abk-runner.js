#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

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

  return planOutput(input, inputPath);
}

function main() {
  const [command, flag, inputPath] = process.argv.slice(2);
  if (command !== "dry-run" || flag !== "--input" || !inputPath) {
    process.stderr.write("Usage: abk-runner dry-run --input <runner-input.json>\n");
    process.exitCode = 2;
    return;
  }

  const output = dryRun(inputPath);
  writeJson(output, output.exitCode);
}

main();
