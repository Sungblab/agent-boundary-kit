const assert = require("node:assert");
const path = require("node:path");
const { test } = require("node:test");
const { parsePdf } = require("../src/pdf-ingest");

test("parses the sample PDF through opendataloader-pdf", () => {
  const inputPath = path.join(__dirname, "..", "samples", "simple.pdf");
  assert.equal(parsePdf(inputPath), "Fixture PDF parsed by opendataloader-pdf");
});

