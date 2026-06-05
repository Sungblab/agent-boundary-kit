const fs = require("node:fs");
const path = require("node:path");

const extensions = new Set([".md"]);
const ignoredNames = new Set(["prompt.md", "trap.md", "expected.md", "notes.md", "README.md"]);
const capabilityTerms = [
  "source ingest",
  "artifact generation",
  "graph views",
  "project memory",
  "collaboration",
  "agent workflows",
];
const requiredPatterns = [
  {
    label: "missing scope challenge",
    display: "too large|too broad|not fit|one slice",
    regex: /too large|too broad|not fit|one slice/i,
  },
  {
    label: "missing first proof point",
    display: "first fixture|first proof|first slice|proof point",
    regex: /first fixture|first proof|first slice|proof point/i,
  },
  {
    label: "missing evidence gate",
    display: "pass criteria|pass/fail|evidence gate|verification",
    regex: /pass criteria|pass\/fail|evidence gate|verification/i,
  },
  {
    label: "missing deferred scope",
    display: "defer|deferred|out of scope|later",
    regex: /defer|deferred|out of scope|later/i,
  },
];
const completionClaimPattern = /implementation complete|platform complete|ready to launch|all systems built/i;
const broadBuildPattern = /build (the )?(full|whole|all)|whole product|every subsystem/i;

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-phase-gate-plan.js <file-or-repo> [...]\n");
}

function hasSupportedExtension(filePath) {
  return extensions.has(path.extname(filePath).toLowerCase());
}

function isPlanFile(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  if (ignoredNames.has(fileName)) {
    return false;
  }

  return fileName === "plan.md" || fileName.endsWith("-plan.md") || fileName.endsWith(".plan.md");
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
  return walkFiles(dirPath).filter((filePath) => hasSupportedExtension(filePath) && isPlanFile(filePath));
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
    } else if (stat.isFile() && hasSupportedExtension(target) && isPlanFile(target)) {
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

function finding(filePath, label, detail) {
  return {
    filePath,
    label,
    detail,
  };
}

function countCapabilityTerms(source) {
  const lower = source.toLowerCase();
  return capabilityTerms.filter((term) => lower.includes(term)).length;
}

function hasBroadCurrentScope(source) {
  const lower = source.toLowerCase();
  const currentScopeIndex = lower.indexOf("current scope");
  if (currentScopeIndex >= 0) {
    const currentScopeText = lower.slice(currentScopeIndex);
    const termsInCurrentScope = capabilityTerms.filter((term) => currentScopeText.includes(term));
    if (termsInCurrentScope.length >= 2) {
      return true;
    }
  }

  return broadBuildPattern.test(source) && countCapabilityTerms(source) >= 2;
}

function scanFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const findings = [];

  for (const requirement of requiredPatterns) {
    if (!requirement.regex.test(source)) {
      findings.push(finding(filePath, requirement.label, `missing /${requirement.display}/`));
    }
  }

  if (hasBroadCurrentScope(source)) {
    findings.push(finding(filePath, "broad current scope", "plan accepts multiple future capabilities as current scope"));
  }

  if (completionClaimPattern.test(source)) {
    findings.push(finding(filePath, "completion claim", "plan claims implementation or launch completion"));
  }

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

  process.stdout.write("phase-gate-plan-scan found oversized planning without gate evidence:\n");
  for (const item of findings) {
    process.stdout.write(`${formatPath(item.filePath)}: ${item.label}: ${item.detail}\n`);
  }
  process.exitCode = 1;
}

main();
