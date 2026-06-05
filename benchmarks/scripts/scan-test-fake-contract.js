const fs = require("node:fs");
const path = require("node:path");

const extensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const fakeNamePattern = /(^|[-_.])fake[-_.]?|fake[-_.]?|fakes?/i;
const productionDirNames = new Set(["src", "lib", "app"]);
const fakePatterns = [
  {
    label: "fake-only contact shape",
    display: "contact\\s*:",
    regex: /contact\s*:/,
  },
];
const productionPatterns = [
  {
    label: "production reads fake-only contact.email",
    display: "contact\\.email",
    regex: /contact\s*\.\s*email/,
  },
  {
    label: "production fallback email behavior",
    display: "email.*(fallback|default|placeholder|aliases)|(fallback|default|placeholder|aliases).*email",
    regex: /email.*(fallback|default|placeholder|aliases)|(fallback|default|placeholder|aliases).*email/i,
  },
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-test-fake-contract.js <file-or-repo> [...]\n");
}

function hasSupportedExtension(filePath) {
  return extensions.has(path.extname(filePath).toLowerCase());
}

function isFakeFile(filePath) {
  return fakeNamePattern.test(path.basename(filePath));
}

function isProductionFile(filePath) {
  return filePath
    .split(/[\\/]+/)
    .some((part) => productionDirNames.has(part.toLowerCase()));
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

    return isFakeFile(filePath) || isProductionFile(filePath);
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

function patternsForFile(filePath) {
  if (isFakeFile(filePath)) {
    return fakePatterns;
  }

  if (isProductionFile(filePath)) {
    return productionPatterns;
  }

  return productionPatterns;
}

function scanFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);
  const patterns = patternsForFile(filePath);
  const findings = [];

  lines.forEach((line, index) => {
    for (const pattern of patterns) {
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

  process.stdout.write("test-fake-contract-scan found fake/production contract mismatch:\n");
  for (const finding of findings) {
    process.stdout.write(
      `${formatPath(finding.filePath)}:${finding.lineNumber}: ${finding.label} matched /${finding.pattern}/: ${finding.line}\n`
    );
  }
  process.exitCode = 1;
}

main();
