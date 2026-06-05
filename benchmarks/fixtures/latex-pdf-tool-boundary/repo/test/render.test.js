const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { generatePdfArtifact } = require("../src/pdf-artifact");

test("generates the report PDF artifact", () => {
  const outputPath = generatePdfArtifact();
  assert.equal(outputPath, path.join(__dirname, "..", "build", "report.pdf"));
  assert.ok(fs.existsSync(outputPath));
  assert.match(fs.readFileSync(outputPath, "utf8"), /Report artifact from LaTeX/);
});

