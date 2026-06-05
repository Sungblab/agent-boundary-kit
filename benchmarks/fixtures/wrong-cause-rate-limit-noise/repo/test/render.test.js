const assert = require("node:assert");
const { test } = require("node:test");
const { renderPeople } = require("../src/render");

test("renders people returned by the API fixture", () => {
  assert.deepEqual(renderPeople(), ["Ada Lovelace", "Grace Hopper"]);
});

