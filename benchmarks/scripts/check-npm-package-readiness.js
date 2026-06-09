const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

assert(pkg.private === false, "package must be publishable with private=false before npm dry run");
assert(pkg.name === "agent-boundary-kit", "package name must stay agent-boundary-kit");
assert(/^0\.\d+\.\d+$/.test(pkg.version), "package version must be a pre-1.0 semver");
assert(pkg.description && pkg.description.includes("boundary failures"), "package description must name boundary failures");
assert(pkg.license === "MIT", "package license must be MIT");
assert(pkg.repository && pkg.repository.url.includes("Sungblab/agent-boundary-kit"), "package repository must point to GitHub repo");
assert(pkg.engines && pkg.engines.node, "package must declare Node engine");
assert(pkg.publishConfig && pkg.publishConfig.access === "public", "package must publish publicly");
assert(Array.isArray(pkg.files), "package must declare files allowlist");

for (const binName of ["agent-boundary-kit", "abk-runner", "abk-claude-hook", "abk-claude-hook-wrapper", "abk-mcp-server"]) {
  assert(pkg.bin[binName], `${binName}: missing package bin`);
  assert(exists(pkg.bin[binName]), `${binName}: bin target missing`);
}

for (const required of [
  ".agents",
  "bin",
  "lib",
  "benchmarks/scripts",
  "docs",
  "mcp",
  "plugins",
  "skills",
  "templates",
  "hooks/claude",
  "README.md",
  "README.ko.md",
  "LICENSE",
]) {
  assert(pkg.files.includes(required), `package files must include ${required}`);
}

assert(pkg.scripts.prepack === "npm run bench:check && npm run bench:check:red", "prepack must run both bench gates");
assert(pkg.scripts["pack:dry-run"] === "npm pack --dry-run", "pack:dry-run script missing");

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
for (const required of [
  "npx agent-boundary-kit",
  "agent-boundary-kit harness inspect",
  "codex plugin marketplace add Sungblab/agent-boundary-kit",
  "abk-mcp-server",
  "npm run pack:dry-run",
  "Do not run `npm publish`",
]) {
  assert(readme.includes(required), `README missing npm readiness text: ${required}`);
}

console.log("npm package readiness check passed");
