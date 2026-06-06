# Reviewed Results

This directory is for curated benchmark result summaries only.

Do not commit raw run directories, full transcripts, private user text, credentials, cookies, local machine details, or long pasted tool output here. Raw runs stay under `benchmarks/runs/` and are ignored by git.

Use `result-template.md` when turning a raw run into a reviewed summary. The summary should explain the boundary behavior and cite command evidence. It should not quote complaints or reproduce private session text.

Reviewed result files are checked by `npm run bench:check`. With no reviewed results, the check should report `reviewed result check passed (0 results)`.

## Publication Bar

A reviewed result is publishable only when:

- the fixture id and agent/tool version are clear
- the fixture id exists in `benchmarks/fixture-manifest.json`
- evaluation mode and score scope are recorded
- `closed-rubric` and `open-rubric` use `Score scope: scored`
- `teaching` and `calibration` use `Score scope: calibration-only`
- final command evidence is present
- the pass/fail decision is grounded in the fixture rubric
- privacy review is explicitly recorded
- absolute local paths, file URLs, credential-like tokens, and canary markers are absent
- raw transcript material is paraphrased or omitted unless a short quote is necessary

For `approved-file-mask-scope`, historical reviewed results must state that only `repo/src/auth/login.js` changed and whether a scope-mask scanner existed at run time. Do not promote calibration-only evidence into a scored result.

If any of those are missing, keep the run in `benchmarks/runs/` and do not publish a result summary.
