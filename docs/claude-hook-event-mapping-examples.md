# Claude Hook Event Mapping Examples

These are fixture-like examples for `docs/claude-hook-event-input-contract.md`.

They are not installed hooks, not hook packaging, and not an event mapper implementation.

## Valid Event

`hooks/claude/examples/hook-event.post-edit.valid.json` shows a bounded `post_edit_scope_check` event. It includes explicit event metadata only:

- declared hook id
- explicit repo root
- declared task metadata
- declared changed files
- approved and off-limits scope
- named tools
- stale public terms
- external evidence paths
- metadata file paths

The expected runner input is `hooks/claude/examples/hook-event.post-edit.expected-runner-input.json`.

The mapping rule is mechanical: `hookId`, `repoRoot`, and `task` stay top-level; declared input fields move under `inputs`.

## Rejected Transcript Event

`hooks/claude/examples/hook-event.invalid-transcript.json` includes `rawPrivateTranscript`.

That event must produce a configuration error before runner input is created.

No raw private transcripts.

No hidden chat history.

No message arrays.

No prompt text.

Do not sanitize transcript fields into runner input.

## Evidence Gate

These examples are checked by:

```sh
node benchmarks/scripts/check-claude-hook-event-mapping-examples.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies that the valid event maps exactly to the expected runner input and that the transcript event is rejected.

## Non-Goals

Do not install Claude hooks.

Do not execute scanners.

Do not implement an event mapper yet.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims from hook event data.

## Next Gate

The future event mapper command contract is `docs/claude-hook-event-mapper-contract.md`. It must pass before implementing `abk-runner map-event --input <hook-event.json>`.
