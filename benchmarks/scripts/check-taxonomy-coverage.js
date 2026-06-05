const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const taxonomyPath = path.join(root, "docs", "failure-taxonomy.md");
const manifestPath = path.join(root, "benchmarks", "fixture-manifest.json");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function taxonomyTypes() {
  const markdown = fs.readFileSync(taxonomyPath, "utf8");
  const matches = [...markdown.matchAll(/^## \d+\. (.+)$/gm)];
  return new Set(matches.map((match) => normalize(match[1])));
}

function manifestTypes() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const types = [];

  for (const fixture of manifest.fixtures) {
    for (const type of fixture.failureTypes || []) {
      types.push({ fixtureId: fixture.id, type: normalize(type) });
    }
  }

  return types;
}

function main() {
  assert(fs.existsSync(taxonomyPath), "docs/failure-taxonomy.md is missing");
  assert(fs.existsSync(manifestPath), "benchmarks/fixture-manifest.json is missing");

  const knownTypes = taxonomyTypes();
  assert(knownTypes.size > 0, "taxonomy must define numbered failure types");

  const usedTypes = manifestTypes();
  assert(usedTypes.length > 0, "fixture manifest must use failureTypes");

  for (const usedType of usedTypes) {
    assert(
      knownTypes.has(usedType.type),
      `${usedType.fixtureId}: unknown failure type "${usedType.type}"`
    );
  }

  console.log(`taxonomy coverage check passed (${knownTypes.size} taxonomy types)`);
}

main();
