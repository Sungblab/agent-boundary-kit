# Claude Hook Command Adapter Implementation Contract

This is an implementation contract only for a future Claude hook command adapter.

It is not an installed hook, not an installer, and not hook setup guidance.

## Boundary

The future adapter may bridge Claude Code command hook stdin to the existing ABK runner chain.

It must read stdin only.

It may parse one JSON payload.

It must not read raw private transcripts, hidden chat history, prompt text, message arrays, broad workspace files, issue text, PR text, or logs to infer missing metadata.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No repository mutation.

No automatic hook installation.

Do not install Claude hooks yet.

Do not publish copy commands yet.

Do not create or edit Claude configuration files.

Do not add hook setup commands.

Do not generate final copy.

## Preconditions

The implementation contract depends on:

- `docs/claude-hook-command-adapter-contract.md`
- `docs/claude-hook-command-adapter-fixtures.md`
- `docs/claude-hook-command-adapter-entrypoint-fixtures.md`
- `docs/claude-hook-event-mapper-contract.md`
- `docs/claude-hook-event-mapper-output-fixtures.md`
- `docs/hook-runner-read-only-execution-contract.md`
- `hooks/claude/examples/command-adapter.stdin.post-edit.valid.json`
- `hooks/claude/examples/command-adapter.expected-runner-input.post-edit.json`
- `hooks/claude/examples/command-adapter.stdin.invalid-transcript.json`
- `hooks/claude/examples/command-adapter.invalid-transcript-output.json`

The adapter fixtures must stay green before any entrypoint is implemented.

## Allowed Entrypoint Shape

The future entrypoint may:

- read stdin only
- parse one JSON payload
- reject invalid JSON as a bounded configuration error
- reject transcript, prompt, message, credential, cookie, token, and password fields
- call the existing local runner chain
- preserve runner exit codes
- emit bounded runner output

It must not:

- install hooks
- create or edit Claude configuration files
- run background watchers
- infer missing metadata
- generate final responses, PR metadata, release notes, product copy, or completion claims
- execute scanner fan-out

## Temporary File Contract

Temporary files are allowed only for the runner bridge.

It must write temporary hook-event and runner-input files only under an explicit temporary directory.

It must delete temporary files before exit.

It must not write files in the repository, a Claude configuration directory, or an inferred workspace location.

It must not preserve stdin payloads, runner input files, scanner outputs, or rejected event payloads beyond the adapter process.

## Runner Chain

The only allowed runner chain is:

```sh
abk-runner map-event --input <hook-event.json>
abk-runner dry-run --input <runner-input.json>
abk-runner scan --input <runner-input.json> --scanner <scanner-id>
```

map-event must run before dry-run.

scan must not run when map-event fails.

scan must not run when dry-run fails.

The adapter must not execute scanners before `map-event` succeeds.

The adapter must not execute scanners that are not selected by `dry-run`.

## Evidence Gate

Before any adapter implementation is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-dry-run.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the implementation contract is documentation-only
- no adapter entrypoint exists yet
- no hook setup files exist
- no Claude configuration file is created in this repository
- adapter fixtures map valid stdin payloads to explicit runner input
- adapter entrypoint fixtures preserve runner exit codes and cleanup traces
- adapter fixtures reject transcript-bearing stdin payloads

## Non-Goals

Do not implement the adapter in this contract step.

Do not install Claude hooks yet.

Do not publish copy commands yet.

Do not add hook setup commands.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not add SaaS workflow.

Do not read raw private transcripts, hidden chat history, prompt text, or message arrays.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is `docs/claude-hook-command-adapter-entrypoint-fixtures.md` and `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js`.
