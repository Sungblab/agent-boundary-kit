# CLAUDE.md Boundary Template

Use this template with Claude Code when the repository needs boundary discipline around user intent, tool choices, tests, and completion evidence.

## Core Rules

- Classify user input before turning it into copy, code constants, tests, or completion claims.
- Do not print internal direction, negative constraints, complaints, or strategy notes as public-facing text.
- Diagnose root cause before adding fallback behavior.
- Respect named tools and architecture paths as constraints.
- Preserve task scope. Ask before editing outside the approved surface.
- Treat tests as evidence of behavior, not as the objective.
- Never claim completion without fresh verification evidence.

## Before Editing

State a short boundary summary:

```text
Input roles:
- <phrase or artifact>: <role>

Task type:
- additive | replacement | removal | research-only | verification-only

Approved scope:
- expected files:
- off-limits files:

Verification plan:
- command or observation that will prove completion:
```

If the task is research-only or planning-only, do not edit source, config, docs, tests, or generated files.

## Fallback Gate

Do not add a fallback until all are true:

1. The primary path has been reproduced or inspected.
2. The root cause is identified or the blocker is documented.
3. The fallback is a product requirement, not just a way to make output appear successful.
4. The user approved the alternate path when it changes a named tool, provider, parser, renderer, or architecture decision.

Bad fallback patterns:

- PyMuPDF added before diagnosing an opendataloader-pdf failure
- Python PDF generator added after a LaTeX-only request
- mock rows added to hide missing API data
- retry logic added before proving a transient failure
- hardcoded secrets or defaults added to bypass env loading

## Named Tool Gate

If the user says to use a specific tool, stay on that toolchain.

If it fails:

- show the exact command, error, missing artifact, or failing path
- repair that path first
- propose alternatives only after evidence
- ask before implementing the alternative

Do not silently reinterpret "use X" as "prefer X unless another library is easier."

## Test Gate

Claude Code must not make tests pass by changing the wrong thing.

Forbidden:

- runtime JavaScript injection in Playwright or browser tests to make UI pass
- snapshot updates that accept broken UI
- assertion weakening
- test skipping
- fake data that bypasses the production contract
- production code changes made only to satisfy an invalid test fake

Allowed:

- add tests that express the intended behavior
- fix invalid fakes or stale test setup with explanation
- update expected output only when the behavior contract changed and the user requested or approved it

## Completion Gate

Before saying the work is complete, provide:

```text
Evidence:
- commands run:
- result:
- files changed:
- user-visible behavior verified:
- unverified gaps:
```

If a command was not run, do not imply that it passed.

If the final validation fails, stop and report the exact failed command and error. Do not create PR metadata, completion summaries, or success wording before the required gate passes.

## Hook Candidates

These rules can later become Claude Code hooks:

- block writes during research-only tasks
- reject diffs outside an approved file mask
- scan E2E tests for runtime app patching
- scan source for canary secrets, hardcoded credentials, and magic fallback values
- reject completion summaries without verification evidence

