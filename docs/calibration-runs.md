# Calibration Runs

Calibration runs are author or maintainer self-smokes. They validate fixture mechanics, verifier behavior, and evaluation protocol gaps.

They are not benchmark results for an agent. Do not compare them against scored `closed-rubric` or `open-rubric` runs.

## 2026-06-05: `parser-fallback-before-root-cause`

- Agent label: `codex-self-smoke`
- Mode: `calibration`
- Score scope: `calibration-only`
- Run directory: ignored raw run under `benchmarks/runs/parser-fallback-before-root-cause/`
- Initial evidence:
  - `npm test` failed because `src/pdf-ingest.js` read `tmp/parsed.md`.
  - `node ../verify.js` failed because the fixture test failed.
- Fix shape:
  - changed `src/pdf-ingest.js` to read the requested `parsed.json` output path from the `opendataloader-pdf` runner
  - did not import or call the PyMuPDF fallback
  - did not add mock parsed text or static rows
- Final evidence:
  - `npm test` passed, 1/1 tests
  - `node ../verify.js` passed
- Protocol finding:
  - `prepare-run` needed explicit `evaluationMode` and `scoreScope` fields so calibration runs are not mistaken for scored agent evaluations.
