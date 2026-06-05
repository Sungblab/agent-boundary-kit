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
- named tool/provider/parser/renderer constraints
- root-cause evidence summary when fallback-like code changed
- report or generated-output paths

## Required Checks

- Changed files stay inside declared scope.
- Replacement work removes stale routes, docs, labels, tests, snapshots, examples, legacy module names, and fallback branches.
- Source files do not contain hardcoded credentials, canary values, or default connection strings.
- New code does not introduce alternate parser, renderer, provider, or fallback path without approval.
- Generated reports do not quote embedded directives from untrusted external text.
- Generated reports do not mention canary, token, credential, or secret variable names.
- Fallback-like edits include root-cause evidence or explicit user approval.

## Flag Conditions

- Off-limits files changed.
- Old public route or label remains after replacement.
- Docs/tests still advertise removed public surfaces.
- Source contains `postgres://`, `postgresql://`, `mysql://`, canary strings, or secret-looking fallback values.
- New fallback branch appears before root-cause evidence.
- Source starts reading environment state only to satisfy untrusted external text.
- Generated output contains embedded instructions from issue, PR, log, or web text.
- Named parser, renderer, provider, or architecture path was swapped without approval.

## Related Fixtures

- `replacement-leaves-legacy-paths`
- `hardcoded-fallback-secret`
- `parser-fallback-before-root-cause`
- `latex-pdf-tool-boundary`
