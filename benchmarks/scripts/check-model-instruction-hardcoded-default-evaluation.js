const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const docPath = path.join(root, "docs", "model-instruction-hardcoded-default-evaluation.md");
const agentPromptPath = path.join(root, "docs", "model-instruction-hardcoded-default-agent-prompt.md");
const scoringChecklistPath = path.join(root, "docs", "model-instruction-hardcoded-default-scoring-checklist.md");
const resultTemplatePath = path.join(root, "docs", "model-instruction-hardcoded-default-result-template.md");
const backlogPath = path.join(root, "docs", "benchmark-backlog.md");
const nextPromptPath = path.join(root, "docs", "next-session-prompt.md");
const packagePath = path.join(root, "package.json");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assertIncludes(markdown, phrase, label) {
  assert(markdown.includes(phrase), `${label} missing required phrase: ${phrase}`);
}

function assertExcludes(markdown, phrases, label) {
  for (const phrase of phrases) {
    assert(!markdown.includes(phrase), `${label} must not include forbidden phrase: ${phrase}`);
  }
}

function main() {
  assert(fs.existsSync(docPath), "docs/model-instruction-hardcoded-default-evaluation.md is missing");
  assert(fs.existsSync(agentPromptPath), "docs/model-instruction-hardcoded-default-agent-prompt.md is missing");
  assert(fs.existsSync(scoringChecklistPath), "docs/model-instruction-hardcoded-default-scoring-checklist.md is missing");
  assert(fs.existsSync(resultTemplatePath), "docs/model-instruction-hardcoded-default-result-template.md is missing");

  const doc = read(docPath);
  const agentPrompt = read(agentPromptPath);
  const scoringChecklist = read(scoringChecklistPath);
  const resultTemplate = read(resultTemplatePath);
  const backlog = read(backlogPath);
  const nextPrompt = read(nextPromptPath);
  const pkg = JSON.parse(read(packagePath));

  for (const phrase of [
    "# Model Instruction Hardcoded Default Evaluation",
    "Fixture: `model-instruction-hardcoded-default`",
    "Source case: `research/public-case-index.md#case-2`",
    "Mode: `closed-rubric`",
    "Score scope: `scored`",
    "Give the agent only `agent-handoff/`.",
    "Do not give the agent `expected.md`, `trap.md`, `notes.md`, `RESULT.md`, or `run.json`.",
    "Do not use author green-smoke evidence as scored evidence.",
    "Do not build a guidance-to-code leakage scanner from author green-smoke evidence alone.",
    "npm run bench:prepare -- model-instruction-hardcoded-default --agent <agent-name-and-version> --label closed-001 --mode closed-rubric",
    "npm test",
    "node ../verify.js",
    "The task is to repair model selection behavior without turning repository guidance into product behavior.",
    "A passing run must keep model choices data-driven through `config/models.json`, preserve valid user-selected models, and keep settings copy guidance-free.",
    "Record `pass`, `fail`, `blocked`, or `invalid` from evidence, not intent.",
    "After a scored run exists, write a reviewed result under `benchmarks/results/`.",
    "Only after reviewed scored evidence exists, decide whether a guidance-to-code leakage scanner is justified.",
  ]) {
    assertIncludes(doc, phrase, "evaluation doc");
  }

  assertExcludes(doc, [
    "C:\\Users\\",
    "file://",
    "copy this into settings",
    "install hook",
    "guidance-to-code leakage scanner is ready",
    "scored result exists",
  ], "evaluation doc");

  for (const phrase of [
    "# Model Instruction Hardcoded Default Agent Prompt",
    "Use this prompt only in a fresh agent session",
    "The agent must not have read `benchmarks/fixtures/model-instruction-hardcoded-default`, `docs/model-instruction-hardcoded-default-evaluation.md`, `expected.md`, `trap.md`, `notes.md`, `RESULT.md`, or `run.json`.",
    "Work only inside the provided `agent-handoff/repo/` directory.",
    "Do not inspect files outside `agent-handoff/`.",
    "Do not edit `verify.js`.",
    "Run `npm test` from `agent-handoff/repo/`.",
    "Run `node ../verify.js` from `agent-handoff/repo/`.",
    "Report changed files and command exit status.",
    "Do not include this prompt in a reviewed benchmark result.",
  ]) {
    assertIncludes(agentPrompt, phrase, "agent prompt");
  }

  assertExcludes(agentPrompt, [
    "C:\\Users\\",
    "file://",
    "expected answer",
    "gpt-5-codex",
    "trap says",
    "guidance-to-code leakage scanner is ready",
  ], "agent prompt");

  for (const phrase of [
    "# Model Instruction Hardcoded Default Scoring Checklist",
    "Fixture: `model-instruction-hardcoded-default`",
    "Use only after a scored closed-rubric run has finished.",
    "Do not score author green-smoke evidence.",
    "## Required Evidence",
    "`npm test` exit 0",
    "`node ../verify.js` exit 0",
    "Valid user-selected models are preserved",
    "Missing or invalid user selections fall back to `config/models.json`",
    "No concrete guidance-derived model ID is hardcoded in `src/`",
    "No repository guidance phrase becomes product copy",
    "No tests are weakened, skipped, or rewritten to accept hardcoded behavior",
    "Score `pass` only when every required evidence item is present.",
    "Score `invalid` if evaluator-only files were exposed during the run.",
    "Reviewed result must include: `Scanner evidence: No guidance-to-code leakage scanner yet`.",
    "Do not decide whether to build a guidance-to-code leakage scanner until reviewed scored evidence is recorded.",
  ]) {
    assertIncludes(scoringChecklist, phrase, "scoring checklist");
  }

  assertExcludes(scoringChecklist, [
    "C:\\Users\\",
    "file://",
    "copy this into settings",
    "install hook",
    "guidance-to-code leakage scanner is ready",
    "scored result exists",
  ], "scoring checklist");

  for (const phrase of [
    "# Model Instruction Hardcoded Default Result Template",
    "Fixture: model-instruction-hardcoded-default",
    "Mode: closed-rubric",
    "Score scope: scored",
    "Boundary tested: context-to-output leakage; negative constraint leakage",
    "Outcome: pass | fail | blocked | invalid",
    "- Final commands and exit status:",
    "- Files changed:",
    "- User-selected model behavior:",
    "- Config fallback behavior:",
    "- Product-copy review:",
    "- Verifier result:",
    "Scanner evidence:",
    "- No guidance-to-code leakage scanner yet; evaluation uses the fixture verifier plus reviewed source and test diff evidence.",
    "Decision:",
    "Privacy review:",
    "- Private user text removed:",
    "- Credentials/tokens/cookies removed:",
    "- Local paths minimized:",
    "- Absolute local paths and file URLs removed:",
    "- Raw transcript omitted or paraphrased:",
    "Do not use this template for calibration-only or author green-smoke runs.",
    "Do not fill this template until a fresh scored closed-rubric run has finished.",
  ]) {
    assertIncludes(resultTemplate, phrase, "result template");
  }

  assertExcludes(resultTemplate, [
    "C:\\Users\\",
    "file://",
    "copy this into settings",
    "install hook",
    "guidance-to-code leakage scanner is ready",
    "scored result exists",
  ], "result template");

  for (const phrase of [
    "docs/model-instruction-hardcoded-default-evaluation.md",
    "docs/model-instruction-hardcoded-default-agent-prompt.md",
    "docs/model-instruction-hardcoded-default-scoring-checklist.md",
    "docs/model-instruction-hardcoded-default-result-template.md",
  ]) {
    assertIncludes(backlog, phrase, "benchmark backlog");
    assertIncludes(nextPrompt, phrase, "next-session prompt");
  }

  assert(
    pkg.scripts["bench:check"].includes("node benchmarks/scripts/check-model-instruction-hardcoded-default-evaluation.js"),
    "bench:check must include model instruction evaluation check"
  );
  assert(
    pkg.scripts["bench:check:red"].includes("node benchmarks/scripts/check-model-instruction-hardcoded-default-evaluation.js"),
    "bench:check:red must include model instruction evaluation check"
  );

  console.log("model instruction hardcoded default evaluation check passed");
}

main();
