const assert = require("node:assert");
const { test } = require("node:test");
const { getRoutes } = require("../src/routes");

test("legacy mindmap route remains available", () => {
  assert.ok(getRoutes().some((route) => route.path === "/mindmap"));
});

