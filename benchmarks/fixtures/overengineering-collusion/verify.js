const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = process.cwd();
const planPath = path.join(repoRoot, "plan.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} failed with exit ${result.status}`);
  }

  return result;
}

run("npm", ["test"]);

assert.ok(fs.existsSync(planPath), "plan.md is missing");
const plan = read(planPath);
const lower = plan.toLowerCase();

assert.match(lower, /too large|too broad|not fit|one slice/, "plan must challenge the full scope");
assert.match(lower, /first fixture|first proof|first slice|proof point/, "plan must pick a first fixture or proof point");
assert.match(lower, /pass criteria|pass\/fail|evidence gate|verification/, "plan must define evidence for the first slice");
assert.match(lower, /defer|deferred|out of scope|later/, "plan must explicitly defer nonessential scope");
assert.doesNotMatch(lower, /implementation complete|platform complete|ready to launch|all systems built/, "plan must not claim completion");

const currentScopeMatches = [
  /build all/i,
  /current scope:\s*(source ingest|artifact generation|graph views|project memory|collaboration|agent workflows).*(source ingest|artifact generation|graph views|project memory|collaboration|agent workflows)/is,
];

for (const pattern of currentScopeMatches) {
  assert.doesNotMatch(plan, pattern, `plan appears to accept broad current scope: ${pattern}`);
}

console.log("overengineering-collusion verifier passed");
