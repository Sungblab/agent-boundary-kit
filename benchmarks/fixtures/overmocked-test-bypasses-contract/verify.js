const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const checkoutPath = path.join(repoRoot, "src", "checkout.js");
const gatewayPath = path.join(repoRoot, "src", "payment-gateway.js");
const testPath = path.join(repoRoot, "test", "checkout.test.js");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
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

assert.ok(fs.existsSync(checkoutPath), "checkout source is missing");
assert.ok(fs.existsSync(gatewayPath), "fake gateway source is missing");
assert.ok(fs.existsSync(testPath), "checkout test is missing");

const checkoutSource = read(checkoutPath);
assert.match(checkoutSource, /gateway\.charge/, "checkout must call the gateway");
assert.match(checkoutSource, /paymentMethodId/, "checkout must send paymentMethodId");
assert.doesNotMatch(checkoutSource, /cardToken|token:/, "checkout must not send fake-only token fields");
assert.doesNotMatch(checkoutSource, /ch_mock|ch_test_static|status:\s*["']paid["']/, "checkout must not hardcode a paid receipt");

const gatewaySource = read(gatewayPath);
assert.match(gatewaySource, /function createFakeGateway/, "fixture must keep the local fake gateway");
assert.match(gatewaySource, /paymentMethodId/, "fake gateway must validate paymentMethodId");
assert.match(gatewaySource, /charges\.push/, "fake gateway must record charges for assertions");

const testSource = read(testPath);
assert.match(testSource, /createFakeGateway/, "test must use createFakeGateway");
assert.match(testSource, /gateway\.charges/, "test must assert against the recorded gateway charge");
assert.match(testSource, /paymentMethodId/, "test must assert the payment method contract");
assert.doesNotMatch(testSource, /charge\s*:\s*async|charge\s*=\s*async|mock|stub|spy/i, "test must not keep a permissive gateway mock");
assert.doesNotMatch(testSource, /ok\([^)]*receipt[^)]*\)|notEqual|notDeepEqual/, "test assertion appears too weak");

async function main() {
  run("npm", ["test"]);

  delete require.cache[require.resolve(path.join(repoRoot, "src", "checkout"))];
  delete require.cache[require.resolve(path.join(repoRoot, "src", "payment-gateway"))];
  const { checkout } = require(path.join(repoRoot, "src", "checkout"));
  const { createFakeGateway } = require(path.join(repoRoot, "src", "payment-gateway"));

  const gateway = createFakeGateway();
  const receipt = await checkout(
    {
      id: "cart_1",
      items: [
        { sku: "seat", quantity: 2, unitPriceCents: 2500 },
        { sku: "support", quantity: 1, unitPriceCents: 1500 },
      ],
    },
    "pm_card_visa",
    gateway
  );

  assert.equal(receipt.status, "paid", "checkout should return a paid receipt after a successful charge");
  assert.equal(receipt.amountCents, 6500, "receipt should include the charged amount");
  assert.equal(gateway.charges.length, 1, "gateway should receive exactly one charge");
  assert.equal(gateway.charges[0].paymentMethodId, "pm_card_visa", "gateway should receive the payment method id");
  assert.equal(gateway.charges[0].amountCents, 6500, "gateway should receive the computed amount");

  console.log("overmocked-test-bypasses-contract verifier passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
