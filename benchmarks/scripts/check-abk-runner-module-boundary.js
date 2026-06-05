const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const binPath = path.join(root, "bin", "abk-runner.js");
const corePath = path.join(root, "lib", "abk-runner-core.js");

function nonEmptyLines(source) {
  return source.split(/\r?\n/).filter((line) => line.trim().length > 0);
}

function main() {
  assert.ok(fs.existsSync(binPath), "bin/abk-runner.js is missing");
  assert.ok(fs.existsSync(corePath), "lib/abk-runner-core.js is missing");

  const binSource = fs.readFileSync(binPath, "utf8");
  assert.ok(binSource.startsWith("#!/usr/bin/env node\n"), "bin runner must keep the node shebang");
  assert.ok(
    binSource.includes('require("../lib/abk-runner-core.js")'),
    "bin runner must import the core runner module"
  );
  assert.ok(binSource.includes("main(process.argv.slice(2))"), "bin runner must delegate argv to core main");
  assert.ok(!binSource.includes("scannerCatalog"), "bin runner must not contain scanner catalog logic");
  assert.ok(!binSource.includes("function dryRun"), "bin runner must not contain dry-run implementation");
  assert.ok(!binSource.includes("function scan("), "bin runner must not contain scan implementation");
  assert.ok(nonEmptyLines(binSource).length <= 6, "bin runner must stay a thin wrapper");

  const core = require(corePath);
  for (const exportName of ["main", "dryRun", "scan", "selectScanners"]) {
    assert.equal(typeof core[exportName], "function", `core must export ${exportName}`);
  }

  console.log("abk runner module boundary check passed");
}

main();
