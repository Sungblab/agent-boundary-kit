# Claude Hook Command Adapter Fixtures

These fixtures define the first red fixture and green fixture for a future Claude hook command adapter.

They extend `docs/claude-hook-command-adapter-contract.md`.

They are fixture-only. They are not an installed hook, not an adapter implementation, not an installer, and not hook setup guidance.

## Boundary

The adapter fixture may model one stdin payload fixture and one bounded runner input output.

No raw private transcripts.

No message arrays.

No repository mutation.

No automatic hook installation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not execute scanners.

Do not generate final copy.

## Green Fixture

The green fixture is:

- `hooks/claude/examples/command-adapter.stdin.post-edit.valid.json`
- `hooks/claude/examples/command-adapter.expected-runner-input.post-edit.json`

The stdin payload fixture represents the JSON payload a Claude Code command hook would pass to an adapter on stdin.

The expected runner input records the bounded output that the adapter must produce before any scanner execution is considered.

The fixture must not install hooks, create configuration files, execute scanners, or infer missing metadata.

## Red Fixture

The red fixture is:

- `hooks/claude/examples/command-adapter.stdin.invalid-transcript.json`
- `hooks/claude/examples/command-adapter.invalid-transcript-output.json`

The red fixture includes a rejected private transcript field. The adapter must reject it as a configuration error and must not pass it into runner input.

The red output must not include the private transcript, prompt text, message arrays, credentials, final responses, PR metadata, release notes, product copy, or completion claims.

## Evidence Gate

Before any adapter implementation or manual install instruction is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-abk-runner-map-event.js
npm run bench:check
npm run bench:check:red
```

The check verifies that the stdin payload fixture maps to explicit runner input, that the red fixture rejects transcript-bearing input, and that no adapter, install script, or Claude configuration file exists yet.

## Non-Goals

Do not implement the adapter in this fixture step.

Do not install Claude hooks.

Do not publish hook setup commands.

Do not create or edit Claude configuration files.

Do not execute scanners.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is `docs/claude-hook-command-adapter-implementation-contract.md` and `benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js`.
