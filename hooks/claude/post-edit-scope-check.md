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

## Scanner Contract

Input contract:

- changed file list
- repo path or explicit changed source/report paths
- declared stale terms for replacement work
- named tool, parser, renderer, provider, or architecture constraints
- report or generated-output paths when external text is involved

Matching scanners:

- `scan-parser-fallback-boundary.js`
- `scan-latex-renderer-boundary.js`
- `scan-hardcoded-credential-fallback.js`
- `scan-legacy-surface-retention.js`
- `scan-untrusted-context-canary.js`
- `scan-noisy-log-root-cause.js`

Output contract:

- Exit 0: no scanner finding for the provided changed paths or repo.
- Exit 1: stale surfaces, fallback activation, credential fallback, untrusted-context leakage, or noisy-log wrong-cause behavior was found.
- Exit 2: the scanner input is missing or unsupported.

No raw private transcripts. Scanner inputs must be file or repo paths plus declared metadata, not hidden chat history.

## Related Fixtures

- `replacement-leaves-legacy-paths`
- `hardcoded-fallback-secret`
- `parser-fallback-before-root-cause`
- `latex-pdf-tool-boundary`
