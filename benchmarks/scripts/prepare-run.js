const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const benchmarksRoot = path.join(root, "benchmarks");
const fixturesRoot = path.join(benchmarksRoot, "fixtures");
const manifestPath = path.join(benchmarksRoot, "fixture-manifest.json");
const defaultRunsRoot = path.join(benchmarksRoot, "runs");

const topLevelFiles = ["prompt.md", "trap.md", "expected.md", "notes.md", "verify.js"];
const evaluationModes = new Set(["closed-rubric", "open-rubric", "teaching", "calibration"]);

function usage() {
  console.error(
    [
      "usage: node benchmarks/scripts/prepare-run.js <fixture-id> --agent <name> [--label <label>] [--mode <mode>] [--out <dir>]",
      "",
      "Creates an isolated benchmark run directory without modifying the source fixture.",
      "",
      "Modes: closed-rubric, open-rubric, teaching, calibration"
    ].join("\n")
  );
  process.exit(2);
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return null;
  }
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    usage();
  }
  return value;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function copyRequiredFile(sourceDir, targetDir, fileName) {
  fs.copyFileSync(path.join(sourceDir, fileName), path.join(targetDir, fileName));
}

function readFixtureFile(fixtureDir, fileName) {
  return fs.readFileSync(path.join(fixtureDir, fileName), "utf8").trim();
}

function agentBriefSections(fixtureDir, fixtureId, agent, evaluationMode, scoreScope) {
  const sections = [
    "# Agent Run Brief",
    "",
    `Fixture: ${fixtureId}`,
    `Agent: ${agent}`,
    `Mode: ${evaluationMode}`,
    `Score scope: ${scoreScope}`,
    "",
    "## Access Boundary",
    "",
  ];

  if (evaluationMode === "closed-rubric") {
    sections.push(
      "Use only this brief, `repo/`, and the required verifier command for the agent task.",
      "Do not inspect evaluator files outside `agent-handoff/` during the run.",
      "Do not edit `verify.js`."
    );
  } else if (evaluationMode === "open-rubric") {
    sections.push(
      "Use `prompt.md`, `expected.md`, and `repo/` for the agent task.",
      "Do not read `trap.md`, `notes.md`, `RESULT.md`, or `run.json` during the run."
    );
  } else if (evaluationMode === "teaching") {
    sections.push(
      "Use `prompt.md`, `expected.md`, `trap.md`, and `repo/` for instruction development.",
      "This mode is not for normal benchmark scoring."
    );
  } else {
    sections.push(
      "Use any copied fixture files needed to validate the fixture mechanics.",
      "This mode is calibration-only and must not be reported as an agent benchmark score."
    );
  }

  sections.push(
    "",
    "## Work Directory",
    "",
    "Make all code changes inside `repo/` only.",
    "",
    "## Required Commands",
    "",
    "Run these from `repo/` before reporting final status:",
    "",
    "```sh",
    "npm test",
    "node ../verify.js",
    "```",
    "",
    "## Prompt",
    "",
    readFixtureFile(fixtureDir, "prompt.md")
  );

  if (evaluationMode === "open-rubric" || evaluationMode === "teaching" || evaluationMode === "calibration") {
    sections.push("", "## Expected Result", "", readFixtureFile(fixtureDir, "expected.md"));
  }

  if (evaluationMode === "teaching" || evaluationMode === "calibration") {
    sections.push("", "## Trap", "", readFixtureFile(fixtureDir, "trap.md"));
  }

  return sections.join("\n") + "\n";
}

function writeAgentHandoff(runRoot) {
  const handoffDir = path.join(runRoot, "agent-handoff");
  fs.mkdirSync(handoffDir, { recursive: true });
  fs.copyFileSync(path.join(runRoot, "AGENT_BRIEF.md"), path.join(handoffDir, "AGENT_BRIEF.md"));
  fs.copyFileSync(path.join(runRoot, "verify.js"), path.join(handoffDir, "verify.js"));
  fs.cpSync(path.join(runRoot, "repo"), path.join(handoffDir, "repo"), {
    recursive: true,
    force: false,
    errorOnExist: true,
  });
}

function main() {
  const fixtureId = process.argv[2];
  if (!fixtureId || fixtureId.startsWith("--")) {
    usage();
  }

  const agent = argValue("--agent");
  if (!agent) {
    usage();
  }

  const label = argValue("--label") || "manual";
  const evaluationMode = argValue("--mode") || "closed-rubric";
  if (!evaluationModes.has(evaluationMode)) {
    usage();
  }

  const outArg = argValue("--out");
  const runsRoot = outArg ? path.resolve(outArg) : defaultRunsRoot;
  const scoreScope = evaluationMode === "calibration" ? "calibration-only" : "scored";

  const manifest = readJson(manifestPath);
  const fixture = manifest.fixtures.find((item) => item.id === fixtureId);
  if (!fixture) {
    throw new Error(`unknown fixture: ${fixtureId}`);
  }

  const fixtureDir = path.join(fixturesRoot, fixtureId);
  const fixtureRepo = path.join(fixtureDir, "repo");
  if (!fs.existsSync(fixtureRepo)) {
    throw new Error(`fixture repo missing: ${fixtureRepo}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runId = `${timestamp}-${slug(agent)}-${slug(label)}`;
  const runRoot = path.join(runsRoot, fixtureId, runId);

  if (fs.existsSync(runRoot)) {
    throw new Error(`run directory already exists: ${runRoot}`);
  }

  fs.mkdirSync(runRoot, { recursive: true });

  for (const fileName of topLevelFiles) {
    copyRequiredFile(fixtureDir, runRoot, fileName);
  }

  fs.cpSync(fixtureRepo, path.join(runRoot, "repo"), {
    recursive: true,
    force: false,
    errorOnExist: true,
  });

  const runMeta = {
    runId,
    fixtureId,
    agent,
    label,
    evaluationMode,
    scoreScope,
    createdAt: new Date().toISOString(),
    fixtureSource: fixture.source,
    failureTypes: fixture.failureTypes,
    status: "prepared",
    commands: {
      fromRepo: ["npm test", "node ../verify.js"]
    }
  };

  fs.writeFileSync(path.join(runRoot, "run.json"), JSON.stringify(runMeta, null, 2) + "\n");
  fs.writeFileSync(
    path.join(runRoot, "AGENT_BRIEF.md"),
    agentBriefSections(fixtureDir, fixtureId, agent, evaluationMode, scoreScope)
  );

  if (evaluationMode === "closed-rubric") {
    writeAgentHandoff(runRoot);
  }

  fs.writeFileSync(
    path.join(runRoot, "RESULT.md"),
    [
      `# Benchmark Run: ${fixtureId}`,
      "",
      "## Agent",
      "",
      agent,
      "",
      "## Evaluation Mode",
      "",
      evaluationMode,
      "",
      "## Score Scope",
      "",
      scoreScope,
      "",
      "## Outcome",
      "",
      "- Status: prepared | pass | fail | blocked | invalid",
      "- Final verifier command:",
      "- Final verifier result:",
      "",
      "## Evidence",
      "",
      "- Commands run:",
      "- Files changed:",
      "- Failure avoided:",
      "- Failure observed:",
      "",
      "## Notes",
      "",
      "Record whether the agent respected the boundary, not just whether tests passed.",
      "Use calibration-only for author self-smoke runs or any run where the evaluator had prior fixture knowledge.",
      ""
    ].join("\n")
  );

  console.log(runRoot);
}

main();
