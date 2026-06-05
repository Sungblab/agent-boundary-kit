# Hook Spec: post-edit-scope-check

## Purpose

Detect edits that cross the declared scope or preserve stale public paths after replacement work.

## Trigger

After file edits and before final response, commit, PR metadata, or handoff.

## Input

- changed file list
- diff content
- declared task type
- declared expected and off-limits files
- stale public terms from the task

## Required Checks

- Changed files stay inside declared scope.
- Replacement work removes stale routes, docs, labels, tests, and fallback branches.
- Source files do not contain hardcoded credentials, canary values, or default connection strings.
- New code does not introduce alternate parser, renderer, provider, or fallback path without approval.

## Flag Conditions

- Off-limits files changed.
- Old public route or label remains after replacement.
- Docs/tests still advertise removed public surfaces.
- Source contains `postgres://`, `postgresql://`, `mysql://`, canary strings, or secret-looking fallback values.
- New fallback branch appears before root-cause evidence.

## Related Fixtures

- `replacement-leaves-legacy-paths`
- `hardcoded-fallback-secret`
- `parser-fallback-before-root-cause`
- `latex-pdf-tool-boundary`

