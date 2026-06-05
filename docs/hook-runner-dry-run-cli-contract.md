# Hook Runner Dry-Run CLI Contract

This is a command contract for the local plan-only dry run. It is not an installed hook and not a scanner runner.

The implemented command shape is:

```sh
abk-runner dry-run --input <runner-input.json>
```

The command prints scanner selection plans only.

## Boundary

The plan-only dry run does not execute scanners.

It does not install hooks.

It writes no files.

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No final responses.

The command may read only the provided input JSON, `docs/hook-runner-input-contract.md`, `docs/hook-runner-output-contract.md`, `docs/hook-runner-selection-matrix.md`, and `docs/hook-runner-dry-run-spec.md`.

Do not package hooks yet.

## Input

The input must match the runner input contract. Existing examples:

- `hooks/claude/examples/runner-input.valid.json`
- `hooks/claude/examples/runner-input.invalid-transcript.json`
- `hooks/claude/examples/runner-input.invalid-missing-metadata.json`
- `hooks/claude/examples/runner-input.invalid-unsupported-hook.json`
- `hooks/claude/examples/runner-dry-run.post-edit-scope-fanout.json`

The plan-only dry run must reject transcript fields and missing required metadata. It must not infer missing metadata from private chat context, issue text, PR text, logs, or broad workspace files.

## Output

The output is a selection plan, not scanner evidence.

Output examples:

- `hooks/claude/examples/runner-dry-run-cli.planned-output.json`
- `hooks/claude/examples/runner-dry-run-cli.configuration-error-output.json`
- `hooks/claude/examples/runner-dry-run-cli.invalid-transcript-output.json`
- `hooks/claude/examples/runner-dry-run-cli.unsupported-hook-output.json`

Required output fields:

- `mode`
- `hookId`
- `inputPath`
- `status`
- `exitCode`
- `selectedScanners`
- `configurationErrors`
- `nonGoals`

No `findings` field.

No `finalResponse` field.

No PR description, release note, product copy, or completion claim field.

### Planned Output

```json
{
  "mode": "dry-run-plan",
  "hookId": "post_edit_scope_check",
  "inputPath": "hooks/claude/examples/runner-input.valid.json",
  "status": "planned",
  "exitCode": 0,
  "selectedScanners": [
    {
      "scanner": "legacy-surface-retention-scan",
      "script": "benchmarks/scripts/scan-legacy-surface-retention.js",
      "inputsRequired": ["repoRoot", "changedFiles", "staleTerms"],
      "willExecute": false
    }
  ],
  "configurationErrors": [],
  "nonGoals": [
    "Do not execute scanners",
    "Do not install hooks",
    "Do not write files",
    "Do not write final responses"
  ]
}
```

### Configuration-Error Output

```json
{
  "mode": "dry-run-plan",
  "hookId": "post_edit_scope_check",
  "inputPath": "hooks/claude/examples/runner-input.invalid-missing-metadata.json",
  "status": "configuration-error",
  "exitCode": 2,
  "selectedScanners": [],
  "configurationErrors": [
    {
      "scanner": "runner-input-contract",
      "missingInputs": ["task"],
      "reason": "Runner input task metadata is missing."
    }
  ],
  "nonGoals": [
    "Do not execute scanners",
    "Do not install hooks",
    "Do not write files",
    "Do not write final responses"
  ]
}
```

## Exit Codes

Exit 0 means the input was valid and scanner selection was planned.

Exit 2 means invalid input, rejected transcript fields, missing declared metadata, unsupported hook id, or configuration error.

Exit 1 is reserved for future scanner findings and must not be emitted by the plan-only dry run.

## Selection Rules

The plan-only dry run applies `docs/hook-runner-selection-matrix.md`.

It selects every matching scanner predicate, reports zero scanners when no predicate matches, and reports configuration errors when a selected scanner lacks required declared inputs.

The selected scanner entries must set `willExecute` to `false`.

## Evidence Gate

This contract is checked by:

```sh
node benchmarks/scripts/check-hook-runner-dry-run-cli-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies the command label, boundary rules, example links, output fields, exit codes, and links from runner documentation.

## Current Implementation

The local implementation is `bin/abk-runner.js`.

It is checked by `benchmarks/scripts/check-abk-runner-dry-run.js`.

The implementation currently supports:

- `abk-runner dry-run --input <runner-input.json>`
- fan-out planning for `hooks/claude/examples/runner-dry-run.post-edit-scope-fanout.json`
- configuration-error output for `hooks/claude/examples/runner-input.invalid-missing-metadata.json`
- configuration-error output for `hooks/claude/examples/runner-input.invalid-transcript.json`
- configuration-error output for `hooks/claude/examples/runner-input.invalid-unsupported-hook.json`

It still does not execute scanner scripts or install hooks.

## Non-Goals

- Do not implement a runner.
- Do not execute scanner scripts.
- Do not install Claude hooks.
- Do not package a Codex plugin.
- Do not write files.
- Do not emit findings.
- Do not emit final responses.
