const assert = require("node:assert");
const { renderPeople } = require("../src/render");

assert.deepEqual(renderPeople(), []);
