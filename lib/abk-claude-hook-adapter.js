const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { mapNativePayloadWithCarrier } = require("./abk-claude-native-payload-adapter.js");
const { dryRun, mapEvent } = require("./abk-runner-core.js");

const plannedNonGoals = [
  "Do not install hooks",
  "Do not write final responses",
  "Do not preserve stdin payloads",
  "Do not execute scanners in this fixture",
];

const rejectedNonGoals = [
  "Do not install hooks",
  "Do not write final responses",
  "Do not echo private transcript text",
  "Do not execute scanners",
];

function tempTrace(created, deletedBeforeExit) {
  return {
    root: "<explicit-temp-dir>",
    created,
    deletedBeforeExit,
    repositoryWrites: [],
  };
}

function runnerStep(command, output) {
  return {
    command,
    exitCode: output.exitCode || 0,
  };
}

function selectedScannerSummary(output) {
  return output.selectedScanners.map((scanner) => ({
    scanner: scanner.scanner,
    willExecute: scanner.willExecute,
  }));
}

function buildRejectedOutput(mapOutput, created, deletedBeforeExit) {
  return {
    mode: "adapter-entrypoint-fixture",
    inputSource: "stdin",
    hookId: mapOutput.hookId,
    status: "error",
    exitCode: mapOutput.exitCode,
    blocked: true,
    reason: mapOutput.reason,
    runnerChain: [runnerStep("map-event", mapOutput)],
    scanExecuted: false,
    inputsUsed: [],
    findings: [],
    temporaryFiles: tempTrace(created, deletedBeforeExit),
    nonGoals: rejectedNonGoals,
  };
}

function buildPlannedOutput(mapOutput, dryRunOutput, created, deletedBeforeExit) {
  return {
    mode: "adapter-entrypoint-fixture",
    inputSource: "stdin",
    hookId: mapOutput.hookId,
    status: "planned",
    exitCode: dryRunOutput.exitCode,
    runnerChain: [runnerStep("map-event", mapOutput), runnerStep("dry-run", dryRunOutput)],
    scanExecuted: false,
    selectedScanners: selectedScannerSummary(dryRunOutput),
    temporaryFiles: tempTrace(created, deletedBeforeExit),
    nonGoals: plannedNonGoals,
  };
}

function buildNativeRejectedOutput(nativeOutput, created, deletedBeforeExit) {
  return {
    mode: "adapter-entrypoint-fixture",
    inputSource: "stdin",
    inputMode: "native-payload-with-carrier",
    hookId: nativeOutput.hookEvent ? nativeOutput.hookEvent.hookId : "unknown",
    status: "error",
    exitCode: nativeOutput.exitCode,
    blocked: true,
    reason: nativeOutput.reason,
    runnerChain: [runnerStep("native-payload-adapter", nativeOutput)],
    scanExecuted: false,
    inputsUsed: [],
    findings: [],
    temporaryFiles: tempTrace(created, deletedBeforeExit),
    nonGoals: rejectedNonGoals,
  };
}

function buildNativePlannedOutput(nativeOutput, mapOutput, dryRunOutput, created, deletedBeforeExit) {
  return {
    mode: "adapter-entrypoint-fixture",
    inputSource: "stdin",
    inputMode: "native-payload-with-carrier",
    hookId: mapOutput.hookId,
    status: "planned",
    exitCode: dryRunOutput.exitCode,
    runnerChain: [
      runnerStep("native-payload-adapter", nativeOutput),
      runnerStep("map-event", mapOutput),
      runnerStep("dry-run", dryRunOutput),
    ],
    scanExecuted: false,
    selectedScanners: selectedScannerSummary(dryRunOutput),
    temporaryFiles: tempTrace(created, deletedBeforeExit),
    nonGoals: plannedNonGoals,
  };
}

function nativeEnvelopeError(reason) {
  return {
    mode: "native-command-input-contract-fixture",
    status: "error",
    exitCode: 2,
    blocked: true,
    reason,
    inputsUsed: [],
    findings: [],
    nonGoals: [
      "Do not read transcripts",
      "Do not infer missing metadata",
      "Do not install hooks",
      "Do not execute scanners",
    ],
  };
}

function writeTempFile(tempDir, fileName, contents, created) {
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, contents);
  created.push(fileName);
  return filePath;
}

