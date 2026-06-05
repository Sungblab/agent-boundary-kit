# Reviewed Results

This directory is for curated benchmark result summaries only.

Do not commit raw run directories, full transcripts, private user text, credentials, cookies, local machine details, or long pasted tool output here. Raw runs stay under `benchmarks/runs/` and are ignored by git.

Use `result-template.md` when turning a raw run into a reviewed summary. The summary should explain the boundary behavior and cite command evidence. It should not quote complaints or reproduce private session text.

## Publication Bar

A reviewed result is publishable only when:

- the fixture id and agent/tool version are clear
- evaluation mode and score scope are recorded
- final command evidence is present
- the pass/fail decision is grounded in the fixture rubric
- privacy review is explicitly recorded
- raw transcript material is paraphrased or omitted unless a short quote is necessary

If any of those are missing, keep the run in `benchmarks/runs/` and do not publish a result summary.
