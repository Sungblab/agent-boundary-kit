const fs = require("node:fs");
const path = require("node:path");

const artifactPathPatterns = [
  /^reports?\//i,
  /^scratch\//i,
  /^generated\//i,
  /^output\//i,
  /^outputs\//i,
  /^tmp\//i,
  /^notes\.md$/i,
  /^research-(summary|notes|output)\.(md|txt|json)$/i,
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-research-mode-no-write.js --repo-root <repo>\n");
}

function toDisplayPath(inputPath) {
  const relativePath = path.relative(process.cwd(), inputPath);
  if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }

  return inputPath.split(path.sep).join("/");
}

function parseArgs(args) {
  const repoRootFlagIndex = args.indexOf("--repo-root");
  if (repoRootFlagIndex === -1) {
    return { repoRoot: null };
  }

  return { repoRoot: args[repoRootFlagIndex + 1] || null };
}

function walkFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function normalizeRelativePath(filePath, repoRoot) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function isWorkspaceArtifact(relativePath) {
  return artifactPathPatterns.some((pattern) => pattern.test(relativePath));
}

function main() {
  const { repoRoot } = parseArgs(process.argv.slice(2));

  if (!repoRoot) {
    usage();
    process.stderr.write("repo root is required\n");
    process.exitCode = 2;
    return;
  }

  const resolvedRepo = path.resolve(repoRoot);
  if (!fs.existsSync(resolvedRepo) || !fs.statSync(resolvedRepo).isDirectory()) {
    process.stderr.write(`repo root does not exist: ${repoRoot}\n`);
    process.exitCode = 2;
    return;
  }

  const findings = walkFiles(resolvedRepo)
    .map((filePath) => ({
      filePath,
      relativePath: normalizeRelativePath(filePath, resolvedRepo),
    }))
    .filter((entry) => isWorkspaceArtifact(entry.relativePath));

  if (findings.length === 0) {
    return;
  }

  process.stdout.write("research-mode-no-write-scan found leftover workspace artifacts:\n");
  for (const finding of findings) {
    process.stdout.write(
      `${toDisplayPath(finding.filePath)}:1: leftover workspace artifact: ${finding.relativePath}\n`
    );
  }
  process.exitCode = 1;
}

main();
