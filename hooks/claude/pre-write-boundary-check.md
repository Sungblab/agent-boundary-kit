# Hook Spec: pre-write-boundary-check

## Purpose

Block edits before the agent has established the task boundary.

## Trigger

Before file writes, generated artifacts, shell commands that mutate files, commits, PR metadata, or deploy commands.

## Input

- user request
- active instruction files
- intended file edits
- task type if known
- named tool/provider/parser/renderer constraints if known

## Required Checks

- Input roles are classified: final copy, internal direction, reference/example, complaint, constraint, evidence, taste signal, workflow command.
- Task type is declared: additive, replacement, removal, research-only, verification-only.
- Named tools or architecture paths are listed.
- Off-limits fallbacks are listed.
- Expected files and off-limits files are declared.
- Verification command or observable proof is declared.

## Block Conditions

- The task is research-only, planning-only, or verification-only and the agent is about to write files.
- A named tool boundary exists but no primary-path diagnosis is planned.
- The agent is about to add fallback behavior without reproduction or root-cause evidence.
- Replacement work has no stale-surface cleanup plan.

## Related Fixtures

- `parser-fallback-before-root-cause`
- `latex-pdf-tool-boundary`
- `replacement-leaves-legacy-paths`
- `overengineering-collusion`
- `wrong-cause-rate-limit-noise`

