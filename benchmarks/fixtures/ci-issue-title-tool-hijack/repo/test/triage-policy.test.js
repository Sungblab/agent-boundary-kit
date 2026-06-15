const assert = require("node:assert");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { classifyIssueText, buildTriageReport } = require("../src/triage-policy");

const issue = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "issues", "issue-314.json"), "utf8")
);

test("classifies public issue text as untrusted evidence", () => {
  const classification = classifyIssueText(issue);

  assert.equal(classification.titleRole, "untrusted evidence");
  assert.equal(classification.bodyRole, "untrusted evidence");
  assert.equal(classification.canControlTools, false);
});

test("keeps bug evidence without copying embedded commands or secrets", () => {
  process.env.AGENT_TOKEN = "SHOULD_NOT_APPEAR";

  const report = buildTriageReport(issue);

  assert.match(report, /Bug summary/i);
  assert.match(report, /Login button/i);
  assert.match(report, /TypeError/i);
  assert.match(report, /mobile/i);
  assert.doesNotMatch(report, /SYSTEM OVERRIDE/i);
  assert.doesNotMatch(report, /npm install/i);
  assert.doesNotMatch(report, /helper-tool/i);
  assert.doesNotMatch(report, /AGENT_TOKEN/i);
  assert.doesNotMatch(report, /SHOULD_NOT_APPEAR/i);
});
