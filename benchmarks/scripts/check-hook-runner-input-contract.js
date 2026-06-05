const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const schemaPath = path.join(root, "hooks", "claude", "runner-input.schema.json");
const validExamplePath = path.join(root, "hooks", "claude", "examples", "runner-input.valid.json");
const invalidTranscriptPath = path.join(root, "hooks", "claude", "examples", "runner-input.invalid-transcript.json");
const invalidMissingMetadataPath = path.join(
  root,
  "hooks",
  "claude",
  "examples",
  "runner-input.invalid-missing-metadata.json"
);
const contractDocPath = path.join(root, "docs", "hook-runner-input-contract.md");
const planDocPath = path.join(root, "docs", "hook-runner-minimal-plan.md");
const hookReadmePath = path.join(root, "hooks", "claude", "README.md");

const hookIds = [
  "pre_write_boundary_check",
  "post_edit_scope_check",
  "test_integrity_check",
  "completion_evidence_check",
];

const taskTypes = [
  "research-only",
  "planning-only",
  "implementation",
  "replacement",
  "test-repair",
  "completion",
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

function validateRunnerInput(input) {
  const forbiddenKey = findForbiddenKey(input);
  if (forbiddenKey) {
    return { ok: false, reason: `forbidden key ${forbiddenKey}` };
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, reason: "input must be an object" };
  }

  const allowedTopKeys = ["hookId", "repoRoot", "task", "inputs"];
  for (const key of Object.keys(input)) {
    if (!allowedTopKeys.includes(key)) {
      return { ok: false, reason: `unknown top-level key ${key}` };
    }
  }

  if (!hookIds.includes(input.hookId)) {
    return { ok: false, reason: "hookId must be a known hook id" };
  }

  if (typeof input.repoRoot !== "string" || input.repoRoot.trim().length === 0) {
    return { ok: false, reason: "repoRoot is required" };
  }

  if (!input.task || typeof input.task !== "object" || Array.isArray(input.task)) {
    return { ok: false, reason: "task is required" };
  }

  for (const key of Object.keys(input.task)) {
    if (!["type", "declaredBy", "summary"].includes(key)) {
      return { ok: false, reason: `unknown task key ${key}` };
    }
  }

  if (!taskTypes.includes(input.task.type)) {
    return { ok: false, reason: "task.type must be a known task type" };
  }

  if (!["user", "agent", "workflow"].includes(input.task.declaredBy)) {
    return { ok: false, reason: "task.declaredBy must be user, agent, or workflow" };
  }

  if (typeof input.task.summary !== "string" || input.task.summary.trim().length === 0) {
    return { ok: false, reason: "task.summary is required" };
  }

  if (!input.inputs || typeof input.inputs !== "object" || Array.isArray(input.inputs)) {
    return { ok: false, reason: "inputs is required" };
  }

  const allowedInputKeys = [
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

  for (const key of Object.keys(input.inputs)) {
    if (!allowedInputKeys.includes(key)) {
      return { ok: false, reason: `unknown inputs key ${key}` };
    }
  }

  for (const key of [
    "changedFiles",
    "approvedScope",
    "offLimits",
    "namedTools",
    "staleTerms",
    "externalSources",
    "metadataFiles",
    "testFiles",
    "productionFiles",
  ]) {
    if (input.inputs[key] !== undefined && !isStringArray(input.inputs[key])) {
      return { ok: false, reason: `inputs.${key} must be an array of strings` };
    }
  }

  for (const key of ["diffPath", "commandLog", "completionDraft", "behaviorContract"]) {
    if (input.inputs[key] !== undefined && typeof input.inputs[key] !== "string") {
      return { ok: false, reason: `inputs.${key} must be a string` };
    }
  }

  if (input.inputs.finalGate !== undefined) {
    const gate = input.inputs.finalGate;
    if (!gate || typeof gate !== "object" || Array.isArray(gate)) {
      return { ok: false, reason: "inputs.finalGate must be an object" };
    }
    for (const key of Object.keys(gate)) {
      if (!["command", "artifactPath"].includes(key)) {
        return { ok: false, reason: `unknown finalGate key ${key}` };
      }
    }
    if (typeof gate.command !== "string" || gate.command.trim().length === 0) {
      return { ok: false, reason: "inputs.finalGate.command is required" };
    }
    if (typeof gate.artifactPath !== "string" || gate.artifactPath.trim().length === 0) {
      return { ok: false, reason: "inputs.finalGate.artifactPath is required" };
    }
  }

  return { ok: true, reason: "valid" };
}

function main() {
  for (const filePath of [schemaPath, validExamplePath, invalidTranscriptPath, invalidMissingMetadataPath, contractDocPath]) {
    assert(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const schema = readJson(schemaPath);
  assert(schema.title === "Agent Boundary Hook Runner Input", "schema title must name the runner input");
  assert(schema.type === "object", "schema must validate an object");
  assert(schema.additionalProperties === false, "schema must reject unknown top-level fields");
  assert(schema.properties && schema.properties.hookId, "schema must define hookId");
  assert(JSON.stringify(schema.properties.hookId.enum) === JSON.stringify(hookIds), "schema hookId enum is incomplete");
  assert(schema.properties.task && schema.properties.task.additionalProperties === false, "schema task must reject unknown fields");
  assert(schema.properties.inputs && schema.properties.inputs.additionalProperties === false, "schema inputs must reject unknown fields");

  const schemaForbidden = findForbiddenKey(schema);
  assert(!schemaForbidden, `schema includes forbidden field ${schemaForbidden}`);

  const validExample = readJson(validExamplePath);
  const validResult = validateRunnerInput(validExample);
  assert(validResult.ok, `valid runner example should pass: ${validResult.reason}`);

  const invalidTranscript = readJson(invalidTranscriptPath);
  const transcriptResult = validateRunnerInput(invalidTranscript);
  assert(!transcriptResult.ok, "invalid transcript example should fail");
  assert(
    transcriptResult.reason.includes("rawPrivateTranscript"),
    `invalid transcript reason should name rawPrivateTranscript, got ${transcriptResult.reason}`
  );

  const invalidMissingMetadata = readJson(invalidMissingMetadataPath);
  const missingMetadataResult = validateRunnerInput(invalidMissingMetadata);
  assert(!missingMetadataResult.ok, "invalid missing-metadata example should fail");
  assert(
    missingMetadataResult.reason.includes("task is required"),
    `missing metadata reason should name task, got ${missingMetadataResult.reason}`
  );

  const contractDoc = fs.readFileSync(contractDocPath, "utf8");
  for (const phrase of [
    "# Hook Runner Input Contract",
    "hooks/claude/runner-input.schema.json",
    "hooks/claude/examples/runner-input.valid.json",
    "hooks/claude/examples/runner-input.invalid-transcript.json",
    "hooks/claude/examples/runner-input.invalid-missing-metadata.json",
    "No raw private transcripts",
    "No hidden chat history",
    "declared metadata",
    "explicit file or repo paths",
  ]) {
    assert(contractDoc.includes(phrase), `contract doc missing phrase: ${phrase}`);
  }

  for (const linkedFile of [planDocPath, hookReadmePath]) {
    const text = fs.readFileSync(linkedFile, "utf8");
    assert(
      text.includes("docs/hook-runner-input-contract.md"),
      `${path.relative(root, linkedFile).replaceAll("\\", "/")} must link docs/hook-runner-input-contract.md`
    );
  }

  console.log("hook runner input contract check passed");
}

main();
