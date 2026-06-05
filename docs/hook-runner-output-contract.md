# Hook Runner Output Contract

This is the output contract for the future hook runner described in `docs/hook-runner-minimal-plan.md`.

It is not an installed hook, not a runner implementation, and not plugin packaging. It only fixes the bounded result shape a runner may emit after read-only scanner execution.

## Files

- `hooks/claude/runner-output.schema.json`: JSON schema for bounded runner output.
- `hooks/claude/examples/runner-output.valid-finding.json`: valid blocked finding output.
- `hooks/claude/examples/runner-output.valid-clear.json`: valid clear output.
- `hooks/claude/examples/runner-output.invalid-final-copy.json`: invalid example showing that final response drafting is rejected.
- `hooks/claude/examples/runner-output.invalid-transcript.json`: invalid example showing that raw private transcript fields are rejected.

## Allowed Output

Runner output is limited to a bounded result:

- `hookId`: the hook candidate that requested scanner execution.
- `scanner`: the fixture-backed scanner id, or `runner-command-contract` for a pre-execution command configuration error.
- `status`: `clear`, `finding`, or `error`.
- `exitCode`: scanner-style exit code `0`, `1`, or `2`.
- `blocked`: whether a future hook should block or require override.
- `reason`: short reviewer-facing explanation.
- `inputsUsed`: declared inputs consumed by the scanner.
- `findings`: path, line, rule, and detail for each bounded finding.

This result is supporting evidence. It is not a replacement for tests, final gates, reviewer judgment, or completion evidence.

## Rejected Output

No raw private transcripts.

No final responses.

Runner output must reject fields that attempt to emit:

- raw conversation text
- hidden chat history
- final response drafts
- PR descriptions
- release notes
- product copy
- completion claims
- credential-like material

The runner must not turn scanner output into user-visible copy. Another agent or reviewer can read the bounded result and decide what to do.

## Exit Semantics

- `exitCode: 0` requires `status: "clear"`, `blocked: false`, and an empty `findings` array.
- `exitCode: 1` requires `status: "finding"`, `blocked: true`, and at least one finding.
- `exitCode: 2` requires `status: "error"` and `blocked: true`.

When the runner rejects an unsupported scanner id before scanner execution, it must use `scanner: "runner-command-contract"` instead of mapping the request to a supported scanner id.

## Validation

This contract is checked by:

```sh
node benchmarks/scripts/check-hook-runner-output-contract.js
npm run bench:check
npm run bench:check:red
```

The check validates the schema shape, verifies the valid examples, verifies that invalid examples fail for the intended reason, and confirms this contract is linked from the minimal runner plan and Claude hook README.

## Boundary

Do not package hooks yet.

Do not widen this contract to emit final responses, PR metadata, release notes, product copy, or private transcript content. If a hook package later needs richer output, add a bounded field with a red/green output example first.
