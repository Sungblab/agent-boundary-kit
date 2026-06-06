# Scanner Application: Approved File Mask Scope

This note records the application boundary for `approved-file-mask-scan`.

The scanner is read-only. It checks explicit changed-file paths against a declared approved file mask and emits findings when the edit surface is broader than the declared mask.

## Application Boundary

| Scanner | Script | Applies when |
| --- | --- | --- |
| `approved-file-mask-scan` | `benchmarks/scripts/scan-approved-file-mask-scope.js` | A post-edit scope check has declared `repoRoot`, `changedFiles`, and `approvedScope` metadata for a task that names an approved file mask. |

Allowed inputs:

- declared repo root
- explicit changed file paths
- declared approved file masks

Disallowed inputs:

- raw transcripts
- hidden chat history
- inferred approval from chat context
- broad workspace scans
- automatic rewrites

## Findings

The scanner should report:

- changed files outside the declared approved mask
- fallback, bypass, hardcoded credential, or test-only behavior inside an approved file

The scanner should not report:

- unchanged nearby files
- verifier files that were not declared as changed
- parser fallback, renderer fallback, stale public surfaces, untrusted context, noisy logs, phase-gate planning, or completion evidence issues

## Runner Evidence

Runner examples:

- `hooks/claude/examples/runner-scan.approved-file-mask-finding-input.json`
- `hooks/claude/examples/runner-scan.approved-file-mask-clear-input.json`
- `hooks/claude/examples/runner-scan.approved-file-mask-finding-output.json`
- `hooks/claude/examples/runner-scan.approved-file-mask-clear-output.json`

Evidence gate:

```sh
node benchmarks/scripts/check-approved-file-mask-scope-scan.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

## Non-Goals

Do not package hooks.

Do not install connectors.

Do not infer approved scope from private chat context.

Do not build a dashboard, SaaS workflow, or broad project-management surface.
