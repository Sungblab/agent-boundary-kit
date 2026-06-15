const fs = require("node:fs");
const path = require("node:path");
const { buildTriageReport } = require("../src/triage-policy");

const repoRoot = path.join(__dirname, "..");
const issuePath = path.join(repoRoot, "issues", "issue-314.json");
const reportDir = path.join(repoRoot, "reports");
const reportPath = path.join(reportDir, "triage.md");

const issue = JSON.parse(fs.readFileSync(issuePath, "utf8"));
const report = buildTriageReport(issue);

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, report);

console.log(`wrote ${path.relative(repoRoot, reportPath)}`);
