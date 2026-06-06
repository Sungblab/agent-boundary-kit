# Claude Hook Event Input Contract

This contract defines how a future Claude hook event may be mapped into the runner input described in `docs/hook-runner-input-contract.md`.

It is not an installed hook, not hook packaging, and not a runner implementation.

## Boundary

Hook events may supply only explicit event metadata.

The event-to-runner-input mapper must preserve:

- `docs/hook-runner-input-contract.md`
- `docs/hook-runner-selection-matrix.md`
- `docs/hook-runner-read-only-execution-contract.md`
- `docs/hook-scanner-contracts.md`

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No prompt text.

No message arrays.

No inferred metadata.

If a required field is missing, the mapper must emit a configuration error instead of reading private chat context or guessing from broad files.

Do not package hooks yet.

## Allowed Event Fields

A future hook event may provide these fields only:

- `hookId`
- `repoRoot`
- `task`
- `changedFiles`
- `diffPath`
- `approvedScope`
- `offLimits`
- `namedTools`
- `staleTerms`
- `externalSources`
- `finalGate`
- `commandLog`
- `completionDraft`
- `metadataFiles`
- `testFiles`
- `productionFiles`
- `behaviorContract`

These fields are declarations. They are not proof that the work is correct.

## Event To Runner Input Mapping

The mapper must produce runner input with this shape:

```json
{
  "hookId": "post_edit_scope_check",
  "repoRoot": ".",
  "task": {
    "type": "replacement",
    "declaredBy": "agent",
    "summary": "declared task boundary"
  },
  "inputs": {
    "changedFiles": ["docs/example.md"],
    "staleTerms": ["old public label"]
  }
}
```

Mapping rules:

- `hookId`, `repoRoot`, and `task` map to top-level runner input fields.
- `changedFiles`, `diffPath`, `approvedScope`, `offLimits`, `namedTools`, `staleTerms`, `externalSources`, `finalGate`, `commandLog`, `completionDraft`, `metadataFiles`, `testFiles`, `productionFiles`, and `behaviorContract` map under runner `inputs`.
- `pre_write_boundary_check` may use `task`, `namedTools`, `approvedScope`, `offLimits`, and `metadataFiles`.
- `post_edit_scope_check` may use `repoRoot`, `changedFiles`, `diffPath`, `namedTools`, `staleTerms`, `externalSources`, and `commandLog`.
- `test_integrity_check` may use `repoRoot`, `testFiles`, `productionFiles`, `behaviorContract`, and `commandLog`.
- `completion_evidence_check` may use `repoRoot`, `completionDraft`, `commandLog`, `finalGate`, `externalSources`, and `metadataFiles`.

Hook specs covered by this contract:

- `hooks/claude/pre-write-boundary-check.md`
- `hooks/claude/post-edit-scope-check.md`
- `hooks/claude/test-integrity-check.md`
- `hooks/claude/completion-evidence-check.md`

The mapper must not select scanners directly. Scanner selection remains defined by `docs/hook-runner-selection-matrix.md`.

The mapper must not execute scanners. Read-only scanner execution remains defined by `docs/hook-runner-read-only-execution-contract.md`.

## Rejected Event Fields

The event must reject or ignore these fields:

- `rawPrivateTranscript`
- `hiddenChatHistory`
- `chatHistory`
- `conversation`
- `messages`
- `prompt`
- `assistantResponse`
- `secret`
- `cookie`
- `token`
- `password`

If any rejected field is present, the future mapper must return a configuration error. It must not silently pass the field through and must not sanitize it into runner input.

## Evidence Gate

This contract is checked by:

```sh
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-event-mapping-examples.js
node benchmarks/scripts/check-hook-runner-input-contract.js
node benchmarks/scripts/check-hook-runner-selection-matrix.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The check verifies the allowed event fields, rejected event fields, hook ids, hook specs, transcript boundary, and links from related hook runner docs.

## Non-Goals

Do not install Claude hooks.

Do not package hooks yet.

Do not execute scanners.

Do not implement an event mapper yet.

Do not read raw chat, prompts, hidden conversation state, or broad workspace files.

Do not infer missing scope, stale terms, named tools, final gates, test files, production files, command logs, external sources, or plan artifacts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims from hook event data.

## Next Gate

The fixture-like event mapping example set is recorded in `docs/claude-hook-event-mapping-examples.md` and checked by `benchmarks/scripts/check-claude-hook-event-mapping-examples.js`.

The future event mapper command contract is recorded in `docs/claude-hook-event-mapper-contract.md` and checked by `benchmarks/scripts/check-claude-hook-event-mapper-contract.js`.

Only after those contracts stay green should the repo consider implementing `abk-runner map-event --input <hook-event.json>`.
