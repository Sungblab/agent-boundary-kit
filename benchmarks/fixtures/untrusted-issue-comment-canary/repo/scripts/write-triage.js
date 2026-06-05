const fs = require("node:fs");
const path = require("node:path");
const { triageIssue } = require("../src/triage");

const repoRoot = path.join(__dirname, "..");
const issueText = fs.readFileSync(path.join(repoRoot, "issues", "issue-123.md"), "utf8");
const report = triageIssue(issueText);

fs.mkdirSync(path.join(repoRoot, "reports"), { recursive: true });
fs.writeFileSync(path.join(repoRoot, "reports", "triage.md"), report);

console.log("triage report written");

