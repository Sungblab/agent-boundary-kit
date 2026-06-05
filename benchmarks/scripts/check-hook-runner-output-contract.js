const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const schemaPath = path.join(root, "hooks", "claude", "runner-output.schema.json");
const validFindingPath = path.join(root, "hooks", "claude", "examples", "runner-output.valid-finding.json");
const validClearPath = path.join(root, "hooks", "claude", "examples", "runner-output.valid-clear.json");
const invalidFinalCopyPath = path.join(root, "hooks", "claude", "examples", "runner-output.invalid-final-copy.json");
const invalidTranscriptPath = path.join(root, "hooks", "claude", "examples", "runner-output.invalid-transcript.json");
const contractDocPath = path.join(root, "docs", "hook-runner-output-contract.md");
const planDocPath = path.join(root, "docs", "hook-runner-minimal-plan.md");
const hookReadmePath = path.join(root, "hooks", "claude", "README.md");

const hookIds = [
  "pre_write_boundary_check",
  "post_edit_scope_check",
  "test_integrity_check",
  "completion_evidence_check",
];

const scannerIds = [
  "parser-fallback-boundary-scan",
  "latex-renderer-boundary-scan",
  "legacy-surface-retention-scan",
  "phase-gate-plan-scan",
  "test-runtime-patch-scan",
  "completion-evidence-gate-scan",
  "noisy-log-root-cause-scan",
  "hardcoded-credential-fallback-scan",
  "test-fake-contract-scan",
  "untrusted-context-canary-scan",
  "runner-command-contract",
];

const statuses = ["clear", "finding", "error"];
const exitCodes = [0, 1, 2];

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
  "finalResponse",
  "prDescription",
  "releaseNotes",
  "productCopy",
  "completionClaim",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function validateRunnerOutput(output) {
  const forbiddenKey = findForbiddenKey(output);
  if (forbiddenKey) {
    return { ok: false, reason: `forbidden key ${forbiddenKey}` };
  }

  if (!isPlainObject(output)) {
    return { ok: false, reason: "output must be an object" };
  }

  const allowedTopKeys = ["hookId", "scanner", "status", "exitCode", "blocked", "reason", "inputsUsed", "findings"];
  for (const key of Object.keys(output)) {
    if (!allowedTopKeys.includes(key)) {
      return { ok: false, reason: `unknown top-level key ${key}` };
    }
  }

  for (const key of allowedTopKeys) {
    if (output[key] === undefined) {
      return { ok: false, reason: `${key} is required` };
    }
  }

  if (!hookIds.includes(output.hookId)) {
    return { ok: false, reason: "hookId must be a known hook id" };
  }

  if (!scannerIds.includes(output.scanner)) {
    return { ok: false, reason: "scanner must be a known scanner id" };
  }

  if (!statuses.includes(output.status)) {
    return { ok: false, reason: "status must be clear, finding, or error" };
  }

  if (!exitCodes.includes(output.exitCode)) {
    return { ok: false, reason: "exitCode must be 0, 1, or 2" };
  }

  if (typeof output.blocked !== "boolean") {
    return { ok: false, reason: "blocked must be boolean" };
  }

  if (typeof output.reason !== "string" || output.reason.trim().length === 0) {
    return { ok: false, reason: "reason is required" };
  }

  if (!isStringArray(output.inputsUsed)) {
    return { ok: false, reason: "inputsUsed must be an array of strings" };
  }

  if (!Array.isArray(output.findings)) {
    return { ok: false, reason: "findings must be an array" };
  }

  for (const finding of output.findings) {
    if (!isPlainObject(finding)) {
      return { ok: false, reason: "each finding must be an object" };
    }
    for (const key of Object.keys(finding)) {
      if (!["path", "line", "rule", "detail"].includes(key)) {
        return { ok: false, reason: `unknown finding key ${key}` };
      }
    }
    for (const key of ["path", "rule", "detail"]) {
      if (typeof finding[key] !== "string" || finding[key].trim().length === 0) {
        return { ok: false, reason: `finding.${key} is required` };
      }
    }
    if (!Number.isInteger(finding.line) || finding.line < 1) {
      return { ok: false, reason: "finding.line must be a positive integer" };
    }
  }

  if (output.exitCode === 0 && (output.status !== "clear" || output.blocked !== false || output.findings.length !== 0)) {
    return { ok: false, reason: "exitCode 0 must be clear, unblocked, and finding-free" };
  }

  if (output.exitCode === 1 && (output.status !== "finding" || output.blocked !== true || output.findings.length === 0)) {
    return { ok: false, reason: "exitCode 1 must be a blocked finding with at least one finding" };
  }

  if (output.exitCode === 2 && (output.status !== "error" || output.blocked !== true)) {
    return { ok: false, reason: "exitCode 2 must be a blocked configuration error" };
  }

  return { ok: true, reason: "valid" };
}

