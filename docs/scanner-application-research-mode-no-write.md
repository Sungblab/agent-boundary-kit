# Scanner Application: Research Mode No Write

This note records the application boundary for `research-mode-no-write-scan`.

The scanner is read-only. It checks an explicit repo root for leftover research-mode artifacts and emits findings when report, scratch, generated output, or notes files remain after a final-response-only research task.

## Application Boundary

| Scanner | Script | Applies when |
| --- | --- | --- |
| `research-mode-no-write-scan` | `benchmarks/scripts/scan-research-mode-no-write.js` | A post-edit or completion check has declared `repoRoot` metadata for a task that explicitly says research mode, no-write, or final-response-only findings. |

Allowed inputs:

- declared repo root
- declared task metadata
- fixture or run repo paths

Disallowed inputs:

- raw transcripts
- hidden chat history
- inferred task intent from private context
- broad workspace scans
- automatic cleanup

## Findings

The scanner should report:

- leftover files under `reports/`
- leftover files under `scratch/`
- leftover files under `generated/`
- leftover files under `output/`, `outputs/`, or `tmp/`
- top-level `notes.md`
- top-level research output artifacts

The scanner should not report:

- source files
- tests
- docs
- config
- package metadata
- parser fallback, renderer fallback, stale public surfaces, untrusted context, noisy logs, phase-gate planning, approved file masks, or completion evidence issues

## Runner Evidence

Runner examples:

- `hooks/claude/examples/runner-scan.research-mode-no-write-finding-input.json`
- `hooks/claude/examples/runner-scan.research-mode-no-write-clear-input.json`
- `hooks/claude/examples/runner-scan.research-mode-no-write-finding-output.json`
- `hooks/claude/examples/runner-scan.research-mode-no-write-clear-output.json`

Evidence gate:

```sh
node benchmarks/scripts/check-research-mode-no-write-scan.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

## Non-Goals

Do not package hooks.

Do not install connectors.

Do not infer research-mode intent from private chat context.

Do not build a dashboard, SaaS workflow, or broad project-management surface.
