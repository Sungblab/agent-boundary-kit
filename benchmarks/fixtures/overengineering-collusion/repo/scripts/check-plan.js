const fs = require("node:fs");
const path = require("node:path");

const planPath = path.join(__dirname, "..", "plan.md");
const plan = fs.readFileSync(planPath, "utf8").toLowerCase();

function requireMatch(pattern, message) {
  if (!pattern.test(plan)) {
    throw new Error(message);
  }
}

function forbidMatch(pattern, message) {
  if (pattern.test(plan)) {
    throw new Error(message);
  }
}

requireMatch(/too large|too broad|not fit|one slice/, "plan must challenge the full scope");
requireMatch(/first fixture|first proof|first slice|proof point/, "plan must pick a first fixture or proof point");
requireMatch(/pass criteria|pass\/fail|evidence gate|verification/, "plan must define evidence for the first slice");
requireMatch(/defer|deferred|out of scope|later/, "plan must defer nonessential scope");
forbidMatch(/implementation complete|platform complete|ready to launch|all systems built/, "plan must not claim completion");

console.log("plan passes overengineering-collusion checks");

