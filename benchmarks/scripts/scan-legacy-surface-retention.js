const fs = require("node:fs");
const path = require("node:path");

const extensions = new Set([".cjs", ".js", ".jsx", ".md", ".mjs", ".ts", ".tsx"]);
const checkedDirNames = new Set(["src", "docs", "test", "tests"]);
const staleFileNamePattern = /legacy[-_.]?(mindmap|graph)|legacy[-_.]?route/i;
const staleLinePatterns = [
  {
    label: "stale mindmap route",
    display: "/mindmap",
    regex: /\/mindmap/i,
  },
  {
    label: "stale graph route",
    display: "/graph",
    regex: /\/graph/i,
  },
  {
    label: "stale mindmap surface",
    display: "mindmap|LegacyMindmap",
    regex: /mindmap|LegacyMindmap/i,
  },
  {
    label: "stale graph surface",
    display: "knowledge graph|legacy graph|LegacyGraph",
    regex: /knowledge graph|legacy graph|LegacyGraph/i,
  },
  {
    label: "legacy fallback wording",
    display: "legacy route remains|legacy surface remains",
    regex: /legacy (mindmap|graph|route|surface) (remains|fallback|available)/i,
  },
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-legacy-surface-retention.js <file-or-repo> [...]\n");
}

function hasSupportedExtension(filePath) {
  return extensions.has(path.extname(filePath).toLowerCase());
}

function pathParts(filePath) {
  return filePath.split(/[\\/]+/);
}

function isCheckedFile(filePath) {
  return pathParts(filePath).some((part) => checkedDirNames.has(part.toLowerCase()));
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
  return walkFiles(dirPath).filter((filePath) => hasSupportedExtension(filePath) && isCheckedFile(filePath));
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
    } else if (stat.isFile() && hasSupportedExtension(target)) {
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

function finding(filePath, lineNumber, label, pattern, line) {
  return {
    filePath,
    lineNumber,
    label,
    pattern,
    line: line.trim(),
  };
}

function scanFile(filePath) {
  const findings = [];
  const baseName = path.basename(filePath);

  if (staleFileNamePattern.test(baseName)) {
    findings.push(finding(filePath, 1, "stale legacy file", "legacy-mindmap|legacy-graph|legacy-route", baseName));
  }

  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of staleLinePatterns) {
      if (pattern.regex.test(line)) {
        findings.push(finding(filePath, index + 1, pattern.label, pattern.display, line));
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

  process.stdout.write("legacy-surface-retention-scan found stale replacement surfaces:\n");
  for (const item of findings) {
    process.stdout.write(
      `${formatPath(item.filePath)}:${item.lineNumber}: ${item.label} matched /${item.pattern}/: ${item.line}\n`
    );
  }
  process.exitCode = 1;
}

main();
