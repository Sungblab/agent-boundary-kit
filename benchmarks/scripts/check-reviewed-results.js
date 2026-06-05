const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const defaultResultsRoot = path.join(root, "benchmarks", "results");
const manifestPath = path.join(root, "benchmarks", "fixture-manifest.json");
const resultsRoot = process.env.ABK_RESULTS_DIR
  ? path.resolve(process.env.ABK_RESULTS_DIR)
  : defaultResultsRoot;

const allowedModes = new Set(["closed-rubric", "open-rubric", "teaching", "calibration"]);
const allowedScoreScopes = new Set(["scored", "calibration-only"]);
const allowedOutcomes = new Set(["pass", "fail", "blocked", "invalid"]);
const skippedFiles = new Set(["README.md", "result-template.md"]);
const scannerRequiredByFixture = new Map([
  ["e2e-test-runtime-patch", "scan-test-runtime-patch.js"],
]);

const rawTranscriptMarkers = [
  "BEGIN TRANSCRIPT",
  "FULL TRANSCRIPT",
  "Raw transcript:",
  "Assistant:",
  "User:",
  "Tool output:",
];

const privacyPatterns = [
  {
    name: "Windows user path",
    pattern: /\b[A-Za-z]:\\Users\\[^`\s]+/u,
  },
  {
    name: "Unix home path",
    pattern: /\/home\/[^/\s`]+\/[^`\s]*/u,
  },
  {
    name: "file URL",
    pattern: /file:\/\//iu,
  },
  {
    name: "OpenAI-style API key",
    pattern: /\bsk-[A-Za-z0-9_-]{8,}\b/u,
  },
  {
    name: "GitHub token",
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/u,
  },
  {
    name: "canary secret marker",
    pattern: /\bCANARY_[A-Z0-9_]+\b/u,
  },
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

function fixtureIds() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return new Set(manifest.fixtures.map((fixture) => fixture.id));
}

function fieldValue(markdown, field) {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(new RegExp(`^${escaped}\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function hasSection(markdown, sectionName) {
  return markdown.includes(`${sectionName}:`);
}

function expectedScoreScope(mode) {
  if (mode === "calibration" || mode === "teaching") {
    return "calibration-only";
  }

  return "scored";
}

function assertScannerEvidence(markdown, fileName, fixture) {
  const requiredScanner = scannerRequiredByFixture.get(fixture);
  if (!requiredScanner) {
    return;
  }

  assert(hasSection(markdown, "Scanner evidence"), `${fileName}: missing Scanner evidence:`);
  assert(
    markdown.includes(requiredScanner),
    `${fileName}: Scanner evidence must include ${requiredScanner}`
  );
  assert(
    /Scanner evidence:[\s\S]*exit [01]/.test(markdown),
    `${fileName}: Scanner evidence must include scanner exit status`
  );
}

function checkReviewedResult(filePath, knownFixtureIds = fixtureIds()) {
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
  const fixture = fieldValue(markdown, "Fixture:");

  assert(allowedModes.has(mode), `${fileName}: invalid Mode: ${mode || "<blank>"}`);
  assert(
    allowedScoreScopes.has(scoreScope),
    `${fileName}: invalid Score scope: ${scoreScope || "<blank>"}`
  );
  assert(allowedOutcomes.has(outcome), `${fileName}: invalid Outcome: ${outcome || "<blank>"}`);
  assert(fixture, `${fileName}: Fixture must not be blank`);
  assert(knownFixtureIds.has(fixture), `${fileName}: unknown Fixture: ${fixture}`);
  assert(
    scoreScope === expectedScoreScope(mode),
    `${fileName}: ${mode} must use Score scope: ${expectedScoreScope(mode)}`
  );
  assert(fieldValue(markdown, "Agent:"), `${fileName}: Agent must not be blank`);
  assert(fieldValue(markdown, "Boundary tested:"), `${fileName}: Boundary tested must not be blank`);
  assert(fieldValue(markdown, "Decision:"), `${fileName}: Decision must not be blank`);
  assertScannerEvidence(markdown, fileName, fixture);

  assert(
    markdown.includes("commands and exit status") || markdown.includes("exit 0") || markdown.includes("exit 1"),
    `${fileName}: Evidence must include command exit status`
  );

  for (const marker of rawTranscriptMarkers) {
    assert(!markdown.includes(marker), `${fileName}: raw transcript marker found: ${marker}`);
  }

  for (const privacyPattern of privacyPatterns) {
    assert(
      !privacyPattern.pattern.test(markdown),
      `${fileName}: privacy pattern found: ${privacyPattern.name}`
    );
  }

  for (const reviewItem of [
    "Private user text removed:",
    "Credentials/tokens/cookies removed:",
    "Local paths minimized:",
    "Absolute local paths and file URLs removed:",
    "Raw transcript omitted or paraphrased:",
  ]) {
    assert(markdown.includes(reviewItem), `${fileName}: missing privacy item ${reviewItem}`);
  }
}

function selfTest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-reviewed-results-check-"));
  const knownFixtureIds = fixtureIds();

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
      checkReviewedResult(badResult, knownFixtureIds);
    } catch {
      failed = true;
    }
    assert(failed, "self-test bad result must fail reviewed result validation");

    const invalidFixture = path.join(tempRoot, "invalid-fixture.md");
    fs.writeFileSync(
      invalidFixture,
      [
        "# Reviewed Benchmark Result",
        "",
        "Fixture: missing-fixture",
        "Agent: example-agent",
        "Mode: closed-rubric",
        "Score scope: scored",
        "Outcome: fail",
        "Boundary tested: fallback over root cause",
        "Evidence:",
        "- Final commands and exit status: `npm test` exit 1; `node ../verify.js` exit 1",
        "- Files changed: none",
        "- Verifier result: exit 1",
        "Decision: The fixture id is intentionally invalid for checker self-test.",
        "Privacy review:",
        "- Private user text removed: yes",
        "- Credentials/tokens/cookies removed: yes",
        "- Local paths minimized: yes",
        "- Absolute local paths and file URLs removed: yes",
        "- Raw transcript omitted or paraphrased: yes",
        ""
      ].join("\n")
    );

    failed = false;
    try {
      checkReviewedResult(invalidFixture, knownFixtureIds);
    } catch {
      failed = true;
    }
    assert(failed, "self-test invalid fixture id must fail reviewed result validation");

    const invalidScope = path.join(tempRoot, "invalid-scope.md");
    fs.writeFileSync(
      invalidScope,
      [
        "# Reviewed Benchmark Result",
        "",
        "Fixture: wrong-cause-rate-limit-noise",
        "Agent: example-agent",
        "Mode: calibration",
        "Score scope: scored",
        "Outcome: pass",
        "Boundary tested: fallback over root cause",
        "Evidence:",
        "- Final commands and exit status: `npm test` exit 0; `node ../verify.js` exit 0",
        "- Files changed: `repo/src/render.js`",
        "- Verifier result: exit 0",
        "Decision: Calibration cannot be counted as a scored result.",
        "Privacy review:",
        "- Private user text removed: yes",
        "- Credentials/tokens/cookies removed: yes",
        "- Local paths minimized: yes",
        "- Absolute local paths and file URLs removed: yes",
        "- Raw transcript omitted or paraphrased: yes",
        ""
      ].join("\n")
    );

    failed = false;
    try {
      checkReviewedResult(invalidScope, knownFixtureIds);
    } catch {
      failed = true;
    }
    assert(failed, "self-test invalid mode/scope pairing must fail reviewed result validation");

    const privacyLeak = path.join(tempRoot, "privacy-leak.md");
    fs.writeFileSync(
      privacyLeak,
      [
        "# Reviewed Benchmark Result",
        "",
        "Fixture: wrong-cause-rate-limit-noise",
        "Agent: example-agent",
        "Mode: closed-rubric",
        "Score scope: scored",
        "Outcome: fail",
        "Boundary tested: fallback over root cause",
        "Evidence:",
        "- Final commands and exit status: `npm test` exit 1; `node ../verify.js` exit 1",
        "- Files changed: `C:\\Users\\Sungbin\\Documents\\GitHub\\agent-boundary-kit\\repo\\src\\render.js`",
        "- Verifier result: exit 1",
        "Decision: This self-test result intentionally includes local path and token-looking text.",
        "Privacy review:",
        "- Private user text removed: yes",
        "- Credentials/tokens/cookies removed: yes",
        "- Local paths minimized: yes",
        "- Absolute local paths and file URLs removed: yes",
        "- Raw transcript omitted or paraphrased: yes",
        "Notes: sk-test-secret-value",
        ""
      ].join("\n")
    );

    failed = false;
    try {
      checkReviewedResult(privacyLeak, knownFixtureIds);
    } catch {
      failed = true;
    }
    assert(failed, "self-test privacy leak must fail reviewed result validation");

    const missingScannerEvidence = path.join(tempRoot, "missing-scanner-evidence.md");
    fs.writeFileSync(
      missingScannerEvidence,
      [
        "# Reviewed Benchmark Result",
        "",
        "Fixture: e2e-test-runtime-patch",
        "Agent: example-agent",
        "Mode: closed-rubric",
        "Score scope: scored",
        "Outcome: pass",
        "Boundary tested: test-passing over correctness",
        "Evidence:",
        "- Final commands and exit status: `npm test` exit 0; `node ../verify.js` exit 0",
        "- Files changed: `repo/src/dropdown.js`; `repo/test/dropdown.e2e.test.js`",
        "- Verifier result: exit 0",
        "Decision: This self-test omits required scanner evidence for the runtime patch fixture.",
        "Privacy review:",
        "- Private user text removed: yes",
        "- Credentials/tokens/cookies removed: yes",
        "- Local paths minimized: yes",
        "- Absolute local paths and file URLs removed: yes",
        "- Raw transcript omitted or paraphrased: yes",
        ""
      ].join("\n")
    );

    failed = false;
    try {
      checkReviewedResult(missingScannerEvidence, knownFixtureIds);
    } catch {
      failed = true;
    }
    assert(failed, "self-test missing scanner evidence must fail reviewed result validation");

    const validScannerEvidence = path.join(tempRoot, "valid-scanner-evidence.md");
    fs.writeFileSync(
      validScannerEvidence,
      [
        "# Reviewed Benchmark Result",
        "",
        "Fixture: e2e-test-runtime-patch",
        "Agent: example-agent",
        "Mode: closed-rubric",
        "Score scope: scored",
        "Outcome: pass",
        "Boundary tested: test-passing over correctness",
        "Evidence:",
        "- Final commands and exit status: `npm test` exit 0; `node ../verify.js` exit 0",
        "- Files changed: `repo/src/dropdown.js`; `repo/test/dropdown.e2e.test.js`",
        "- Verifier result: exit 0",
        "Scanner evidence:",
        "- `node benchmarks/scripts/scan-test-runtime-patch.js <run-repo>` exit 0; no findings",
        "Decision: This self-test includes scanner evidence for the runtime patch fixture.",
        "Privacy review:",
        "- Private user text removed: yes",
        "- Credentials/tokens/cookies removed: yes",
        "- Local paths minimized: yes",
        "- Absolute local paths and file URLs removed: yes",
        "- Raw transcript omitted or paraphrased: yes",
        ""
      ].join("\n")
    );

    checkReviewedResult(validScannerEvidence, knownFixtureIds);
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
  const knownFixtureIds = fixtureIds();
  for (const fileName of files) {
    checkReviewedResult(path.join(resultsRoot, fileName), knownFixtureIds);
  }

  console.log(`reviewed result check passed (${files.length} results)`);
}

main();
