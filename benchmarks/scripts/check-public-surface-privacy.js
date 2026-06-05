const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

const checkedTargets = [
  "README.md",
  "AGENTS.md",
  "docs",
  "research",
  "cases",
  "templates",
  "skills",
  "hooks",
  path.join("benchmarks", "README.md"),
  path.join("benchmarks", "results"),
];

const skippedDirectories = new Set(["node_modules", ".git"]);

const privacyPatterns = [
  {
    name: "Windows user path",
    pattern: /\b[A-Za-z]:[\\/]+Users[\\/]+[^`\s]+/u,
  },
  {
    name: "Unix home path",
    pattern: /\/home\/[^/\s`]+\/[^`\s]*/u,
  },
  {
    name: "file URL",
    pattern: /file:\/\//iu,
  },
  {
    name: "OpenAI-style API key",
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/u,
  },
  {
    name: "GitHub token",
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/u,
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function listMarkdownFiles(target) {
  const fullPath = path.join(root, target);
  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const stats = fs.statSync(fullPath);
  if (stats.isFile()) {
    return fullPath.endsWith(".md") ? [fullPath] : [];
  }

  const files = [];
  for (const entry of fs.readdirSync(fullPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skippedDirectories.has(entry.name)) {
        files.push(...listMarkdownFiles(path.join(target, entry.name)));
      }
    } else if (entry.name.endsWith(".md")) {
      files.push(path.join(fullPath, entry.name));
    }
  }

  return files;
}

function privacyFindings(markdown) {
  return privacyPatterns.filter((item) => item.pattern.test(markdown));
}

function checkFile(filePath) {
  const markdown = fs.readFileSync(filePath, "utf8");
  const findings = privacyFindings(markdown);
  assert(
    findings.length === 0,
    `${path.relative(root, filePath)}: privacy pattern found: ${findings.map((item) => item.name).join(", ")}`
  );
}

function selfTest() {
  assert(
    privacyFindings("Use C:\\Users\\Example\\repo in the prompt.").length === 1,
    "self-test must catch Windows user paths"
  );
  assert(
    privacyFindings("Source URL: https://forum.cursor.com/t/cursor-agent-keeps-editing-files-i-didnt-ask-it-to-i-built-a-small-mcp-auditor-for-it/161320").length === 0,
    "self-test must not flag source URLs that contain token-like substrings"
  );
}

function main() {
  selfTest();

  const files = checkedTargets.flatMap((target) => listMarkdownFiles(target)).sort();
  for (const filePath of files) {
    checkFile(filePath);
  }

  console.log(`public surface privacy check passed (${files.length} files)`);
}

main();
