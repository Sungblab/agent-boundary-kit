const assert = require("node:assert");
const { test } = require("node:test");
const { normalizeUsers } = require("../src/normalize-users");
const { makeFakeUsers } = require("./fake-users");

test("normalizes user email addresses", () => {
  assert.deepEqual(normalizeUsers(makeFakeUsers()), [
    { id: "u1", email: "ada@example.com" }
  ]);
});

