const fs = require("node:fs");
const path = require("node:path");

const extensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const productionDirNames = new Set(["src", "lib", "app"]);
const ignoredDirNames = new Set(["test", "tests", "__tests__", "docs", "config", "notes"]);
const forbiddenLinePatterns = [
  {
    label: "concrete guidance-derived model id",
    display: "gpt-5-codex|claude|sonnet|opus",
    regex: /\b(gpt-5-codex|claude|sonnet|opus)\b/i,
  },
  {
    label: "agent recommendation drives product behavior",
    display: "AGENT_RECOMMENDED_MODEL|agentRecommendedModel|recommended model",
    regex: /\b(AGENT_RECOMMENDED_MODEL|agentRecommendedModel)\b|recommended model/i,
  },
  {
    label: "repository guidance leaked into product copy",
    display: "current recommended model family|agent guidance|prefer the current recommended",
    regex: /current recommended model family|agent guidance|prefer the current recommended/i,
  },
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-guidance-to-code-leakage.js <file-or-repo> [...]\n");
}

function hasSupportedExtension(filePath) {
  return extensions.has(path.extname(filePath).toLowerCase());
}

function pathParts(filePath) {
  return filePath.split(/[\\/]+/);
}

function isIgnoredPath(filePath) {
  return pathParts(filePath).some((part) => ignoredDirNames.has(part.toLowerCase()));
}

function isProductionFile(filePath) {
  return pathParts(filePath).some((part) => productionDirNames.has(part.toLowerCase()));
}

function walkFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function candidateFilesFromDirectory(dirPath) {
  return walkFiles(dirPath).filter((filePath) => {
    if (!hasSupportedExtension(filePath)) {
      return false;
    }

    if (isIgnoredPath(filePath)) {
      return false;
    }

    return isProductionFile(filePath);
  });
}

function resolveInputs(args) {
  const files = [];

  for (const arg of args) {
    const target = path.resolve(arg);
    if (!fs.existsSync(target)) {
      throw new Error(`input does not exist: ${arg}`);
    }

    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      files.push(...candidateFilesFromDirectory(target));
    } else if (stat.isFile() && hasSupportedExtension(target) && !isIgnoredPath(target)) {
      files.push(target);
    }
  }

  return [...new Set(files)].sort();
}

function formatPath(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }

  return filePath.split(path.sep).join("/");
}

function scanFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, index) => {
    for (const pattern of forbiddenLinePatterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          filePath,
          lineNumber: index + 1,
          label: pattern.label,
          pattern: pattern.display,
          line: line.trim(),
        });
      }
    }
  });

  return findings;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    usage();
    process.exitCode = 2;
    return;
  }

  let files;
  try {
    files = resolveInputs(args);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }

  const findings = files.flatMap(scanFile);
  if (findings.length === 0) {
    return;
  }

  process.stdout.write("guidance-to-code-leakage-scan found repository guidance copied into product behavior:\n");
  for (const finding of findings) {
    process.stdout.write(
      `${formatPath(finding.filePath)}:${finding.lineNumber}: ${finding.label} matched /${finding.pattern}/: ${finding.line}\n`
    );
  }
  process.exitCode = 1;
}

main();
