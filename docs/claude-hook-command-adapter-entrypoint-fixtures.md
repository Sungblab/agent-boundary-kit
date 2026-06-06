# Claude Hook Command Adapter Entrypoint Fixtures

These fixtures define expected adapter entrypoint behavior.

They extend `docs/claude-hook-command-adapter-implementation-contract.md`.

They are fixture-only. They are not an installed hook, not adapter code, not an installer, and not hook setup guidance.

## Boundary

The fixtures cover stdin parsing, temporary file cleanup, runner exit-code preservation, and private-context rejection.

No raw private transcripts.

No message arrays.

No repository mutation.

No automatic hook installation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not execute scanners in this fixture.

Do not generate final copy.

## Valid Entrypoint Fixture

Input stdin payload:

- `hooks/claude/examples/command-adapter.stdin.post-edit.valid.json`

Expected adapter output:

- `hooks/claude/examples/adapter-entrypoint.valid-plan-output.json`

The valid fixture proves:

- stdin is parsed as one hook event payload
- `map-event` preserves Exit 0
- `dry-run` preserves Exit 0
- selected scanners remain `willExecute: false`
- temporary hook-event and runner-input files are deleted before exit
- repository writes remain empty

## Rejected Entrypoint Fixture

Input stdin payload:

- `hooks/claude/examples/command-adapter.stdin.invalid-transcript.json`

Expected adapter output:

- `hooks/claude/examples/adapter-entrypoint.invalid-transcript-output.json`

The rejected fixture proves:

- transcript-bearing stdin is rejected
- the adapter stops after `map-event`
- the adapter preserves Exit 2
- scanner execution does not occur
- temporary files are deleted before exit
- private transcript text is not echoed in output

## Evidence Gate

Before any adapter entrypoint is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies the fixture output shape, cleanup trace, runner exit-code preservation, private-context rejection, and absence of hook install or setup files.

## Non-Goals

Do not install Claude hooks.

Do not publish hook setup commands.

Do not create or edit Claude configuration files.

Do not execute scanners.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is `docs/claude-hook-command-adapter-entrypoint.md` and `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js`.
