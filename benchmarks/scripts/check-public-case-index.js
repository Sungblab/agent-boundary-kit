const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const publicCaseIndexPath = path.join(root, "research", "public-case-index.md");
const manifestPath = path.join(root, "benchmarks", "fixture-manifest.json");

const requiredFields = [
  "- Source URL:",
  "- Tool/agent:",
  "- Reported failure:",
  "- Likely failure type:",
  "- Neutral fixture prompt idea:",
  "- Pass/fail criteria:",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function caseSections(markdown) {
  const headingPattern = /^### (\d+)\. .+$/gm;
  const matches = [...markdown.matchAll(headingPattern)];

  return matches.map((match, index) => {
    const next = matches[index + 1];
    return {
      number: Number(match[1]),
      heading: match[0],
      body: markdown.slice(match.index, next ? next.index : markdown.length),
    };
  });
}

function publicSourceCaseRefs() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const refs = [];

  for (const fixture of manifest.fixtures) {
    if (!fixture.source.startsWith("research/public-case-index.md#")) {
      continue;
    }

    const fragment = fixture.source.split("#")[1];
    const single = fragment.match(/^case-(\d+)$/);
    if (single) {
      refs.push({ fixtureId: fixture.id, caseNumber: Number(single[1]) });
      continue;
    }

    const pair = fragment.match(/^cases-(\d+)-and-(\d+)$/);
    if (pair) {
      refs.push({ fixtureId: fixture.id, caseNumber: Number(pair[1]) });
      refs.push({ fixtureId: fixture.id, caseNumber: Number(pair[2]) });
      continue;
    }

    throw new Error(`${fixture.id}: unsupported public case source fragment: ${fragment}`);
  }

  return refs;
}

function main() {
  assert(fs.existsSync(publicCaseIndexPath), "research/public-case-index.md is missing");

  const markdown = fs.readFileSync(publicCaseIndexPath, "utf8");
  const sections = caseSections(markdown);
  assert(sections.length >= 15, `public case index has too few cases: ${sections.length}`);
  assert(sections.length <= 25, `public case index has too many cases: ${sections.length}`);

  const seenNumbers = new Set();
  const caseIds = new Set();

  for (const section of sections) {
    assert(!seenNumbers.has(section.number), `duplicate public case number: ${section.number}`);
    seenNumbers.add(section.number);

    const expectedCaseId = `case-${section.number}`;
    assert(
      section.body.includes(`- Case ID: ${expectedCaseId}`),
      `${section.heading}: missing stable Case ID ${expectedCaseId}`
    );
    caseIds.add(expectedCaseId);

    for (const field of requiredFields) {
      assert(section.body.includes(field), `${section.heading}: missing ${field}`);
    }
  }

  for (const ref of publicSourceCaseRefs()) {
    assert(
      caseIds.has(`case-${ref.caseNumber}`),
      `${ref.fixtureId}: manifest references missing public case ${ref.caseNumber}`
    );
  }

  console.log(`public case index check passed (${sections.length} cases)`);
}

main();
