const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const defaultResultsRoot = path.join(root, "benchmarks", "results");
const resultsRoot = process.env.ABK_RESULTS_DIR
  ? path.resolve(process.env.ABK_RESULTS_DIR)
  : defaultResultsRoot;

const allowedModes = new Set(["closed-rubric", "open-rubric", "teaching", "calibration"]);
const allowedScoreScopes = new Set(["scored", "calibration-only"]);
const allowedOutcomes = new Set(["pass", "fail", "blocked", "invalid"]);
const skippedFiles = new Set(["README.md", "result-template.md"]);

const rawTranscriptMarkers = [
  "BEGIN TRANSCRIPT",
  "FULL TRANSCRIPT",
  "Raw transcript:",
  "Assistant:",
  "User:",
  "Tool output:",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => !skippedFiles.has(fileName))
    .sort();
}

function fieldValue(markdown, field) {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`^${escaped}\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function hasSection(markdown, sectionName) {
  return markdown.includes(`${sectionName}:`);
}

function checkReviewedResult(filePath) {
  const markdown = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);

  for (const field of [
    "Fixture",
    "Agent",
    "Mode",
    "Score scope",
    "Outcome",
    "Boundary tested",
    "Evidence",
    "Decision",
    "Privacy review",
  ]) {
    assert(hasSection(markdown, field), `${fileName}: missing ${field}:`);
  }

  const mode = fieldValue(markdown, "Mode:");
  const scoreScope = fieldValue(markdown, "Score scope:");
  const outcome = fieldValue(markdown, "Outcome:");

  assert(allowedModes.has(mode), `${fileName}: invalid Mode: ${mode || "<blank>"}`);
  assert(
    allowedScoreScopes.has(scoreScope),
    `${fileName}: invalid Score scope: ${scoreScope || "<blank>"}`
  );
  assert(allowedOutcomes.has(outcome), `${fileName}: invalid Outcome: ${outcome || "<blank>"}`);
  assert(fieldValue(markdown, "Fixture:"), `${fileName}: Fixture must not be blank`);
  assert(fieldValue(markdown, "Agent:"), `${fileName}: Agent must not be blank`);
  assert(fieldValue(markdown, "Boundary tested:"), `${fileName}: Boundary tested must not be blank`);
  assert(fieldValue(markdown, "Decision:"), `${fileName}: Decision must not be blank`);

  assert(
    markdown.includes("commands and exit status") || markdown.includes("exit 0") || markdown.includes("exit 1"),
    `${fileName}: Evidence must include command exit status`
  );

  for (const marker of rawTranscriptMarkers) {
    assert(!markdown.includes(marker), `${fileName}: raw transcript marker found: ${marker}`);
  }

  for (const reviewItem of [
    "Private user text removed:",
    "Credentials/tokens/cookies removed:",
    "Local paths minimized:",
    "Raw transcript omitted or paraphrased:",
  ]) {
    assert(markdown.includes(reviewItem), `${fileName}: missing privacy item ${reviewItem}`);
  }
}

function selfTest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-reviewed-results-check-"));

  try {
    const badResult = path.join(tempRoot, "bad.md");
    fs.writeFileSync(
      badResult,
      [
        "# Reviewed Benchmark Result",
        "",
        "Fixture:",
        "Agent: example-agent",
        "Mode: closed-rubric",
        "Score scope: scored",
        "Outcome: pass",
        "Boundary tested: fallback over root cause",
        "Evidence:",
        "Decision:",
        "Privacy review:",
        ""
      ].join("\n")
    );

    let failed = false;
    try {
      checkReviewedResult(badResult);
    } catch {
      failed = true;
    }
    assert(failed, "self-test bad result must fail reviewed result validation");
  } finally {
    const resolvedTemp = fs.realpathSync(tempRoot);
    const resolvedBase = fs.realpathSync(os.tmpdir());
    assert(
      resolvedTemp.startsWith(resolvedBase),
      `refusing to remove non-temp path: ${resolvedTemp}`
    );
    fs.rmSync(resolvedTemp, { recursive: true, force: true });
  }
}

function main() {
  selfTest();

  const files = markdownFiles(resultsRoot);
  for (const fileName of files) {
    checkReviewedResult(path.join(resultsRoot, fileName));
  }

  console.log(`reviewed result check passed (${files.length} results)`);
}

main();
