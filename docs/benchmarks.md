# Benchmark System

Agent Boundary Kit benchmarks test boundary behavior, not generic coding ability.

Each fixture starts as a small broken repo. The agent receives a neutral task prompt, edits the fixture repo, and must satisfy the verifier without taking the known shortcut.

## Fixture Contract

Each fixture should include:

- `prompt.md`: task prompt given to the agent
- `repo/`: minimal broken codebase or document surface
- `trap.md`: shortcut the agent should avoid
- `expected.md`: pass/fail rubric
- `verify.js`: observable verifier
- `notes.md`: source provenance and fixture design notes

The initial fixture state should fail. A passing run should fix the intended boundary while keeping the requested tool, scope, test contract, or evidence gate intact.

## Repository Checks

Run from the repository root:

```sh
npm run bench:check
npm run bench:check:red
```

- `bench:check` validates fixture structure, taxonomy coverage, public-surface privacy, public case references, result templates, scanner evidence, hook contracts, runner contracts, and script portability.
- `bench:check:red` runs the same checks and also confirms untouched fixtures still fail in their initial state.

These commands do not prove that an agent passed a fixture. They prove the benchmark corpus and enforcement docs are internally consistent.

## Preparing A Run

Use:

```sh
npm run bench:prepare -- <fixture-id> --agent <agent-name> --label <short-label> --mode <mode>
```

The command creates an isolated run directory under `benchmarks/runs/` with:

- `AGENT_BRIEF.md`
- `agent-handoff/`
- copied prompt and rubric files
- copied broken `repo/`
- `run.json`
- `RESULT.md`

For closed-rubric runs, give the agent only `agent-handoff/`. The rest of the run directory is evaluator-side context.

Use [docs/manual-evaluation-protocol.md](manual-evaluation-protocol.md) for scoring rules. Publish only reviewed result summaries, never raw run directories, unless privacy review is complete.

## Current Fixture Families

The current runnable fixtures cover:

- parser fallback before root-cause analysis
- LaTeX renderer boundary violations
- replacement work that leaves legacy public paths alive
- release completion before named gate evidence
- E2E tests that patch runtime behavior
- noisy-log misdiagnosis instead of data-path diagnosis
- hardcoded credential fallbacks
- repository guidance leaking into source defaults
- invalid test fakes overriding production contracts
- untrusted issue text treated as instruction
- overengineering collusion without phase gates
- approved-file scope violations
- research-only prompts that mutate files

See [benchmarks/README.md](../benchmarks/README.md) for fixture-level details.

## Scanner Coverage

Read-only scanners are intentionally narrow. They should flag a specific red fixture and stay quiet on reviewed green evidence or unrelated files.

Current scanner families include:

- test runtime patch detection
- fake/production contract mismatch detection
- parser fallback boundary detection
- LaTeX renderer boundary detection
- hardcoded credential fallback detection
- guidance-to-code leakage detection
- legacy surface retention detection
- completion evidence gate detection
- untrusted context canary detection
- noisy-log root-cause detection
- phase-gate plan detection

See [docs/scanner-coverage-matrix.md](scanner-coverage-matrix.md) for fixture-to-scanner promotion status.

## Publication Rules

Benchmark candidates should be neutral and reproducible.

- Do not publish personal complaints as benchmark text.
- Do not quote public complaints unless a short quote is needed for provenance.
- Do not include local paths, file URLs, credentials, tokens, or private run directories.
- Link source material and paraphrase the reported failure.
- Define pass/fail criteria that another evaluator can apply.

The privacy check is part of `bench:check`, but manual review is still required before publishing scored runs.
