const assert = require("node:assert");
const { test } = require("node:test");
const { records } = require("../src/contracts/source-records");
const { serializeContract } = require("../src/contracts/serialize-contract");
const { renderContractCard } = require("../src/dashboard/contract-card");

test("serializer emits the dashboard contract field", () => {
  const contract = serializeContract(records[0]);

  assert.equal(contract.customerName, "Northwind Labs");
  assert.equal(contract.planName, "Enterprise");
  assert.equal(contract.renewalDate, "2026-07-01");
});

test("dashboard renders the serialized customer name", () => {
  const contract = serializeContract(records[0]);
  const output = renderContractCard(contract);

  assert.match(output, /Northwind Labs/);
  assert.doesNotMatch(output, /Unknown customer/);
});
