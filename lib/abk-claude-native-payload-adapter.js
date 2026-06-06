const nonGoals = [
  "Do not read transcripts",
  "Do not infer task metadata",
  "Do not install hooks",
  "Do not execute scanners",
];

const carrierFields = [
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

const rejectedKeys = [
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

function findRejectedKey(value, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findRejectedKey(value[index], trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (rejectedKeys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findRejectedKey(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function errorOutput(reason) {
  return {
    mode: "native-metadata-carrier-fixture",
    status: "error",
    exitCode: 2,
    blocked: true,
    reason,
    inputsUsed: [],
    findings: [],
    nonGoals,
  };
}

function isTranscriptDerivedCarrier(carrier) {
  return typeof carrier.taskSource === "string" && carrier.taskSource.includes("transcript_path");
}

function validateCarrier(carrier) {
  if (!carrier || typeof carrier !== "object" || Array.isArray(carrier)) {
    return "metadata carrier must be an object";
  }

  if (isTranscriptDerivedCarrier(carrier)) {
    return "metadata carrier must not derive task metadata from transcript_path";
  }

  const rejected = findRejectedKey(carrier);
  if (rejected) {
    return `metadata carrier contains rejected field ${rejected}`;
  }

  for (const field of ["hookId", "repoRoot", "task"]) {
    if (carrier[field] === undefined) {
      return `metadata carrier missing required field ${field}`;
    }
  }

  return null;
}

function nativeFilePath(nativePayload) {
  return nativePayload && nativePayload.tool_input && nativePayload.tool_input.file_path;
}

function mapNativePayloadWithCarrier(nativePayload, carrier) {
  const carrierError = validateCarrier(carrier);
  if (carrierError) {
    return errorOutput(carrierError);
  }

  const filePath = nativeFilePath(nativePayload);
  if (typeof filePath !== "string" || filePath.length === 0) {
    return errorOutput("native payload missing tool_input.file_path");
  }

  const hookEvent = {
    hookId: carrier.hookId,
    repoRoot: carrier.repoRoot,
    task: carrier.task,
    changedFiles: [filePath],
  };

  for (const field of carrierFields) {
    if (carrier[field] !== undefined) {
      hookEvent[field] = carrier[field];
    }
  }

  return {
    mode: "native-metadata-carrier-fixture",
    status: "mapped",
    exitCode: 0,
    hookEvent,
    inputsUsed: ["native.tool_input.file_path", "carrier"],
    nonGoals,
  };
}

module.exports = {
  mapNativePayloadWithCarrier,
};
