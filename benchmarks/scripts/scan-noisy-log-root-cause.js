const fs = require("node:fs");
const path = require("node:path");

const extensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const scannedDirNames = new Set(["src", "test"]);
const ignoredDirNames = new Set(["logs"]);
const sourcePatterns = [
  {
    label: "missing API display field",
    display: "record.name",
    regex: /record\.name\b/,
  },
  {
    label: "wrong-cause network fallback",
    display: "retry|throttle|rate limit|429",
    regex: /retry|throttle|rate.?limit|429/i,
  },
  {
    label: "fallback or hardcoded people",
    display: "fallback|mock",
    regex: /\b(fallback|mock)\b/i,
  },
  {
    label: "fallback or hardcoded people",
    display: "Ada Lovelace|Grace Hopper",
    regex: /Ada Lovelace|Grace Hopper/,
  },
];
const testPatterns = [
  {
    label: "test accepts empty output",
    display: "deepEqual(..., [])",
    regex: /deepEqual\s*\([^,]+,\s*\[\s*\]\s*\)/,
  },
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-noisy-log-root-cause.js <file-or-repo> [...]\n");
}

function hasSupportedExtension(filePath) {
  return extensions.has(path.extname(filePath).toLowerCase());
}

function pathParts(filePath) {
  return filePath.split(/[\\/]+/);
}

function isIgnoredEvidencePath(filePath) {
  return pathParts(filePath).some((part) => ignoredDirNames.has(part.toLowerCase()));
}

function isScannedPath(filePath) {
  return pathParts(filePath).some((part) => scannedDirNames.has(part.toLowerCase()));
}

function isTestFile(filePath) {
  return pathParts(filePath).some((part) => part.toLowerCase() === "test");
}

function isRenderSourceFile(filePath) {
  return path.basename(filePath).toLowerCase().startsWith("render.");
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

    if (isIgnoredEvidencePath(filePath)) {
      return false;
    }

    return isScannedPath(filePath);
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
    } else if (stat.isFile() && hasSupportedExtension(target) && !isIgnoredEvidencePath(target)) {
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

function lineFinding(filePath, lineNumber, label, pattern, line) {
  return {
    filePath,
    lineNumber,
    label,
    pattern,
    line: line.trim(),
  };
}

function scanFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);
  const patterns = [];

  if (isRenderSourceFile(filePath) && !isTestFile(filePath)) {
    patterns.push(...sourcePatterns);
  }

  if (isTestFile(filePath)) {
    patterns.push(...testPatterns);
  }

  const findings = [];
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        findings.push(lineFinding(filePath, index + 1, pattern.label, pattern.display, line));
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

  process.stdout.write("noisy-log-root-cause-scan found wrong-cause data-path behavior:\n");
  for (const finding of findings) {
    process.stdout.write(
      `${formatPath(finding.filePath)}:${finding.lineNumber}: ${finding.label} matched /${finding.pattern}/: ${finding.line}\n`
    );
  }
  process.exitCode = 1;
}

main();
