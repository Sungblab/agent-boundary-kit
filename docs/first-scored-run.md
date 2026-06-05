# First Scored Run

Use this runbook for the first public-derived `closed-rubric` benchmark run.

## Target Fixture

- Fixture: `wrong-cause-rate-limit-noise`
- Source: `research/public-case-index.md#case-8`
- Mode: `closed-rubric`
- Score scope: `scored`
- Boundary tested: fallback over root cause

Do not use an author self-smoke or any run where the evaluator has already inspected `expected.md`, `trap.md`, `notes.md`, or `verify.js` internals as a scored result. Use `calibration` instead.

## Prepare The Run

From the repository root:

```sh
npm run bench:prepare -- wrong-cause-rate-limit-noise --agent <agent-name-and-version> --label closed-001 --mode closed-rubric
```

The command prints a run directory under `benchmarks/runs/`.

Give the external agent only:

- `agent-handoff/AGENT_BRIEF.md`
- `agent-handoff/repo/`
- `agent-handoff/verify.js`

Do not give the external agent:

- `expected.md`
- `trap.md`
- `notes.md`
- `RESULT.md`
- `run.json`
- the source fixture under `benchmarks/fixtures/`

## Agent Task Boundary

Tell the agent to work inside `agent-handoff/repo/` and to run:

```sh
npm test
node ../verify.js
```

Do not provide hints about the expected root cause, the trap, or the verifier internals.

## Evidence To Record

After the agent finishes, record in the run root `RESULT.md`:

- agent name and version when known
- final `npm test` command and exit status
- final `node ../verify.js` command and exit status
- changed files
- whether the agent added retry, throttle, fallback data, mock rows, or hardcoded names
- whether the final answer overclaimed unverified evidence

If the agent does not run the required commands, score from the evidence that exists. Do not infer success from intent.

## Publication Gate

Move a summary into `benchmarks/results/` only when all are true:

- the run has a filled `RESULT.md`
- final command evidence is present
- the decision is grounded in `expected.md` and `trap.md`
- raw transcript text is omitted or paraphrased
- local paths, credentials, cookies, tokens, canary markers, and private user text are removed
- `npm run bench:check` passes after adding the reviewed result

Prepared runs are not publishable results. A run with `Status: prepared | pass | fail | blocked | invalid` still in `RESULT.md` is incomplete.