function removeTempDir(tempDir) {
  try {
    fs.rmSync(tempDir, { force: true, recursive: true });
    return !fs.existsSync(tempDir);
  } catch (_error) {
    return false;
  }
}

function parseJsonMaybe(stdinText) {
  try {
    return JSON.parse(stdinText);
  } catch (_error) {
    return null;
  }
}

function isNativeEnvelope(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.inputMode === "native-payload-with-carrier"
  );
}

function nativeEnvelopeOutput(envelope) {
  if (!Object.hasOwn(envelope, "metadataCarrier")) {
    return nativeEnvelopeError("native command envelope missing metadataCarrier");
  }

  return mapNativePayloadWithCarrier(envelope.nativePayload, envelope.metadataCarrier);
}

function runNativeEnvelope(envelope, tempDir, created) {
  const nativeOutput = nativeEnvelopeOutput(envelope);
  const nativeExitCode = nativeOutput.exitCode || 0;

  if (nativeExitCode !== 0) {
    return {
      exitCode: nativeExitCode,
      buildOutput: (cleanupDone) => buildNativeRejectedOutput(nativeOutput, created, cleanupDone),
    };
  }

  const hookEventPath = writeTempFile(
    tempDir,
    "hook-event.json",
    `${JSON.stringify(nativeOutput.hookEvent, null, 2)}\n`,
    created
  );
  const mapOutput = mapEvent(hookEventPath);
  const mapExitCode = mapOutput.exitCode || 0;

  if (mapExitCode !== 0) {
    return {
      exitCode: mapExitCode,
      buildOutput: (cleanupDone) => ({
        ...buildRejectedOutput(mapOutput, created, cleanupDone),
        inputMode: "native-payload-with-carrier",
        runnerChain: [runnerStep("native-payload-adapter", nativeOutput), runnerStep("map-event", mapOutput)],
      }),
    };
  }

  const runnerInputPath = writeTempFile(
    tempDir,
    "runner-input.json",
    `${JSON.stringify(mapOutput, null, 2)}\n`,
    created
  );
  const dryRunOutput = dryRun(runnerInputPath);

  return {
    exitCode: dryRunOutput.exitCode,
    buildOutput: (cleanupDone) => buildNativePlannedOutput(nativeOutput, mapOutput, dryRunOutput, created, cleanupDone),
  };
}

function runHookEvent(stdinText, tempDir, created) {
  const hookEventPath = writeTempFile(tempDir, "hook-event.json", stdinText, created);
  const mapOutput = mapEvent(hookEventPath);
  const mapExitCode = mapOutput.exitCode || 0;

  if (mapExitCode !== 0) {
    return {
      exitCode: mapExitCode,
      buildOutput: (cleanupDone) => buildRejectedOutput(mapOutput, created, cleanupDone),
    };
  }

  const runnerInputPath = writeTempFile(
    tempDir,
    "runner-input.json",
    `${JSON.stringify(mapOutput, null, 2)}\n`,
    created
  );
  const dryRunOutput = dryRun(runnerInputPath);

  return {
    exitCode: dryRunOutput.exitCode,
    buildOutput: (cleanupDone) => buildPlannedOutput(mapOutput, dryRunOutput, created, cleanupDone),
  };
}

function runAdapterFromStdinText(stdinText) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "abk-claude-hook-"));
  const created = [];
  let deletedBeforeExit = false;
  let result;

  try {
    const parsedStdin = parseJsonMaybe(stdinText);
    if (isNativeEnvelope(parsedStdin)) {
      result = runNativeEnvelope(parsedStdin, tempDir, created);
    } else {
      result = runHookEvent(stdinText, tempDir, created);
    }
  } finally {
    deletedBeforeExit = removeTempDir(tempDir);
  }

  return {
    exitCode: result.exitCode,
    output: result.buildOutput(deletedBeforeExit),
  };
}

function main() {
  const stdinText = fs.readFileSync(0, "utf8");
  const result = runAdapterFromStdinText(stdinText);
  process.stdout.write(`${JSON.stringify(result.output, null, 2)}\n`);
  process.exitCode = result.exitCode;
}

module.exports = {
  main,
  runAdapterFromStdinText,
};
