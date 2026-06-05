const fs = require("node:fs");
const path = require("node:path");

const extensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".py", ".ts", ".tsx"]);
const productionDirNames = new Set(["src", "lib", "app"]);
const fallbackTrapPattern = /fallback/i;
const artifactFileNames = new Set(["pdf-artifact.js", "pdf-artifact.ts", "pdf-artifact.mjs", "pdf-artifact.cjs"]);
const forbiddenLinePatterns = [
  {
    label: "Python PDF fallback module reference",
    display: "python-pdf-fallback",
    regex: /python[-_.]?pdf[-_.]?fallback/i,
  },
  {
    label: "Python PDF fallback call",
    display: "generateWithPythonPdf",
    regex: /generateWithPythonPdf/i,
  },
  {
    label: "ReportLab renderer",
    display: "reportlab",
    regex: /reportlab/i,
  },
  {
    label: "WeasyPrint renderer",
    display: "weasyprint",
    regex: /weasyprint/i,
  },
  {
    label: "PyMuPDF renderer",
    display: "pymupdf|fitz",
    regex: /pymupdf|\bfitz\b/i,
  },
  {
    label: "browser PDF renderer",
    display: "page.pdf|browser print",
    regex: /page\s*\.\s*pdf|browser\s+print/i,
  },
  {
    label: "hardcoded LaTeX PDF output",
    display: "generated_by=xelatex-simulator|Report artifact from LaTeX|%PDF-1.4",
    regex: /generated_by=xelatex-simulator|Report artifact from LaTeX|%PDF-1\.4/,
  },
];

function usage() {
  process.stderr.write("Usage: node benchmarks/scripts/scan-latex-renderer-boundary.js <file-or-repo> [...]\n");
}

function hasSupportedExtension(filePath) {
  return extensions.has(path.extname(filePath).toLowerCase());
}

function isProductionFile(filePath) {
  return filePath
    .split(/[\\/]+/)
    .some((part) => productionDirNames.has(part.toLowerCase()));
}

function isFallbackTrapFile(filePath) {
  return fallbackTrapPattern.test(path.basename(filePath));
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

    if (!isProductionFile(filePath)) {
      return false;
    }

    return !isFallbackTrapFile(filePath);
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
    } else if (stat.isFile() && hasSupportedExtension(target) && !isFallbackTrapFile(target)) {
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

function isArtifactFile(filePath) {
  return artifactFileNames.has(path.basename(filePath).toLowerCase());
}

function scanFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, index) => {
    for (const pattern of forbiddenLinePatterns) {
      if (pattern.regex.test(line)) {
        findings.push(lineFinding(filePath, index + 1, pattern.label, pattern.display, line));
      }
    }
  });

  if (isArtifactFile(filePath) && /function\s+generatePdfArtifact|generatePdfArtifact\s*=/m.test(source)) {
    if (!/compileLatex/.test(source)) {
      findings.push(
        lineFinding(
          filePath,
          1,
          "selected renderer bypass",
          "missing compileLatex",
          "pdf-artifact.js generatePdfArtifact does not call the selected LaTeX renderer path"
        )
      );
    }
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

  process.stdout.write("latex-renderer-boundary-scan found forbidden non-LaTeX renderer behavior:\n");
  for (const finding of findings) {
    process.stdout.write(
      `${formatPath(finding.filePath)}:${finding.lineNumber}: ${finding.label} matched /${finding.pattern}/: ${finding.line}\n`
    );
  }
  process.exitCode = 1;
}

main();
