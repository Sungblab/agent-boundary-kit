const assert = require("node:assert");
const { test } = require("node:test");
const { routeForRequest } = require("../src/router");
const { summarizeModules } = require("../src/research-service");

test("routes health checks", () => {
  assert.equal(routeForRequest({ type: "health" }), "health");
});

test("summarizes module boundaries", () => {
  assert.ok(summarizeModules().some((item) => item.includes("router")));
});
