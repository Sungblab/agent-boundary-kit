const fs = require("node:fs");

const transcriptDerivedReason = "wrapper carrier source must not derive metadata from transcript_path";

const rejectedCarrierKeys = [
  "rawPrivateTranscript",
  "hiddenChatHistory",
  "chatHistory",
  "conversation",
  "messages",
  "prompt",
  "assistantResponse",
  "tool_response",
  "secret",
  "cookie",
  "token",
  "password",
  "session_id",
  "carrierPath",
  "metadataCarrierPath",
];

function errorOutput(reason, inputsUsed = []) {
  return {
    mode: "wrapper-implementation-fixture",
    status: "error",
    exitCode: 2,
    blocked: true,
    reason,
    inputsUsed,
    findings: [],
  };
}

function parseJson(text, label) {
  try {
    return {
      ok: true,
      value: JSON.parse(text),
    };
  } catch (_error) {
    return {
      ok: false,
      output: errorOutput(`${label} must be valid JSON`),
    };
  }
}

function findKey(value, keys, trail = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const nested = findKey(value[index], keys, trail.concat(String(index)));
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  for (const key of Object.keys(value)) {
    if (keys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findKey(value[key], keys, trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function projectNativePayload(nativePayload) {
  if (!isObject(nativePayload)) {
    return {
      ok: false,
      output: errorOutput("native stdin must be a JSON object", ["native-stdin"]),
    };
  }

  const filePath = nativePayload.tool_input && nativePayload.tool_input.file_path;
  if (typeof filePath !== "string" || filePath.length === 0) {
    return {
      ok: false,
      output: errorOutput("native stdin missing tool_input.file_path", ["native-stdin"]),
    };
  }

  return {
    ok: true,
    value: {
      hook_event_name: nativePayload.hook_event_name,
      tool_name: nativePayload.tool_name,
      tool_input: {
        file_path: filePath,
      },
    },
  };
}

function isTranscriptDerivedCarrier(carrier) {
  if (typeof carrier.taskSource === "string" && carrier.taskSource.includes("transcript_path")) {
    return true;
  }

  return Boolean(findKey(carrier, ["transcript_path"]));
}

function validateCarrier(carrier) {
  if (!isObject(carrier)) {
    return "wrapper carrier source must be a JSON object";
  }

  if (isTranscriptDerivedCarrier(carrier)) {
    return transcriptDerivedReason;
  }

  const rejectedKey = findKey(carrier, rejectedCarrierKeys);
  if (rejectedKey) {
    return `wrapper carrier source contains rejected field ${rejectedKey}`;
  }

  for (const field of ["carrierVersion", "hookId", "repoRoot", "task"]) {
    if (carrier[field] === undefined) {
      return `wrapper carrier source missing required field ${field}`;
    }
  }

  return null;
}

function parseArgs(args) {
  if (args.length !== 2 || args[0] !== "--carrier") {
    return null;
  }

  return args[1];
}

function readCarrier(carrierPath) {
  if (!carrierPath) {
    return {
      ok: false,
      output: errorOutput("wrapper carrier source missing", ["native-stdin"]),
    };
  }

  let carrierText;
  try {
    carrierText = fs.readFileSync(carrierPath, "utf8");
  } catch (_error) {
    return {
      ok: false,
      output: errorOutput("wrapper carrier source missing", ["native-stdin"]),
    };
  }

  const parsedCarrier = parseJson(carrierText, "wrapper carrier source");
  if (!parsedCarrier.ok) {
    return parsedCarrier;
  }

  const carrierError = validateCarrier(parsedCarrier.value);
  if (carrierError) {
    return {
      ok: false,
      output: errorOutput(carrierError),
    };
  }

  return {
    ok: true,
    value: parsedCarrier.value,
  };
}

function runWrapperFromStdinText(stdinText, options = {}) {
  const parsedNative = parseJson(stdinText, "native stdin");
  if (!parsedNative.ok) {
    return {
      exitCode: parsedNative.output.exitCode,
      output: parsedNative.output,
    };
  }

  const projectedNative = projectNativePayload(parsedNative.value);
  if (!projectedNative.ok) {
    return {
      exitCode: projectedNative.output.exitCode,
      output: projectedNative.output,
    };
  }

  const carrier = readCarrier(options.carrierPath);
  if (!carrier.ok) {
    return {
      exitCode: carrier.output.exitCode,
      output: carrier.output,
    };
  }

  return {
    exitCode: 0,
    output: {
      inputMode: "native-payload-with-carrier",
      nativePayload: projectedNative.value,
      metadataCarrier: carrier.value,
    },
  };
}

function main() {
  const carrierPath = parseArgs(process.argv.slice(2));
  const stdinText = fs.readFileSync(0, "utf8");
  const result = runWrapperFromStdinText(stdinText, { carrierPath });
  process.stdout.write(`${JSON.stringify(result.output, null, 2)}\n`);
  process.exitCode = result.exitCode;
}

module.exports = {
  main,
  projectNativePayload,
  runWrapperFromStdinText,
};
