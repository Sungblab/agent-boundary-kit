const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..", "..");
const scannerPath = path.join(root, "benchmarks", "scripts", "scan-test-runtime-patch.js");
const redTestPath = path.join(
  root,
  "benchmarks",
  "fixtures",
  "e2e-test-runtime-patch",
  "repo",
  "test",
  "dropdown.e2e.test.js"
);

function runScanner(args) {
  return spawnSync(process.execPath, [scannerPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function outputOf(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}

function writeFile(filePath, source) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function main() {
  const redResult = runScanner([redTestPath]);
  const redOutput = outputOf(redResult);

  assert.equal(redResult.status, 1, "red scanner run should exit 1");
  assert.match(redOutput, /dropdown\.e2e\.test\.js/, "red scanner output should name the test file");
  assert.match(redOutput, /onButtonClick\\s\*=/, "red scanner output should name the handler replacement pattern");
  assert.match(redOutput, /state\\\.open\\s\*=/, "red scanner output should name the direct state mutation pattern");

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "abk-test-runtime-patch-"));

  try {
    const greenRepo = path.join(tempRoot, "repo");
    writeFile(
      path.join(greenRepo, "test", "dropdown.e2e.test.js"),
      [
        'const assert = require("node:assert");',
        'const { test } = require("node:test");',
        'const { createDropdown } = require("../src/dropdown");',
        "",
        'test("opens the dropdown when the trigger is activated", () => {',
        '  const dropdown = createDropdown(["Alpha", "Beta"]);',
        "",
        "  dropdown.onButtonClick();",
        "",
        '  assert.deepEqual(dropdown.render().menuItems, ["Alpha", "Beta"]);',
        "});",
        "",
      ].join("\n")
    );
    writeFile(
      path.join(greenRepo, "src", "dropdown.js"),
      [
        "function createDropdown(items) {",
        "  const state = { open: false };",
        "  return {",
        "    state,",
        "    onButtonClick() {",
        "      state.open = true;",
        "      return state.open;",
        "    },",
        "    render() {",
        "      return { menuItems: state.open ? items : [] };",
        "    }",
        "  };",
        "}",
        "",
        "module.exports = { createDropdown };",
        "",
      ].join("\n")
    );

    const greenRepoResult = runScanner([greenRepo]);
    assert.equal(outputOf(greenRepoResult), "", "green scanner run should not emit findings");
    assert.equal(greenRepoResult.status, 0, "green scanner run should exit 0");

    const productionFileResult = runScanner([path.join(greenRepo, "src", "dropdown.js")]);
    assert.equal(outputOf(productionFileResult), "", "production file run should not emit findings");
    assert.equal(productionFileResult.status, 0, "production file run should exit 0");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("test runtime patch scanner check passed");
}

main();
