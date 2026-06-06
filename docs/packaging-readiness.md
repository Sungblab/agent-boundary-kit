# Packaging Readiness Contract

This contract defines when Agent Boundary Kit may move from fixture-backed docs and scanner execution into a small installable surface.

It is not an installed hook, not plugin packaging, not a connector, and not a dashboard plan.

## Boundary

Packaging may use only:

- fixture-backed rules from `docs/scanner-coverage-matrix.md`
- explicit runner input from `docs/hook-runner-read-only-execution-contract.md`
- read-only `abk-runner scan` results
- bounded templates and skill instructions

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No automatic inference of scope, named tools, final gates, stale terms, external evidence, command logs, test files, production files, or plan artifacts.

## Candidate Surfaces

`templates/AGENTS.boundary.md` and `templates/CLAUDE.boundary.md` are documentation surfaces. They are ready to keep as repo templates because they do not execute code.

`skills/boundary-check/SKILL.md` is the first Codex skill candidate. It may wrap the boundary checklist, scanner selection guidance, and explicit `abk-runner scan` examples. It must not run broad scans, install hooks, generate final responses, or read chat history.

The future Claude hook candidates remain specs:

- `hooks/claude/pre-write-boundary-check.md`
- `hooks/claude/post-edit-scope-check.md`
- `hooks/claude/test-integrity-check.md`
- `hooks/claude/completion-evidence-check.md`

Those Claude hook specs may inform a later hook package only after the hook runtime has a safe way to receive explicit runner input.

## Minimum Installable Slice

The first installable slice should be a small Codex skill update, not a hook package.

Allowed:

- reference the scanner coverage matrix
- ask the agent to classify user input roles before public text
- ask the agent to choose matching scanner ids from declared task metadata
- show exact `abk-runner scan --input <runner-input.json> --scanner <scanner-id>` command shapes
- require evidence from `benchmarks/scripts/check-abk-runner-scan.js` before any completion claim

Blocked until a separate fixture-backed gate exists:

- automatic hook installation
- background watchers
- broad repository scans without declared input
- final-response generation from scanner output
- plugin manifests
- connector setup
- dashboard or SaaS workflow

## Required Evidence

The packaging candidate must cite all scanner ids that can be executed through the runner:

- `parser-fallback-boundary-scan`
- `latex-renderer-boundary-scan`
- `legacy-surface-retention-scan`
- `phase-gate-plan-scan`
- `test-runtime-patch-scan`
- `completion-evidence-gate-scan`
- `noisy-log-root-cause-scan`
- `hardcoded-credential-fallback-scan`
- `test-fake-contract-scan`
- `untrusted-context-canary-scan`

Before any installable surface is claimed ready, run:

```sh
node benchmarks/scripts/check-packaging-readiness.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must prove:

- the candidate surface links to the scanner coverage matrix
- the candidate surface uses explicit runner input
- the candidate surface does not ask for raw private transcripts
- the candidate surface does not broaden scanner input paths
- the candidate surface does not treat scanner output as final copy

## Explicit Non-Goals

Do not build a dashboard.

Do not build a SaaS workflow.

Do not create a connector.

Do not install Claude hooks.

Do not package a Codex plugin.

Do not add a broad CLI beyond the existing runner command contracts.

Do not turn this repository into a project-management app.

## Next Gate

The next gate is a Codex skill packaging check that verifies `skills/boundary-check/SKILL.md` references this contract, `docs/scanner-coverage-matrix.md`, and `docs/hook-runner-read-only-execution-contract.md`.

Only after that check passes should the repo consider a narrow installable skill surface.

Claude hook packaging remains later than the Codex skill gate because hooks need an event-to-runner-input contract that does not read private transcripts.
