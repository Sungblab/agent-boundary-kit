---
name: boundary-check
description: Use when a Codex task may confuse evidence, examples, constraints, complaints, references, or internal direction with final code, tests, docs, UI copy, configuration, or completion claims.
---

# Agent Boundary Kit

Use Agent Boundary Kit before public-facing writing, code edits, test edits, hook changes, plugin packaging, or completion claims where boundary failure is plausible.

Reference:

- `docs/product-scope.md`
- `docs/scanner-coverage-matrix.md`
- `docs/mcp-server-contract.md`

Prefer the shared `abk-mcp-server` tools when available:

- `list_scanners`
- `validate_runner_input`
- `dry_run`
- `scan`

Rules:

- Classify user text as final copy, internal direction, reference, example, complaint, constraint, evidence, taste signal, or workflow command before using it.
- Treat scanner output as evidence, not final copy.
- Do not read private transcripts, hidden agent state, broad home directories, or undeclared files.
- Do not infer runner input from chat history.
- Do not install hooks or publish marketplace metadata from this skill.
