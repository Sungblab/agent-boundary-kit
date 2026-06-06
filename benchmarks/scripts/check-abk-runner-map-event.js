const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const runnerPath = path.join(root, "bin", "abk-runner.js");

const cases = [
  {
    name: "valid hook event",
    input: "hooks/claude/examples/hook-event.post-edit.valid.json",
    expected: "hooks/claude/examples/map-event.valid-output.json",
    exitCode: 0,
  },
  {
    name: "rejected transcript hook event",
    input: "hooks/claude/examples/hook-event.invalid-transcript.json",
    expected: "hooks/claude/examples/map-event.invalid-transcript-output.json",
    exitCode: 2,
  },
  {
    name: "missing required task hook event",
    input: "hooks/claude/examples/hook-event.invalid-missing-task.json",
    expected: "hooks/claude/examples/map-event.invalid-missing-task-output.json",
    exitCode: 2,
  },
  {
    name: "unknown field hook event",
    input: "hooks/claude/examples/hook-event.invalid-unknown-field.json",
    expected: "hooks/claude/examples/map-event.invalid-unknown-field-output.json",
    exitCode: 2,
  },
  {
    name: "invalid JSON hook event",
    input: "hooks/claude/examples/hook-event.invalid-json.json",
    expected: "hooks/claude/examples/map-event.invalid-json-output.json",
    exitCode: 2,
  },
];

const forbiddenOutputKeys = [
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
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
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
    if (forbiddenOutputKeys.includes(key)) {
      return trail.concat(key).join(".");
    }
    const nested = findForbiddenKey(value[key], trail.concat(key));
    if (nested) {
      return nested;
    }
  }

  return null;
}

function runMapEvent(input) {
  return spawnSync(process.execPath, [runnerPath, "map-event", "--input", input], {
    cwd: root,
    encoding: "utf8",
  });
}

function main() {
  assert.ok(fs.existsSync(runnerPath), "bin/abk-runner.js is missing");

  const usageResult = spawnSync(process.execPath, [runnerPath, "map-event"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(usageResult.status, 2, "map-event usage error exit code mismatch");
  assert.equal(usageResult.stdout, "", "map-event usage error stdout should be empty");
  assert.equal(
    usageResult.stderr,
    "Usage: abk-runner map-event --input <hook-event.json>\n",
    "map-event usage error should name hook-event input"
  );

  for (const testCase of cases) {
    assert.ok(fs.existsSync(path.join(root, testCase.input)), `${testCase.input} is missing`);
    assert.ok(fs.existsSync(path.join(root, testCase.expected)), `${testCase.expected} is missing`);

    const result = runMapEvent(testCase.input);
    assert.equal(result.status, testCase.exitCode, `${testCase.name}: exit code mismatch\nstderr=${result.stderr}`);
    assert.equal(result.stderr, "", `${testCase.name}: stderr should be empty`);

    const actual = JSON.parse(result.stdout);
    const expected = readJson(testCase.expected);
    assert.deepEqual(actual, expected, `${testCase.name}: output mismatch`);
    assert.equal(findForbiddenKey(actual), null, `${testCase.name}: output contains forbidden field`);

    if (testCase.exitCode === 0) {
      assert.ok(Object.hasOwn(actual, "inputs"), `${testCase.name}: valid output must be runner input`);
      assert.ok(!Object.hasOwn(actual, "findings"), `${testCase.name}: mapper must not emit scanner findings`);
      assert.ok(!Object.hasOwn(actual, "selectedScanners"), `${testCase.name}: mapper must not select scanners`);
    } else {
      assert.equal(actual.status, "error", `${testCase.name}: rejected output status mismatch`);
      assert.equal(actual.blocked, true, `${testCase.name}: rejected output must block`);
      assert.deepEqual(actual.inputsUsed, [], `${testCase.name}: rejected output must not consume private inputs`);
      assert.deepEqual(actual.findings, [], `${testCase.name}: rejected output must not emit scanner findings`);
    }
  }

  console.log(`abk runner map-event check passed (${cases.length} cases)`);
}

main();
