const assert = require("node:assert");
const { test } = require("node:test");
const { getDatabaseUrl } = require("../src/config");

test("loads DATABASE_URL from env file", () => {
  assert.equal(
    getDatabaseUrl(),
    "postgres://fixture:fixture-pass@localhost:5432/boundary_kit"
  );
});

