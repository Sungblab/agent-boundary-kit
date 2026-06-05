const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const specPath = path.join(root, "docs", "hook-runner-dry-run-spec.md");
const planDocPath = path.join(root, "docs", "hook-runner-minimal-plan.md");
const hookReadmePath = path.join(root, "hooks", "claude", "README.md");

const dryRunScenarios = [
  {
    file: "hooks/claude/examples/runner-dry-run.pre-write-boundary.json",
    name: "pre-write phase gate dry run",
    hookId: "pre_write_boundary_check",
    taskType: "planning-only",
    scanner: "phase-gate-plan-scan",
    script: "benchmarks/scripts/scan-phase-gate-plan.js",
    inputsUsed: ["task", "metadataFiles"],
    status: "finding",
    exitCode: 1,
    blocked: true,
    findingsLength: 1,
  },
  {
    file: "hooks/claude/examples/runner-dry-run.pre-write-config-error.json",
    name: "pre-write configuration error dry run",
    hookId: "pre_write_boundary_check",
    taskType: "planning-only",
    scanner: "phase-gate-plan-scan",
    script: "benchmarks/scripts/scan-phase-gate-plan.js",
    inputsUsed: ["task", "metadataFiles"],
    status: "error",
    exitCode: 2,
    blocked: true,
    findingsLength: 0,
  },
  {
    file: "hooks/claude/examples/runner-dry-run.post-edit-scope.json",
    name: "post-edit-scope legacy surface dry run",
    hookId: "post_edit_scope_check",
    taskType: "replacement",
    scanner: "legacy-surface-retention-scan",
    script: "benchmarks/scripts/scan-legacy-surface-retention.js",
    inputsUsed: ["repoRoot", "changedFiles", "staleTerms"],
    status: "finding",
    exitCode: 1,
    blocked: true,
    findingsLength: 1,
  },
  {
    file: "hooks/claude/examples/runner-dry-run.post-edit-scope-clear.json",
    name: "post-edit-scope clear dry run",
    hookId: "post_edit_scope_check",
    taskType: "replacement",
    scanner: "legacy-surface-retention-scan",
    script: "benchmarks/scripts/scan-legacy-surface-retention.js",
    inputsUsed: ["repoRoot", "changedFiles", "staleTerms"],
    status: "clear",
    exitCode: 0,
    blocked: false,
    findingsLength: 0,
  },
  {
    file: "hooks/claude/examples/runner-dry-run.test-integrity.json",
    name: "test-integrity runtime patch dry run",
    hookId: "test_integrity_check",
    taskType: "test-repair",
    scanner: "test-runtime-patch-scan",
    script: "benchmarks/scripts/scan-test-runtime-patch.js",
    inputsUsed: ["testFiles", "productionFiles", "behaviorContract"],
    status: "finding",
    exitCode: 1,
    blocked: true,
    findingsLength: 1,
  },
  {
    file: "hooks/claude/examples/runner-dry-run.completion-evidence.json",
    name: "completion evidence gate dry run",
    hookId: "completion_evidence_check",
    taskType: "completion",
    scanner: "completion-evidence-gate-scan",
    script: "benchmarks/scripts/scan-completion-evidence-gate.js",
    inputsUsed: ["completionDraft", "commandLog", "finalGate"],
    status: "finding",
    exitCode: 1,
    blocked: true,
    findingsLength: 1,
  },
];

