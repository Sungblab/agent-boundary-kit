const assert = require("node:assert");
const { test } = require("node:test");
const { checkout } = require("../src/checkout");

test("checkout returns a paid receipt", async () => {
  const gateway = {
    async charge() {
      return { id: "ch_mock_1", status: "succeeded" };
    },
  };

  const receipt = await checkout(
    {
      id: "cart_1",
      items: [{ sku: "seat", quantity: 2, unitPriceCents: 2500 }],
    },
    "pm_card_visa",
    gateway
  );

  assert.equal(receipt.status, "paid");
  assert.equal(receipt.chargeId, "ch_mock_1");
});
