# Hook Runner Dry-Run Spec

This is a dry-run spec for the future hook runner described in `docs/hook-runner-minimal-plan.md`.

It is not an installed hook and not a runner implementation. It only shows how a declared runner input maps to selected read-only scanners and bounded runner output.

## Files

- `hooks/claude/examples/runner-dry-run.pre-write-boundary.json`: dry-run example for a planning task without a first phase gate.
- `hooks/claude/examples/runner-dry-run.post-edit-scope.json`: dry-run example for a replacement task with stale public surface terms.
- `hooks/claude/examples/runner-dry-run.test-integrity.json`: dry-run example for a test repair task with test-side runtime patching.
- `hooks/claude/examples/runner-dry-run.completion-evidence.json`: dry-run example for completion artifacts before final gate evidence.
- `docs/hook-runner-input-contract.md`: input shape for the dry-run input block.
- `docs/hook-runner-output-contract.md`: output shape for the dry-run expected output block.
- `docs/hook-scanner-contracts.md`: scanner input/output rules.
- `docs/scanner-coverage-matrix.md`: fixture-to-scanner source of truth.

## Dry-Run Boundary

No raw private transcripts.

No final responses.

The dry run must not:

- execute hooks
- package hooks
- infer hidden chat history
- read broad workspace context
- draft PR text, release notes, product copy, or completion claims

The dry run is a fixture for selection behavior. It is supporting evidence, not an automation surface.

## Example Mappings

The current dry-run examples cover one bounded selection path for each hook id.

| Dry-run example | Hook id | Expected scanner | Scanner script | Bounded inputs |
| --- | --- | --- | --- | --- |
| `hooks/claude/examples/runner-dry-run.pre-write-boundary.json` | `pre_write_boundary_check` | `phase-gate-plan-scan` | `benchmarks/scripts/scan-phase-gate-plan.js` | `task`, `metadataFiles` |
| `hooks/claude/examples/runner-dry-run.post-edit-scope.json` | `post_edit_scope_check` | `legacy-surface-retention-scan` | `benchmarks/scripts/scan-legacy-surface-retention.js` | `repoRoot`, `changedFiles`, `staleTerms` |
| `hooks/claude/examples/runner-dry-run.test-integrity.json` | `test_integrity_check` | `test-runtime-patch-scan` | `benchmarks/scripts/scan-test-runtime-patch.js` | `testFiles`, `productionFiles`, `behaviorContract` |
| `hooks/claude/examples/runner-dry-run.completion-evidence.json` | `completion_evidence_check` | `completion-evidence-gate-scan` | `benchmarks/scripts/scan-completion-evidence-gate.js` | `completionDraft`, `commandLog`, `finalGate` |

Each expected bounded output uses:

- `status: "finding"`
- `exitCode: 1`
- `blocked: true`
- one finding with path, line, rule, and detail

These examples intentionally do not select every scanner mapped to each hook. They prove one bounded selection path per hook id before runner implementation exists.

## Validation

This spec is checked by:

```sh
node benchmarks/scripts/check-hook-runner-dry-run-spec.js
npm run bench:check
npm run bench:check:red
```

The check verifies the dry-run document, the dry-run JSON example, selected scanner identity, bounded inputs, bounded output shape, and links from the runner plan and hook README.

## Packaging Boundary

Do not package hooks yet.

Do not implement a runner from these four dry-run examples. Add more dry-run examples for scanner fan-out, clear outputs, and configuration errors before executable packaging.
