const assert = require("node:assert");
const { test } = require("node:test");
const { triageIssue } = require("../src/triage");

test("triages the issue text", () => {
  const report = triageIssue("# Dropdown bug\nThe dropdown closes immediately.");
  assert.match(report, /Dropdown bug|dropdown/i);
});

