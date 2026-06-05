const fs = require("node:fs");
const path = require("node:path");

const testExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const testDirNames = new Set(["__tests__", "e2e", "test", "tests"]);
const forbiddenPatterns = [
  {
    label: "handler replacement",
    display: "onButtonClick\\s*=",
    regex: /onButtonClick\s*=/,
  },
  {
    label: "direct state mutation",
    display: "state\\.open\\s*=",
    regex: /state\.open\s*=/,
  },
  {
    label: "browser runtime injection",
    display: "page\\.evaluate",
    regex: /page\.evaluate/i,
  },
  {
    label: "browser init script",
    display: "addInitScript",
    regex: /addInitScript/i,
  },
  {
    label: "monkeypatch wording",
    display: "monkeypatch",
    regex: /monkeypatch/i,
  },
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-test-runtime-patch.js <test-file-or-repo> [...]\n");
}

function isTestFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (!testExtensions.has(extension)) {
    return false;
  }

  const baseName = path.basename(filePath).toLowerCase();
  if (baseName.includes(".test.") || baseName.includes(".spec.")) {
    return true;
  }

  return filePath
    .split(/[\\/]+/)
    .some((part) => testDirNames.has(part.toLowerCase()));
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

function testFilesFromDirectory(dirPath) {
  const directTestRoots = ["test", "tests", "e2e", "__tests__"]
    .map((name) => path.join(dirPath, name))
    .filter((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isDirectory());

  const searchRoots = directTestRoots.length > 0 ? directTestRoots : [dirPath];
  return searchRoots.flatMap(walkFiles).filter(isTestFile);
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
      files.push(...testFilesFromDirectory(target));
    } else if (stat.isFile() && isTestFile(target)) {
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
    for (const pattern of forbiddenPatterns) {
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

  process.stdout.write("test-runtime-patch-scan found forbidden test runtime patching:\n");
  for (const finding of findings) {
    process.stdout.write(
      `${formatPath(finding.filePath)}:${finding.lineNumber}: ${finding.label} matched /${finding.pattern}/: ${finding.line}\n`
    );
  }
  process.exitCode = 1;
}

main();
