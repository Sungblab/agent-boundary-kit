const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const specPath = path.join(root, "docs", "hook-runner-dry-run-spec.md");
const dryRunExamplePath = path.join(root, "hooks", "claude", "examples", "runner-dry-run.post-edit-scope.json");
const planDocPath = path.join(root, "docs", "hook-runner-minimal-plan.md");
const hookReadmePath = path.join(root, "hooks", "claude", "README.md");

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

function main() {
  for (const filePath of [specPath, dryRunExamplePath]) {
    assert(fs.existsSync(filePath), `${path.relative(root, filePath).replaceAll("\\", "/")} is missing`);
  }

  const dryRun = readJson(dryRunExamplePath);
  const forbiddenKey = findForbiddenKey(dryRun);
  assert(!forbiddenKey, `dry-run example includes forbidden field ${forbiddenKey}`);

  assert(dryRun.dryRunOnly === true, "dry-run example must set dryRunOnly true");
  assert(dryRun.name === "post-edit-scope legacy surface dry run", "dry-run example must name the scenario");
  assert(dryRun.input && dryRun.input.hookId === "post_edit_scope_check", "dry-run input must target post_edit_scope_check");
  assert(dryRun.input.task && dryRun.input.task.type === "replacement", "dry-run input task must be replacement");
  assert(isStringArray(dryRun.input.inputs.changedFiles), "dry-run input must include changedFiles");
  assert(isStringArray(dryRun.input.inputs.staleTerms), "dry-run input must include staleTerms");
  assert(Array.isArray(dryRun.selectedScanners), "dry-run example must include selectedScanners");
  assert(dryRun.selectedScanners.length === 1, "dry-run example should select exactly one scanner");

  const selected = dryRun.selectedScanners[0];
  assert(selected.scanner === "legacy-surface-retention-scan", "dry-run selected scanner must be legacy-surface-retention-scan");
  assert(
    selected.script === "benchmarks/scripts/scan-legacy-surface-retention.js",
    "dry-run selected scanner must reference the legacy scanner script"
  );
  assert(fs.existsSync(path.join(root, selected.script)), `selected scanner script does not exist: ${selected.script}`);
  assert(
    JSON.stringify(selected.inputsUsed) === JSON.stringify(["repoRoot", "changedFiles", "staleTerms"]),
    "dry-run selected scanner must name bounded inputs"
  );

  assert(Array.isArray(dryRun.expectedOutputs), "dry-run example must include expectedOutputs");
  assert(dryRun.expectedOutputs.length === 1, "dry-run example should include one expected output");
  const output = dryRun.expectedOutputs[0];
  assert(output.hookId === dryRun.input.hookId, "expected output hookId must match input hookId");
  assert(output.scanner === selected.scanner, "expected output scanner must match selected scanner");
  assert(output.status === "finding", "expected dry-run output should show a finding");
  assert(output.exitCode === 1, "expected dry-run output should use exitCode 1");
  assert(output.blocked === true, "expected dry-run output should block");
  assert(output.inputsUsed.includes("staleTerms"), "expected output must include staleTerms in inputsUsed");
  assert(Array.isArray(output.findings) && output.findings.length === 1, "expected output must include one finding");

  assert(Array.isArray(dryRun.nonGoals), "dry-run example must include nonGoals");
  for (const phrase of ["Do not execute hooks", "Do not package hooks", "Do not write final responses"]) {
    assert(dryRun.nonGoals.includes(phrase), `dry-run example missing non-goal: ${phrase}`);
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
    "hooks/claude/examples/runner-dry-run.post-edit-scope.json",
    "legacy-surface-retention-scan",
    "benchmarks/scripts/scan-legacy-surface-retention.js",
    "No raw private transcripts",
    "No final responses",
  ]) {
    assert(spec.includes(phrase), `dry-run spec missing phrase: ${phrase}`);
  }

  for (const relativePath of linkedDocs) {
    const text = fs.readFileSync(path.join(root, relativePath), "utf8");
    assert(text.includes("docs/hook-runner-dry-run-spec.md"), `${relativePath} must link docs/hook-runner-dry-run-spec.md`);
  }

  assert(fs.readFileSync(planDocPath, "utf8").includes("check-hook-runner-dry-run-spec.js"), "runner plan must name dry-run check");
  assert(fs.readFileSync(hookReadmePath, "utf8").includes("runner-dry-run.post-edit-scope.json"), "hook README must name dry-run example");

  console.log("hook runner dry-run spec check passed");
}

main();
