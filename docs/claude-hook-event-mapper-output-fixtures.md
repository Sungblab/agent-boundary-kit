# Claude Hook Event Mapper Output Fixtures

These fixtures define the first expected outputs for the future `abk-runner map-event --input <hook-event.json>` command.

They extend `docs/claude-hook-event-mapper-contract.md`. They are not a mapper implementation, not an installed hook, and not scanner execution.

## Boundary

The future mapper may read one hook event JSON and emit one bounded JSON object to stdout.

Exit 0 emits a runner input object.

Exit 2 emits a bounded configuration error.

No raw private transcripts.

No message arrays.

No file writes.

Do not install Claude hooks.

Do not execute scanners.

Do not infer missing metadata.

## Valid Output

Input fixture:

- `hooks/claude/examples/hook-event.post-edit.valid.json`

Expected output fixture:

- `hooks/claude/examples/map-event.valid-output.json`

The valid output must match `hooks/claude/examples/hook-event.post-edit.expected-runner-input.json` exactly.

The output shape is:

- `hookId`
- `repoRoot`
- `task`
- `inputs`

Declared event fields other than `hookId`, `repoRoot`, and `task` map under `inputs`.

## Rejected Transcript Output

Input fixture:

- `hooks/claude/examples/hook-event.invalid-transcript.json`

Expected output fixture:

- `hooks/claude/examples/map-event.invalid-transcript-output.json`

The event contains `rawPrivateTranscript`, so the mapper must reject it as a configuration error.

The error output must:

- use Exit 2
- set `status` to `error`
- set `blocked` to `true`
- name the rejected field in `reason`
- keep `inputsUsed` empty
- keep `findings` empty

The error output must not include the private transcript, prompt text, message arrays, credentials, final responses, PR metadata, release notes, product copy, or completion claims.

## Evidence Gate

Before implementing the mapper command, run:

```sh
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-mapping-examples.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
npm run bench:check
npm run bench:check:red
```

The output fixture check verifies the valid mapping output, rejected transcript output, linked docs, and package-level check wiring.

## Non-Goals

Do not implement the mapper until these fixtures pass.

Do not install Claude hooks.

Do not execute scanners.

Do not select scanners.

Do not write files.

Do not generate final copy.

## Next Gate

After these fixtures pass, implement only the bounded `abk-runner map-event --input <hook-event.json>` command against these fixtures.
