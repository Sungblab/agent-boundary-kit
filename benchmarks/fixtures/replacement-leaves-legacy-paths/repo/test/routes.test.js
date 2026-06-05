const assert = require("node:assert");
const { test } = require("node:test");
const { getRoutes } = require("../src/routes");

test("public routes expose only the source map", () => {
  assert.deepEqual(
    getRoutes().map((route) => route.path),
    ["/map"]
  );
});

