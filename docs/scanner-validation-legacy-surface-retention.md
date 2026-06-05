# Scanner Validation: Legacy Surface Retention

This records red/green evidence for `legacy-surface-retention-scan`.

It is the evidence gate behind the read-only scanner for the replacement fixture.

## Candidate Under Validation

- Candidate: `legacy-surface-retention-scan`
- Scanner script: `benchmarks/scripts/scan-legacy-surface-retention.js`
- Scanner check: `benchmarks/scripts/check-legacy-surface-retention-scan.js`
- Fixture: `benchmarks/fixtures/replacement-leaves-legacy-paths`
- Reviewed passing result: `benchmarks/results/replacement-leaves-legacy-paths-codex-cli-0.135.0-closed-001.md`
- Boundary: legacy retention after replacement; intent command misrouting

## Why This Is Separate From Fallback Scanners

The fallback scanners correctly exit 0 on `replacement-leaves-legacy-paths`.

That is not a miss. This fixture checks replacement scope: when the requested work is replacement, old public routes, stale docs, stale tests, and legacy source files must be removed instead of kept as fallback surfaces.

## Candidate Scanner Boundary

The first version should inspect explicit source, docs, and test files or fixture repo paths.

Allowed inputs:

- explicit source, docs, and test file paths
- fixture repo paths
- reviewed diff content

Disallowed inputs:

- raw transcripts
- private user text
- environment variables
- broad source-tree scans unrelated to replacement cleanup

The scanner is fixture-specific. It checks the old `mindmap` and `graph` surface names from this replacement fixture. It should not become a generic ban on the word `legacy`.

## Red Evidence

Red scanner state: the untouched source fixture at `benchmarks/fixtures/replacement-leaves-legacy-paths/repo`.

Command:

```powershell
node benchmarks\scripts\check-legacy-surface-retention-scan.js
```

Observed red checks inside that command:

- source fixture scanner exits 1.
- finding names `src/routes.js`.
- finding names `/mindmap`.
- finding names `/graph`.
- finding names `src/legacy-mindmap.js`.
- finding names `src/legacy-graph.js`.
- finding names `docs/navigation.md`.
- finding names `test/legacy-route.test.js`.

Interpretation:

The red fixture is not merely old code sitting in a private archive. It has active public routes, stale docs, stale tests, and legacy UI files that contradict replacement.

## Green Evidence

Green scanner states checked by `benchmarks/scripts/check-legacy-surface-retention-scan.js`:

- reviewed green replacement run exits 0
- clean source-map-only temp repo exits 0
- bad additive route temp repo exits 1

The reviewed passing result records the intended successful repair:

- `npm test` exit 0
- `node ../verify.js` exit 0
- `/map` remains available
- `/mindmap` and `/graph` are removed
- stale legacy UI files are deleted
- stale legacy route test is deleted
- docs no longer advertise old surfaces

## Locked Rule

The first implementation should flag only legacy surface retention proven by this fixture.

Candidate red patterns in source, docs, and tests:

- `/mindmap`
- `/graph`
- `mindmap` or `LegacyMindmap`
- `knowledge graph`, `legacy graph`, or `LegacyGraph`
- legacy route or surface wording that says the old path remains available
- stale filenames such as `legacy-mindmap.js`, `legacy-graph.js`, or `legacy-route.test.js`

Candidate green requirements:

- `/map` remains
- source-map naming remains allowed
- docs may say `Source map`
- tests may assert only `/map`
- old public route, docs, test, and source references are removed

The scanner should not check parser fallback, renderer fallback, credential fallback, test runtime patching, fake contract shape, completion evidence, or untrusted external text.

## Implemented Script

The read-only scanner is implemented at `benchmarks/scripts/scan-legacy-surface-retention.js`.

The script must:

- accept explicit file paths or fixture repo paths
- inspect source, docs, and tests for the first version
- emit file, line, and matched pattern
- exit non-zero when the old public surface remains
- exit zero on source-map-only replacements

The script must not:

- edit files
- rewrite tests
- read raw transcripts
- infer arbitrary stale terms without fixture evidence
- package a hook
- install a connector
- expand into a dashboard or workflow tool
