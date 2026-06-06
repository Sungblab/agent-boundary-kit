const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

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

function runAdapterFromStdinText(stdinText) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "abk-claude-hook-"));
  const created = [];
  let deletedBeforeExit = false;
  let result;

  try {
    const hookEventPath = writeTempFile(tempDir, "hook-event.json", stdinText, created);
    const mapOutput = mapEvent(hookEventPath);
    const mapExitCode = mapOutput.exitCode || 0;

    if (mapExitCode !== 0) {
      result = {
        exitCode: mapExitCode,
        buildOutput: (cleanupDone) => buildRejectedOutput(mapOutput, created, cleanupDone),
      };
    } else {
      const runnerInputPath = writeTempFile(
        tempDir,
        "runner-input.json",
        `${JSON.stringify(mapOutput, null, 2)}\n`,
        created
      );
      const dryRunOutput = dryRun(runnerInputPath);
      result = {
        exitCode: dryRunOutput.exitCode,
        buildOutput: (cleanupDone) => buildPlannedOutput(mapOutput, dryRunOutput, created, cleanupDone),
      };
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
