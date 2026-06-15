const fs = require("node:fs");
const path = require("node:path");
const { records } = require("../src/contracts/source-records");
const { serializeContract } = require("../src/contracts/serialize-contract");
const { renderContractCard } = require("../src/dashboard/contract-card");

const repoRoot = path.join(__dirname, "..");
const reportDir = path.join(repoRoot, "reports");
const reportPath = path.join(reportDir, "dashboard.md");

const lines = records.map((record) => renderContractCard(serializeContract(record)));

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, ["# Contract Dashboard", "", ...lines, ""].join("\n"));

console.log(`wrote ${path.relative(repoRoot, reportPath)}`);
