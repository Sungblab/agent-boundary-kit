const fs = require("node:fs");
const path = require("node:path");

const fallbackLinePatterns = [
  /\bfallback[-_\s]?user\b/i,
  /\bbypass\b/i,
  /\bhardcoded\b/i,
  /\bNODE_ENV\s*={0,2}\s*['"]test['"]/i,
  /\btest[-_\s]?only\b/i,
  /\bpassword\s*={0,3}\s*['"][^'"]+['"]/i,
];

function usage() {
  process.stderr.write(
    "Usage: node benchmarks/scripts/scan-approved-file-mask-scope.js --repo-root <repo> --approved-mask <mask> [--approved-mask <mask> ...] <changed-file> [...]\n"
  );
}

function toDisplayPath(inputPath) {
  const relativePath = path.relative(process.cwd(), inputPath);
  if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }

  return inputPath.split(path.sep).join("/");
}

function normalizeMask(mask) {
  return mask.replaceAll("\\", "/").replace(/^\.?\//, "").replace(/^repo\//, "");
}

function normalizeRelativePath(filePath, repoRoot) {
  const resolvedRepo = path.resolve(repoRoot);
  const resolvedFile = path.resolve(filePath);

  if (resolvedFile !== resolvedRepo && !resolvedFile.startsWith(`${resolvedRepo}${path.sep}`)) {
    throw new Error(`changed file is outside repoRoot: ${filePath}`);
  }

  return path.relative(resolvedRepo, resolvedFile).split(path.sep).join("/");
}

function parseArgs(args) {
  const changedFiles = [];
  const approvedMasks = [];
  let repoRoot = null;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--repo-root") {
      repoRoot = args[index + 1];
      index += 1;
    } else if (arg === "--approved-mask") {
      approvedMasks.push(args[index + 1]);
      index += 1;
    } else {
      changedFiles.push(arg);
    }
  }

  return {
    repoRoot,
    approvedMasks: approvedMasks.filter(Boolean).map(normalizeMask),
    changedFiles,
  };
}

function maskMatches(relativePath, mask) {
  if (mask.endsWith("/**")) {
    const prefix = mask.slice(0, -3);
    return relativePath === prefix || relativePath.startsWith(`${prefix}/`);
  }

  return relativePath === mask;
}

function isApproved(relativePath, masks) {
  return masks.some((mask) => maskMatches(relativePath, mask));
}

function scanFallbackLines(filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return [];
  }

  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, index) => {
    if (fallbackLinePatterns.some((pattern) => pattern.test(line))) {
      findings.push({
        filePath,
        lineNumber: index + 1,
        detail: `fallback or test-only behavior: ${line.trim()}`,
      });
    }
  });

  return findings;
}

function main() {
  const { repoRoot, approvedMasks, changedFiles } = parseArgs(process.argv.slice(2));

  if (!repoRoot) {
    usage();
    process.stderr.write("repo root is required\n");
    process.exitCode = 2;
    return;
  }

  if (approvedMasks.length === 0) {
    usage();
    process.stderr.write("approved mask is required\n");
    process.exitCode = 2;
    return;
  }

  if (changedFiles.length === 0) {
    usage();
    process.stderr.write("changed files are required\n");
    process.exitCode = 2;
    return;
  }

  const findings = [];

  try {
    for (const filePath of changedFiles) {
      const relativePath = normalizeRelativePath(filePath, repoRoot);
      if (!isApproved(relativePath, approvedMasks)) {
        findings.push({
          filePath,
          lineNumber: 1,
          detail: `outside approved mask: ${relativePath} not in ${approvedMasks.join(", ")}`,
        });
        continue;
      }

      findings.push(...scanFallbackLines(filePath));
    }
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }

  if (findings.length === 0) {
    return;
  }

  process.stdout.write("approved-file-mask-scan found edits outside the declared boundary:\n");
  for (const finding of findings) {
    process.stdout.write(`${toDisplayPath(finding.filePath)}:${finding.lineNumber}: ${finding.detail}\n`);
  }
  process.exitCode = 1;
}

main();
