const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "claude-hook-native-payload-mapping-fixtures.md");
const nativePayloadPath = path.join(root, "hooks", "claude", "examples", "native-payload.post-tool-use.write.json");
const expectedOutputPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-payload.post-tool-use.write.configuration-error-output.json"
);
const invalidTranscriptPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "native-payload.invalid-transcript-read-output.json"
);
const packagePath = path.join(root, "package.json");

const requiredDocPhrases = [
  "# Claude Hook Native Payload Mapping Fixtures",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-event-input-contract.md",
  "docs/claude-hook-command-adapter-entrypoint.md",
  "https://code.claude.com/docs/en/hooks",
  "PostToolUse input",
  "command hooks receive JSON on stdin",
  "Native Claude Code hook payload compatibility is not proven",
  "Native payload alone is insufficient",
  "current adapter expects ABK hook event fields",
  "`transcript_path` must not be read",
  "`session_id` must not be passed through",
  "`tool_input` may identify a changed file",
  "Task metadata must remain explicit",
  "No raw private transcripts",
  "No hidden chat history",
  "No prompt text",
  "No message arrays",
  "No inferred metadata",
  "Do not install Claude hooks",
  "Do not publish live settings fragments",
  "hooks/claude/examples/native-payload.post-tool-use.write.json",
  "hooks/claude/examples/native-payload.post-tool-use.write.configuration-error-output.json",
  "hooks/claude/examples/native-payload.invalid-transcript-read-output.json",
  "node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js",
  "npm run bench:check",
  "npm run bench:check:red",
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
  "transcript_path",
  "session_id",
];

const forbiddenRepoPaths = [
  ".claude",
  "hooks/claude/install.ps1",
  "hooks/claude/install.sh",
  "hooks/claude/setup.ps1",
  "hooks/claude/setup.sh",
  "hooks/claude/installer.js",
  "hooks/claude/install.js",
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/next-session-prompt.md",
  "docs/packaging-readiness.md",
  "docs/claude-hook-manual-install.md",
  "docs/claude-hook-event-input-contract.md",
  "hooks/claude/README.md",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readRelative(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function existsRelative(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
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

function main() {
  for (const filePath of [docPath, nativePayloadPath, expectedOutputPath, invalidTranscriptPath]) {
    assert.ok(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const doc = fs.readFileSync(docPath, "utf8");
  const nativePayload = readJson(nativePayloadPath);
  const expectedOutput = readJson(expectedOutputPath);
  const invalidTranscriptOutput = readJson(invalidTranscriptPath);
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  for (const phrase of requiredDocPhrases) {
    assert.ok(doc.includes(phrase), `Claude hook native payload mapping fixtures doc missing phrase: ${phrase}`);
  }

  assert.equal(nativePayload.hook_event_name, "PostToolUse", "native payload hook event mismatch");
  assert.equal(nativePayload.tool_name, "Write", "native payload tool name mismatch");
  assert.equal(nativePayload.tool_input.file_path, "src/mindmap/new-surface.ts", "native payload file path mismatch");
  assert.ok(Object.hasOwn(nativePayload, "transcript_path"), "native payload must include transcript_path to prove it is rejected");
  assert.ok(Object.hasOwn(nativePayload, "session_id"), "native payload must include session_id to prove it is not passed through");

  assert.equal(expectedOutput.mode, "native-payload-mapping-fixture", "expected output mode mismatch");
  assert.equal(expectedOutput.source, "claude-code-command-hook", "expected output source mismatch");
  assert.equal(expectedOutput.hookEventName, "PostToolUse", "expected output hook event mismatch");
  assert.equal(expectedOutput.status, "configuration-error", "expected output status mismatch");
  assert.equal(expectedOutput.exitCode, 2, "expected output exitCode mismatch");
  assert.equal(expectedOutput.blocked, true, "expected output must block");
  assert.deepEqual(expectedOutput.partialEvent.changedFiles, ["src/mindmap/new-surface.ts"], "partial changed file mismatch");
  assert.deepEqual(expectedOutput.missingExplicitMetadata, ["hookId", "repoRoot", "task"], "missing metadata mismatch");
  assert.equal(findKey(expectedOutput, rejectedKeys), null, "expected output contains rejected native/private key");

  assert.equal(invalidTranscriptOutput.status, "error", "invalid transcript output status mismatch");
  assert.equal(invalidTranscriptOutput.exitCode, 2, "invalid transcript output exitCode mismatch");
  assert.equal(invalidTranscriptOutput.blocked, true, "invalid transcript output must block");
  assert.equal(invalidTranscriptOutput.reason, "native payload transcript_path is not an allowed runner input");
  assert.deepEqual(invalidTranscriptOutput.inputsUsed, [], "invalid transcript output must not consume transcript input");
  assert.equal(findKey(invalidTranscriptOutput, rejectedKeys), null, "invalid transcript output contains rejected key");

  for (const forbiddenPath of forbiddenRepoPaths) {
    assert.ok(!existsRelative(forbiddenPath), `forbidden Claude hook install path exists: ${forbiddenPath}`);
  }

  for (const relativePath of linkedDocs) {
    const file = readRelative(relativePath);
    assert.ok(
      file.includes("docs/claude-hook-native-payload-mapping-fixtures.md"),
      `${relativePath} must link docs/claude-hook-native-payload-mapping-fixtures.md`
    );
    assert.ok(
      file.includes("benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js"),
      `${relativePath} must link benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js`
    );
  }

  for (const scriptName of ["bench:check", "bench:check:red"]) {
    assert.ok(
      packageJson.scripts[scriptName].includes(
        "node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js"
      ),
      `${scriptName} must include check-claude-hook-native-payload-mapping-fixtures.js`
    );
  }

  console.log("Claude hook native payload mapping fixtures check passed");
}

main();
