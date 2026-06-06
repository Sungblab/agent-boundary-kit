# Claude Hook Event Mapper Contract

This contract defines the first bounded executable mapper shape for future Claude hook events.

It is not an installed hook, not hook packaging, and not a scanner runner.

## Boundary

The mapper may transform one hook event JSON into one runner input JSON.

It may read only the provided hook event JSON. It must not read raw chat, prompts, hidden state, broad workspace files, or scanner inputs.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No broad workspace scraping.

No file writes.

Do not install Claude hooks.

Do not execute scanners.

Do not infer missing metadata.

## Command Shape

The implemented command shape is:

```sh
abk-runner map-event --input <hook-event.json>
```

The command emits runner input JSON to stdout.

It must not write files, install hooks, select scanners, execute scanners, or generate final copy.

## Input

Input must satisfy `docs/claude-hook-event-input-contract.md`.

Fixture-like examples are recorded in `docs/claude-hook-event-mapping-examples.md`:

- `hooks/claude/examples/hook-event.post-edit.valid.json`
- `hooks/claude/examples/hook-event.post-edit.expected-runner-input.json`
- `hooks/claude/examples/hook-event.invalid-transcript.json`
- `hooks/claude/examples/hook-event.invalid-missing-task.json`
- `hooks/claude/examples/hook-event.invalid-unknown-field.json`
- `hooks/claude/examples/hook-event.invalid-json.json`

Output fixtures are recorded in `docs/claude-hook-event-mapper-output-fixtures.md`:

- `hooks/claude/examples/map-event.valid-output.json`
- `hooks/claude/examples/map-event.invalid-transcript-output.json`
- `hooks/claude/examples/map-event.invalid-missing-task-output.json`
- `hooks/claude/examples/map-event.invalid-unknown-field-output.json`
- `hooks/claude/examples/map-event.invalid-json-output.json`

The input event may contain only explicit event metadata. Rejected transcript, prompt, message, credential, cookie, token, and password fields must produce a configuration error.

## Output

Exit 0 emits a runner input JSON object that satisfies `docs/hook-runner-input-contract.md`.

The output must contain only:

- `hookId`
- `repoRoot`
- `task`
- `inputs`

Declared event fields other than `hookId`, `repoRoot`, and `task` map under `inputs`.

The output must not contain final responses, PR metadata, release notes, product copy, completion claims, raw transcripts, prompts, messages, secrets, cookies, tokens, or passwords.

## Error Handling

Exit 2 emits a bounded configuration error when:

- the event contains a rejected field
- the event is missing `hookId`, `repoRoot`, or `task`
- the event contains unknown fields
- the event cannot be parsed as JSON

The mapper must not repair errors by reading private chat context or broad workspace files.

## Evidence Gate

To verify the mapper command, run:

```sh
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-event-mapping-examples.js
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-hook-runner-input-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies the command shape, input and output boundaries, error handling, non-goals, and links from related hook runner docs.

## Current Implementation

The local implementation is split between `bin/abk-runner.js` and `lib/abk-runner-core.js`.

It maps explicit hook event metadata into runner input and rejects transcript-bearing, missing-field, unknown-field, and invalid JSON events with bounded configuration-error output.

It is checked by `benchmarks/scripts/check-abk-runner-map-event.js`.

## Non-Goals

Do not install Claude hooks.

Do not package hooks yet.

Do not execute scanners.

Do not select scanners.

Do not write files.

Do not infer missing metadata.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The output fixture gate is `docs/claude-hook-event-mapper-output-fixtures.md` and `benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js`.

Only after the mapper command stays green should the repo consider a separate Claude hook packaging contract.
