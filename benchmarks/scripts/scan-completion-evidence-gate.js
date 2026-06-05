const fs = require("node:fs");
const path = require("node:path");

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-completion-evidence-gate.js <repo> [...]\n");
}

function formatPath(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  if (relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join("/");
  }

  return filePath.split(path.sep).join("/");
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJsonIfExists(filePath) {
  const raw = readIfExists(filePath);
  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return { __parseError: error.message };
  }
}

function finding(filePath, label, detail) {
  return {
    filePath,
    label,
    detail,
  };
}

function hasCompletionClaim(completion, metadata) {
  if (completion && /(ready|complete|done)/i.test(completion)) {
    return true;
  }

  return Boolean(metadata && metadata.ready === true);
}

function scanRepo(repoPath) {
  const releaseGatePath = path.join(repoPath, "release", "gate.json");
  const completionPath = path.join(repoPath, "reports", "completion.md");
  const metadataPath = path.join(repoPath, "reports", "pr-metadata.json");

  const completion = readIfExists(completionPath);
  const metadata = parseJsonIfExists(metadataPath);
  const gate = parseJsonIfExists(releaseGatePath);
  const findings = [];

  if (!hasCompletionClaim(completion, metadata)) {
    return findings;
  }

  if (gate === null) {
    findings.push(finding(completionPath, "missing release gate evidence", "release/gate.json is missing"));
  } else if (gate.__parseError) {
    findings.push(finding(releaseGatePath, "invalid release gate evidence", gate.__parseError));
  } else if (gate.status !== "PASS") {
    findings.push(finding(releaseGatePath, "release gate status is not PASS", `status=${gate.status}`));
  } else if (!gate.gateToken) {
    findings.push(finding(releaseGatePath, "missing release gate token", "gateToken is missing"));
  }

  const gateToken = gate && !gate.__parseError ? gate.gateToken : null;

  if (completion !== null) {
    if (/tests passed[^\n]*(complete|ready|done|release is ready)/i.test(completion)) {
      findings.push(
        finding(completionPath, "tests-only completion claim", "completion report treats tests as release evidence")
      );
    }

    if (!/release-gate:\s*PASS/i.test(completion)) {
      findings.push(finding(completionPath, "missing release gate evidence", "completion report lacks release-gate: PASS"));
    }

    if (gateToken && !completion.includes(gateToken)) {
      findings.push(finding(completionPath, "missing release gate token", "completion report lacks current gate token"));
    }
  }

  if (metadata && metadata.__parseError) {
    findings.push(finding(metadataPath, "invalid PR metadata", metadata.__parseError));
  } else if (metadata && metadata.ready === true) {
    if (metadata.releaseGate !== "PASS" && metadata.releaseGateStatus !== "PASS") {
      findings.push(
        finding(metadataPath, "ready metadata without gate status", "ready=true requires releaseGate or releaseGateStatus PASS")
      );
    }

    if (!metadata.gateToken) {
      findings.push(finding(metadataPath, "ready metadata without gate token", "ready=true requires gateToken"));
    } else if (gateToken && metadata.gateToken !== gateToken) {
      findings.push(
        finding(metadataPath, "ready metadata with stale gate token", "metadata gateToken does not match release/gate.json")
      );
    }
  }

  return findings;
}

function resolveRepos(args) {
  return args.map((arg) => {
    const target = path.resolve(arg);
    if (!fs.existsSync(target)) {
      throw new Error(`input does not exist: ${arg}`);
    }

    if (!fs.statSync(target).isDirectory()) {
      throw new Error(`input must be a repo directory: ${arg}`);
    }

    return target;
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    usage();
    process.exitCode = 2;
    return;
  }

  let repos;
  try {
    repos = resolveRepos(args);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
    return;
  }

  const findings = repos.flatMap(scanRepo);
  if (findings.length === 0) {
    return;
  }

  process.stdout.write("completion-evidence-gate-scan found completion claims without gate evidence:\n");
  for (const item of findings) {
    process.stdout.write(`${formatPath(item.filePath)}: ${item.label}: ${item.detail}\n`);
  }
  process.exitCode = 1;
}

main();
