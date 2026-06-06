# Hook Runner Read-Only Execution Contract

This is the first scanner execution contract for the local runner. It is not an installed hook and not hook packaging.

The implemented command shape is:

```sh
abk-runner scan --input <runner-input.json> --scanner <scanner-id>
```

The supported scanner ids are `parser-fallback-boundary-scan`, `latex-renderer-boundary-scan`, `legacy-surface-retention-scan`, `test-runtime-patch-scan`, and `test-fake-contract-scan`.

## Boundary

The read-only execution command may execute exactly one selected scanner.

It may read only:

- the provided runner input JSON
- the scanner script selected by explicit `--scanner`
- the explicit file or repo paths declared in the runner input

It must not infer stale terms, named tools, scope, final gates, or evidence paths from private chat context.

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No file writes.

No hook installation.

No final responses.

Do not package hooks yet.

## Input

The input must match `docs/hook-runner-input-contract.md`.

The requested `--scanner` must already be selected by `docs/hook-runner-selection-matrix.md` for the declared input. If the scanner is not selected, the command must emit a bounded configuration error instead of guessing new inputs.

Execution examples:

- `hooks/claude/examples/runner-scan.legacy-surface-finding-input.json`
- `hooks/claude/examples/runner-scan.legacy-surface-clear-input.json`
- `hooks/claude/examples/runner-scan.parser-fallback-finding-input.json`
- `hooks/claude/examples/runner-scan.parser-fallback-clear-input.json`
- `hooks/claude/examples/runner-scan.latex-renderer-finding-input.json`
- `hooks/claude/examples/runner-scan.latex-renderer-clear-input.json`
- `hooks/claude/examples/runner-scan.test-runtime-finding-input.json`
- `hooks/claude/examples/runner-scan.test-runtime-clear-input.json`
- `hooks/claude/examples/runner-scan.test-fake-finding-input.json`
- `hooks/claude/examples/runner-scan.test-fake-clear-input.json`
- `hooks/claude/examples/runner-scan.unselected-scanner-input.json`
- `hooks/claude/examples/runner-scan.missing-changed-files-input.json`

## Output

The output must match `docs/hook-runner-output-contract.md`.

Output examples:

- `hooks/claude/examples/runner-scan.legacy-surface-finding-output.json`
- `hooks/claude/examples/runner-scan.legacy-surface-clear-output.json`
- `hooks/claude/examples/runner-scan.parser-fallback-finding-output.json`
- `hooks/claude/examples/runner-scan.parser-fallback-clear-output.json`
- `hooks/claude/examples/runner-scan.latex-renderer-finding-output.json`
- `hooks/claude/examples/runner-scan.latex-renderer-clear-output.json`
- `hooks/claude/examples/runner-scan.test-runtime-finding-output.json`
- `hooks/claude/examples/runner-scan.test-runtime-clear-output.json`
- `hooks/claude/examples/runner-scan.test-fake-finding-output.json`
- `hooks/claude/examples/runner-scan.test-fake-clear-output.json`
- `hooks/claude/examples/runner-scan.unsupported-scanner-output.json`
- `hooks/claude/examples/runner-scan.unselected-scanner-output.json`
- `hooks/claude/examples/runner-scan.missing-changed-files-output.json`

The command must not emit dry-run planning output.

The command must not emit final-response, PR-description, release-note, product-copy, completion-claim, transcript, credential, cookie, token, or password fields.

## Exit Codes

Exit 0 means the selected scanner executed and found no boundary finding.

Exit 1 means the selected scanner executed and found a boundary finding.

Exit 2 means invalid input, rejected transcript fields, unsupported hook id, unsupported scanner id, unselected scanner id, missing required declared inputs, or scanner invocation error.

## Current Implementation Scope

The current implementation may execute only `parser-fallback-boundary-scan`, `latex-renderer-boundary-scan`, `legacy-surface-retention-scan`, `test-runtime-patch-scan`, and `test-fake-contract-scan`.

For `parser-fallback-boundary-scan`, it must pass changed files from the declared `repoRoot` and `inputs.changedFiles` fields. `inputs.namedTools` is used to select the scanner, not to infer alternate parser files. If required declared fields are missing, it must return `exitCode: 2`.

For `latex-renderer-boundary-scan`, it must pass changed files from the declared `repoRoot` and `inputs.changedFiles` fields. `inputs.namedTools` is used to select the scanner, not to infer alternate renderer files. If required declared fields are missing, it must return `exitCode: 2`.

For `legacy-surface-retention-scan`, it must pass changed files from the declared `repoRoot` and `inputs.changedFiles` fields. If those fields are missing, it must return `exitCode: 2`.

For `test-runtime-patch-scan`, it must pass explicit test files from `inputs.testFiles`, resolved under the declared `repoRoot` when present. It must not scan production files, infer related tests, or fan out to `test-fake-contract-scan`.

For `test-fake-contract-scan`, it must pass explicit files from `inputs.testFiles` and `inputs.productionFiles`, resolved under the declared `repoRoot` when present. It must not infer fake files, scan broad directories, or fan out to `test-runtime-patch-scan`.

For pre-execution command errors, the output may use `runner-command-contract` as the bounded `scanner` value. It must not map an unknown scanner request to a supported scanner id.

It must keep `dry-run` plan-only behavior unchanged.

## Evidence Gate

This contract is checked by:

```sh
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The check verifies clear and finding outputs for the supported read-only scanners plus bounded configuration-error outputs.

## Non-Goals

- Do not execute multiple scanners.
- Do not execute scanner fan-out.
- Do not install Claude hooks.
- Do not package a Codex plugin.
- Do not write files.
- Do not infer missing metadata from chat history.
- Do not treat scanner output as a substitute for tests, final gates, or reviewer judgment.