function main() {
  for (const filePath of [
    schemaPath,
    validFindingPath,
    validClearPath,
    invalidFinalCopyPath,
    invalidTranscriptPath,
    contractDocPath,
  ]) {
    assert(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const schema = readJson(schemaPath);
  assert(schema.title === "Agent Boundary Hook Runner Output", "schema title must name the runner output");
  assert(schema.type === "object", "schema must validate an object");
  assert(schema.additionalProperties === false, "schema must reject unknown top-level fields");
  assert(schema.properties && schema.properties.hookId, "schema must define hookId");
  assert(JSON.stringify(schema.properties.hookId.enum) === JSON.stringify(hookIds), "schema hookId enum is incomplete");
  assert(JSON.stringify(schema.properties.scanner.enum) === JSON.stringify(scannerIds), "schema scanner enum is incomplete");
  assert(JSON.stringify(schema.properties.status.enum) === JSON.stringify(statuses), "schema status enum is incomplete");
  assert(JSON.stringify(schema.properties.exitCode.enum) === JSON.stringify(exitCodes), "schema exitCode enum is incomplete");
  assert(
    schema.properties.findings &&
      schema.properties.findings.items &&
      schema.properties.findings.items.additionalProperties === false,
    "schema finding items must reject unknown fields"
  );

  const schemaForbidden = findForbiddenKey(schema);
  assert(!schemaForbidden, `schema includes forbidden field ${schemaForbidden}`);

  for (const filePath of [validFindingPath, validClearPath]) {
    const example = readJson(filePath);
    const result = validateRunnerOutput(example);
    assert(result.ok, `${path.basename(filePath)} should pass: ${result.reason}`);
  }

  const invalidFinalCopy = readJson(invalidFinalCopyPath);
  const finalCopyResult = validateRunnerOutput(invalidFinalCopy);
  assert(!finalCopyResult.ok, "invalid final-copy example should fail");
  assert(
    finalCopyResult.reason.includes("finalResponse"),
    `invalid final-copy reason should name finalResponse, got ${finalCopyResult.reason}`
  );

  const invalidTranscript = readJson(invalidTranscriptPath);
  const transcriptResult = validateRunnerOutput(invalidTranscript);
  assert(!transcriptResult.ok, "invalid transcript example should fail");
  assert(
    transcriptResult.reason.includes("rawPrivateTranscript"),
    `invalid transcript reason should name rawPrivateTranscript, got ${transcriptResult.reason}`
  );

  const contractDoc = fs.readFileSync(contractDocPath, "utf8");
  for (const phrase of [
    "# Hook Runner Output Contract",
    "hooks/claude/runner-output.schema.json",
    "hooks/claude/examples/runner-output.valid-finding.json",
    "hooks/claude/examples/runner-output.valid-clear.json",
    "hooks/claude/examples/runner-output.invalid-final-copy.json",
    "hooks/claude/examples/runner-output.invalid-transcript.json",
    "No raw private transcripts",
    "No final responses",
    "bounded result",
    "supporting evidence",
    "runner-command-contract",
  ]) {
    assert(contractDoc.includes(phrase), `contract doc missing phrase: ${phrase}`);
  }

  for (const linkedFile of [planDocPath, hookReadmePath]) {
    const text = fs.readFileSync(linkedFile, "utf8");
    assert(
      text.includes("docs/hook-runner-output-contract.md"),
      `${path.relative(root, linkedFile).replaceAll("\\", "/")} must link docs/hook-runner-output-contract.md`
    );
  }

  console.log("hook runner output contract check passed");
}

main();
