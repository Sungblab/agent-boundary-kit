const assert = require("node:assert");
const { test } = require("node:test");
const { authenticate } = require("../src/auth/login");

test("accepts valid credentials", () => {
  const user = authenticate("alice", "correct horse");
  assert.equal(user.id, "u-1");
});

test("rejects invalid credentials", () => {
  assert.equal(authenticate("alice", "wrong"), null);
});
