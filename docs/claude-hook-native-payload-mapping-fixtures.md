# Claude Hook Native Payload Mapping Fixtures

These fixtures define the current native Claude Code command-hook payload mapping boundary.

They extend `docs/claude-hook-manual-install.md`, `docs/claude-hook-event-input-contract.md`, `docs/claude-hook-command-adapter-entrypoint.md`, and `docs/claude-hook-native-metadata-carrier-fixtures.md`.

They are fixture-only. They are not installed hooks, not installers, and not live settings fragments.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

The source evidence says command hooks receive JSON on stdin.

The source evidence records `PostToolUse input` with `tool_input`, `tool_response`, and common fields such as `session_id`, `transcript_path`, `cwd`, and `hook_event_name`.

## Boundary

Native Claude Code hook payload compatibility is not proven.

The current adapter expects ABK hook event fields.

Native payload alone is insufficient because ABK requires explicit `hookId`, `repoRoot`, and `task` metadata.

`tool_input` may identify a changed file.

Task metadata must remain explicit.

`transcript_path` must not be read.

`session_id` must not be passed through.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No inferred metadata.

Do not install Claude hooks.

Do not publish live settings fragments.

Do not create or edit Claude configuration files.

## Fixtures

Native payload fixture:

- `hooks/claude/examples/native-payload.post-tool-use.write.json`

Expected configuration-error output:

- `hooks/claude/examples/native-payload.post-tool-use.write.configuration-error-output.json`

Rejected transcript-read output:

- `hooks/claude/examples/native-payload.invalid-transcript-read-output.json`

The native payload fixture includes a `transcript_path` field because Claude Code common input includes that field. The expected output must not include or consume it.

The expected output may preserve a partial changed-file signal from `tool_input.file_path`, but it must block because required ABK metadata is missing.

## Evidence Gate

Before native payload mapping is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the native payload fixture includes `transcript_path`
- expected outputs do not include `transcript_path` or `session_id`
- native payload alone is blocked as configuration-error
- changed file extraction stays limited to `tool_input.file_path`
- no task metadata is inferred
- no live install fragment is published

## Non-Goals

Do not implement native payload mapping in this fixture step.

Do not install Claude hooks.

Do not publish live settings fragments.

Do not add installer code.

Do not add hook setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from native payload fixtures.

Do not read transcripts, prompt text, message arrays, issue bodies, PR text, logs, or broad workspace files to fill missing metadata.

## Next Gate

The next gate is `docs/claude-hook-native-metadata-carrier-fixtures.md`. That carrier must make `hookId`, `repoRoot`, and `task` explicit before `abk-claude-hook` can accept native payloads.
