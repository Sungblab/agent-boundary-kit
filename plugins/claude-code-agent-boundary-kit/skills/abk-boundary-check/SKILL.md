---
name: abk-boundary-check
description: Use when a Claude Code task may confuse evidence, examples, constraints, complaints, references, or internal direction with final code, tests, docs, UI copy, configuration, or completion claims.
---

# Agent Boundary Kit

Use Agent Boundary Kit to prevent boundary failure in Claude Code workflows.

Reference:

- `docs/product-scope.md`
- `docs/scanner-coverage-matrix.md`
- `docs/mcp-server-contract.md`

Prefer `abk-mcp-server` for shared read-only checks:

- `list_scanners`
- `validate_runner_input`
- `dry_run`
- `scan`

Rules:

- Classify user text before writing code, tests, docs, UI copy, configuration, or completion claims.
- Keep scanner output as evidence, not final copy.
- Use explicit runner input only.
- Do not read private transcripts, hidden agent state, broad home directories, or undeclared files.
- Do not apply hook settings from this skill.
