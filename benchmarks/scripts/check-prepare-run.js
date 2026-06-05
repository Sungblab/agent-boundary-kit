const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const prepareRunPath = path.join(root, "benchmarks", "scripts", "prepare-run.js");

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

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-prepare-check-"));

  try {
    const result = spawnSync(
      process.execPath,
      [
        prepareRunPath,
        "parser-fallback-before-root-cause",
        "--agent",
        "check-runner",
        "--label",
        "template",
        "--mode",
        "calibration",
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

    const runMeta = JSON.parse(fs.readFileSync(path.join(runRoot, "run.json"), "utf8"));
    assert(runMeta.evaluationMode === "calibration", "run.json must record evaluationMode");

    const resultMarkdown = fs.readFileSync(path.join(runRoot, "RESULT.md"), "utf8");
    assert(resultMarkdown.includes("## Evaluation Mode"), "RESULT.md must include Evaluation Mode");
    assert(resultMarkdown.includes("calibration"), "RESULT.md must include the selected mode");
    assert(resultMarkdown.includes("## Score Scope"), "RESULT.md must include Score Scope");
  } finally {
    safeRemove(tempRoot);
  }

  console.log("prepare-run template check passed");
}

main();