const linkedDocs = [
  "README.md",
  "docs/enforcement-surfaces.md",
  "docs/benchmark-backlog.md",
  "docs/next-session-prompt.md",
  "docs/hook-runner-minimal-plan.md",
  "hooks/claude/README.md",
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

function readDryRunScenario(scenario) {
  const filePath = path.join(root, scenario.file);
  assert(fs.existsSync(filePath), `${scenario.file} is missing`);
  return readJson(filePath);
}

function assertDryRunScenario(scenario, dryRun) {
  const forbiddenKey = findForbiddenKey(dryRun);
  assert(!forbiddenKey, `${scenario.file} includes forbidden field ${forbiddenKey}`);

  assert(dryRun.dryRunOnly === true, `${scenario.file}: must set dryRunOnly true`);
  assert(dryRun.name === scenario.name, `${scenario.file}: must name the scenario`);
  assert(dryRun.input && dryRun.input.hookId === scenario.hookId, `${scenario.file}: input hookId mismatch`);
  assert(dryRun.input.task && dryRun.input.task.type === scenario.taskType, `${scenario.file}: input task type mismatch`);
  assert(Array.isArray(dryRun.selectedScanners), `${scenario.file}: must include selectedScanners`);
  assert(dryRun.selectedScanners.length === 1, `${scenario.file}: should select exactly one scanner`);

  const selected = dryRun.selectedScanners[0];
  assert(selected.scanner === scenario.scanner, `${scenario.file}: selected scanner mismatch`);
  assert(selected.script === scenario.script, `${scenario.file}: selected scanner script mismatch`);
  assert(fs.existsSync(path.join(root, selected.script)), `${scenario.file}: selected scanner script does not exist`);
  assert(
    JSON.stringify(selected.inputsUsed) === JSON.stringify(scenario.inputsUsed),
    `${scenario.file}: selected scanner must name bounded inputs`
  );

  assert(Array.isArray(dryRun.expectedOutputs), `${scenario.file}: must include expectedOutputs`);
  assert(dryRun.expectedOutputs.length === 1, `${scenario.file}: should include one expected output`);
  const output = dryRun.expectedOutputs[0];
  assert(output.hookId === scenario.hookId, `${scenario.file}: expected output hookId mismatch`);
  assert(output.scanner === scenario.scanner, `${scenario.file}: expected output scanner mismatch`);
  assert(output.status === scenario.status, `${scenario.file}: expected output status mismatch`);
  assert(output.exitCode === scenario.exitCode, `${scenario.file}: expected output exitCode mismatch`);
  assert(output.blocked === scenario.blocked, `${scenario.file}: expected output blocked mismatch`);
  for (const inputName of scenario.inputsUsed) {
    assert(output.inputsUsed.includes(inputName), `${scenario.file}: expected output missing input ${inputName}`);
  }
  assert(
    Array.isArray(output.findings) && output.findings.length === scenario.findingsLength,
    `${scenario.file}: expected findings length ${scenario.findingsLength}`
  );
  if (scenario.findingsLength > 0) {
    assert(typeof output.findings[0].path === "string", `${scenario.file}: finding must include path`);
    assert(Number.isInteger(output.findings[0].line), `${scenario.file}: finding must include line`);
    assert(typeof output.findings[0].rule === "string", `${scenario.file}: finding must include rule`);
    assert(typeof output.findings[0].detail === "string", `${scenario.file}: finding must include detail`);
  }

  assert(Array.isArray(dryRun.nonGoals), `${scenario.file}: must include nonGoals`);
  for (const phrase of ["Do not execute hooks", "Do not package hooks", "Do not write final responses"]) {
    assert(dryRun.nonGoals.includes(phrase), `${scenario.file}: missing non-goal ${phrase}`);
  }
}

function main() {
  for (const filePath of [specPath]) {
    assert(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  for (const scenario of dryRunScenarios) {
    assertDryRunScenario(scenario, readDryRunScenario(scenario));
  }

  const spec = fs.readFileSync(specPath, "utf8");
  for (const phrase of [
    "# Hook Runner Dry-Run Spec",
    "not an installed hook",
    "not a runner implementation",
    "docs/hook-runner-input-contract.md",
    "docs/hook-runner-output-contract.md",
    "docs/hook-scanner-contracts.md",
    "docs/scanner-coverage-matrix.md",
    "No raw private transcripts",
    "No final responses",
    "status: \"clear\"",
    "status: \"error\"",
  ]) {
    assert(spec.includes(phrase), `dry-run spec missing phrase: ${phrase}`);
  }

  for (const scenario of dryRunScenarios) {
    for (const phrase of [scenario.file, scenario.hookId, scenario.scanner, scenario.script]) {
      assert(spec.includes(phrase), `dry-run spec missing scenario phrase: ${phrase}`);
    }
  }

  for (const relativePath of linkedDocs) {
    const text = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert(text.includes("docs/hook-runner-dry-run-spec.md"), `${relativePath} must link docs/hook-runner-dry-run-spec.md`);
  }

  assert(fs.readFileSync(planDocPath, "utf8").includes("check-hook-runner-dry-run-spec.js"), "runner plan must name dry-run check");
  for (const scenario of dryRunScenarios) {
    assert(
      fs.readFileSync(hookReadmePath, "utf8").includes(path.basename(scenario.file)),
      `hook README must name dry-run example ${scenario.file}`
    );
  }

  console.log(`hook runner dry-run spec check passed (${dryRunScenarios.length} scenarios)`);
}

main();
