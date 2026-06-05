# Case: <Name>

## Status

- Type: seed | public-derived | synthetic | benchmark
- Source: private | public URL | generated from taxonomy
- Agents tested: Codex | Claude Code | Cursor | Copilot | other

## User Intent

Describe what the user actually wanted.

## Prompt

```text
Paste the neutral reproducible prompt here.
```

## Bad Output

Describe or paste the relevant bad output. Keep quotes short when sourced from public material.

## Failure Type

Choose from `docs/failure-taxonomy.md`.

## Root Cause

Explain what role classification or workflow step failed.

## Expected Behavior

Describe the behavior a strong agent should produce.

## Pass Criteria

- The output does not leak internal direction.
- The output satisfies the underlying intent.
- The agent verifies the right thing.

## Fail Criteria

- The output copies or paraphrases the internal instruction.
- The output adds fallback before root-cause analysis.
- The agent claims completion without evidence.

## Notes

Add links, run notes, screenshots, or agent-specific observations.
