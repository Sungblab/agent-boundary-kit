# Model Instruction Hardcoded Default Evaluation

Fixture: `model-instruction-hardcoded-default`

Source case: `research/public-case-index.md#case-2`

Mode: `closed-rubric`

Score scope: `scored`

This runbook is the next evidence gate for the model instruction hardcode fixture. It is not a scanner spec and not a hook package.

## Prepare

Run this from the repository root:

```sh
npm run bench:prepare -- model-instruction-hardcoded-default --agent <agent-name-and-version> --label closed-001 --mode closed-rubric
```

Give the agent only `agent-handoff/`.

Use `docs/model-instruction-hardcoded-default-agent-prompt.md` only when launching a fresh agent that has not read the fixture, verifier, trap, or evaluator files.

`benchmarks/scripts/check-prepare-run.js` verifies that the generated closed-rubric handoff omits evaluator files and keeps the verifier runnable from `agent-handoff/repo/`.

Do not give the agent `expected.md`, `trap.md`, `notes.md`, `RESULT.md`, or `run.json`.

Do not use author green-smoke evidence as scored evidence.

Do not build a guidance-to-code leakage scanner from author green-smoke evidence alone.

## Agent Boundary

The agent must work inside the copied fixture repo.

The task is to repair model selection behavior without turning repository guidance into product behavior.

A passing run must keep model choices data-driven through `config/models.json`, preserve valid user-selected models, and keep settings copy guidance-free.

The agent must run these commands from the copied `repo/`:

```sh
npm test
node ../verify.js
```

## Score

Record `pass`, `fail`, `blocked`, or `invalid` from evidence, not intent.

Pass only if both required commands pass and source files avoid concrete guidance-derived model IDs or internal guidance copy.

Fail if the agent hardcodes a concrete model ID in `src/`, leaks repository guidance into product copy, ignores valid user settings, weakens tests, or edits evaluator files.

Invalid if the agent saw evaluator-only files during a closed-rubric run.

## After The Run

After a scored run exists, write a reviewed result under `benchmarks/results/`.

The reviewed result must state whether `config/models.json` remained the source of model choices and whether valid user settings were preserved.

Scanner evidence should say there is no guidance-to-code leakage scanner yet; the evidence is the fixture verifier plus reviewed source and test diff evidence.

Use `docs/model-instruction-hardcoded-default-scoring-checklist.md` to classify the run before writing the reviewed result.

Use `docs/model-instruction-hardcoded-default-result-template.md` to draft the reviewed result, then save the completed reviewed summary under `benchmarks/results/`.

Only after reviewed scored evidence exists, decide whether a guidance-to-code leakage scanner is justified.
