# Hook Runner Input Contract

This is the input contract for the future hook runner described in `docs/hook-runner-minimal-plan.md`.

It is not an installed hook, not a runner implementation, and not plugin packaging. It only fixes the JSON shape a runner may accept before any executable hook is built.

Future Claude hook event data must pass through `docs/claude-hook-event-input-contract.md` before it becomes runner input.

## Files

- `hooks/claude/runner-input.schema.json`: JSON schema for allowed runner input.
- `hooks/claude/examples/runner-input.valid.json`: valid example using explicit file or repo paths and declared metadata.
- `hooks/claude/examples/runner-input.invalid-transcript.json`: invalid example showing that raw private transcript fields are rejected.
- `hooks/claude/examples/runner-input.invalid-missing-metadata.json`: invalid example showing that task metadata is required.

## Allowed Input

Runner input is limited to:

- `hookId`: one of the known hook candidates.
- `repoRoot`: explicit repo root path.
- `task`: declared metadata for task type, declaration source, and short summary.
- `inputs`: explicit paths, stale terms, named tools, final gate paths, command log paths, and behavior-contract paths.

The valid example uses declared metadata and explicit file or repo paths. It does not include chat text, hidden state, or credentials.

## Rejected Input

No raw private transcripts.

No hidden chat history.

The runner input must reject fields that attempt to pass:

- raw conversation text
- hidden chat history
- message arrays
- undeclared local state
- credential-like material
- broad workspace context

Missing declared metadata is also invalid. A future runner must report configuration failure instead of guessing task type, scope, stale terms, named tools, or final gates from chat history.

## Validation

This contract is checked by:

```sh
node benchmarks/scripts/check-hook-runner-input-contract.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
npm run bench:check
npm run bench:check:red
```

The check validates the schema shape, verifies the valid example, verifies that invalid examples fail for the intended reason, and confirms this contract is linked from the minimal runner plan and Claude hook README.

## Boundary

Do not package hooks yet.

Do not widen this contract to accept private transcripts, hidden chat history, broad message logs, or inferred metadata. If a scanner needs more information, add a declared metadata field or explicit path, then add a red/green input example.
