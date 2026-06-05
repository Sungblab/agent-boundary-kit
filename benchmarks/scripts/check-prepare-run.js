const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const prepareRunPath = path.join(root, "benchmarks", "scripts", "prepare-run.js");
const fixtureId = "parser-fallback-before-root-cause";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function safeRemove(target) {
  if (!fs.existsSync(target)) {
    return;
  }

  const resolvedTarget = fs.realpathSync(target);
  const resolvedTemp = fs.realpathSync(os.tmpdir());

  assert(
    resolvedTarget.startsWith(resolvedTemp),
    `refusing to remove non-temp path: ${resolvedTarget}`
  );

  fs.rmSync(resolvedTarget, { recursive: true, force: true });
}

function prepareRun(tempRoot, mode) {
  const result = spawnSync(
    process.execPath,
    [
      prepareRunPath,
      fixtureId,
      "--agent",
      "check-runner",
      "--label",
      mode,
      "--mode",
      mode,
      "--out",
      tempRoot,
    ],
    {
      cwd: root,
      encoding: "utf8",
    }
  );

  assert(result.status === 0, result.stderr || result.stdout || "prepare-run failed");

  const runRoot = result.stdout.trim().split(/\r?\n/).at(-1);
  assert(runRoot && fs.existsSync(runRoot), `prepared run missing: ${runRoot}`);
  return runRoot;
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-prepare-check-"));

  try {
    const runRoot = prepareRun(tempRoot, "calibration");

    const runMeta = JSON.parse(fs.readFileSync(path.join(runRoot, "run.json"), "utf8"));
    assert(runMeta.evaluationMode === "calibration", "run.json must record evaluationMode");

    const resultMarkdown = fs.readFileSync(path.join(runRoot, "RESULT.md"), "utf8");
    assert(resultMarkdown.includes("## Evaluation Mode"), "RESULT.md must include Evaluation Mode");
    assert(resultMarkdown.includes("calibration"), "RESULT.md must include the selected mode");
    assert(resultMarkdown.includes("## Score Scope"), "RESULT.md must include Score Scope");

    const closedRunRoot = prepareRun(tempRoot, "closed-rubric");
    const agentBriefPath = path.join(closedRunRoot, "AGENT_BRIEF.md");
    assert(fs.existsSync(agentBriefPath), "prepare-run must write AGENT_BRIEF.md");

    const agentBrief = fs.readFileSync(agentBriefPath, "utf8");
    assert(agentBrief.includes("# Agent Run Brief"), "AGENT_BRIEF.md must have a stable heading");
    assert(agentBrief.includes("Use `opendataloader-pdf`"), "AGENT_BRIEF.md must include the fixture prompt");
    assert(agentBrief.includes("repo/"), "AGENT_BRIEF.md must tell the agent where to work");
    assert(!agentBrief.includes("expected.md"), "closed-rubric brief must not mention evaluator files");
    assert(!agentBrief.includes("trap.md"), "closed-rubric brief must not mention evaluator files");
    assert(!agentBrief.includes("notes.md"), "closed-rubric brief must not mention evaluator files");
    assert(!agentBrief.includes("tmp/parsed.json"), "closed-rubric brief must not reveal root cause");
    assert(!agentBrief.includes("pymupdf-fallback"), "closed-rubric brief must not reveal trap details");
    assert(!agentBrief.includes("Expected Result"), "closed-rubric brief must not reveal rubric");
  } finally {
    safeRemove(tempRoot);
  }

  console.log("prepare-run template check passed");
}

main();
