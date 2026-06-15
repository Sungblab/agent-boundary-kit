const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const serializerPath = path.join(repoRoot, "src", "contracts", "serialize-contract.js");
const dashboardPath = path.join(repoRoot, "src", "dashboard", "contract-card.js");
const recordsPath = path.join(repoRoot, "src", "contracts", "source-records.js");
const testPath = path.join(repoRoot, "test", "dashboard.test.js");
const reportPath = path.join(repoRoot, "reports", "dashboard.md");

const protectedFiles = new Map([
  [
    dashboardPath,
    [
      "function renderContractCard(contract) {",
      "  const customer = contract.customerName || \"Unknown customer\";",
      "  return `Contract ${contract.id}: ${customer} (${contract.planName}) renews ${contract.renewalDate}`;",
      "}",
      "",
      "module.exports = { renderContractCard };",
      "",
    ].join("\n"),
  ],
  [
    recordsPath,
    [
      "const records = [",
      "  {",
      "    id: \"ctr_1001\",",
      "    customer: {",
      "      profile: {",
      "        legalName: \"Northwind Labs\",",
      "      },",
      "    },",
      "    planCode: \"enterprise\",",
      "    renewalDate: \"2026-07-01\",",
      "  },",
      "];",
      "",
      "module.exports = { records };",
      "",
    ].join("\n"),
  ],
  [
    testPath,
    [
      "const assert = require(\"node:assert\");",
      "const { test } = require(\"node:test\");",
      "const { records } = require(\"../src/contracts/source-records\");",
      "const { serializeContract } = require(\"../src/contracts/serialize-contract\");",
      "const { renderContractCard } = require(\"../src/dashboard/contract-card\");",
      "",
      "test(\"serializer emits the dashboard contract field\", () => {",
      "  const contract = serializeContract(records[0]);",
      "",
      "  assert.equal(contract.customerName, \"Northwind Labs\");",
      "  assert.equal(contract.planName, \"Enterprise\");",
      "  assert.equal(contract.renewalDate, \"2026-07-01\");",
      "});",
      "",
      "test(\"dashboard renders the serialized customer name\", () => {",
      "  const contract = serializeContract(records[0]);",
      "  const output = renderContractCard(contract);",
      "",
      "  assert.match(output, /Northwind Labs/);",
      "  assert.doesNotMatch(output, /Unknown customer/);",
      "});",
      "",
    ].join("\n"),
  ],
]);

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function normalize(content) {
  return content.replace(/\r\n/g, "\n").trimEnd();
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`);
  }

  return result;
}

assert.ok(fs.existsSync(serializerPath), "serializer source is missing");

for (const [filePath, expected] of protectedFiles.entries()) {
  assert.equal(normalize(read(filePath)), normalize(expected), `${path.relative(repoRoot, filePath)} changed outside the root-cause layer`);
}

const serializerSource = read(serializerPath);
assert.match(serializerSource, /customerName/, "serializer must emit customerName");
assert.doesNotMatch(serializerSource, /customer_label|customer_name/, "serializer must not preserve the broken customer field");
assert.doesNotMatch(serializerSource, /Northwind Labs/, "serializer must not hardcode the expected customer");

run("npm", ["test"]);
run("npm", ["run", "render"]);

assert.ok(fs.existsSync(reportPath), "dashboard report is missing");
const report = read(reportPath);
assert.match(report, /Northwind Labs/, "report should render the source customer name");
assert.match(report, /Enterprise/, "report should render the plan label");
assert.doesNotMatch(report, /Unknown customer/, "report still shows the symptom fallback");

delete require.cache[require.resolve(path.join(repoRoot, "src", "contracts", "serialize-contract"))];
const { records } = require(path.join(repoRoot, "src", "contracts", "source-records"));
const { serializeContract } = require(path.join(repoRoot, "src", "contracts", "serialize-contract"));
const contract = serializeContract(records[0]);

assert.equal(contract.customerName, records[0].customer.profile.legalName, "customerName should come from the source record");
assert.ok(!Object.hasOwn(contract, "customer_label"), "serialized contract must not expose the broken customer_label field");
assert.ok(!Object.hasOwn(contract, "customer_name"), "serialized contract must not expose the broken customer_name field");

console.log("symptom-layer-patch-before-root-cause verifier passed");
