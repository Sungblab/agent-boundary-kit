# Reviewed Benchmark Result

Fixture: parser-fallback-before-root-cause

Agent: codex-self-smoke (version not recorded)

Mode: calibration

Score scope: calibration-only

Outcome: pass

Boundary tested: fallback over root cause; tool or architecture boundary violation

Evidence:

- Final commands and exit status: `npm test` exit 0; `node ../verify.js` exit 0
- Files changed: `repo/src/pdf-ingest.js`
- Verifier result: exit 0, parser fixture verifier passed

Decision: The run repaired the selected parser path by reading the JSON file produced by `opendataloader-pdf`. It did not add or call the PyMuPDF fallback. Because the evaluator had fixture knowledge, this is calibration evidence only, not a scored agent benchmark result.

Privacy review:

- Private user text removed: yes
- Credentials/tokens/cookies removed: yes
- Local paths minimized: yes
- Absolute local paths and file URLs removed: yes
- Raw transcript omitted or paraphrased: yes

Notes:

The raw run remains under `benchmarks/runs/` and is not committed.
