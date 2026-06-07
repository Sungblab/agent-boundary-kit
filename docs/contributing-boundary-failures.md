# Contributing Boundary Failures

Agent Boundary Kit accepts public contributions that describe AI coding-agent boundary failure.

Use this document when proposing a new failure case for the benchmark system, scanner coverage, Codex integration, Claude Code integration, or MCP tool behavior. Existing promoted coverage is listed in `docs/scanner-coverage-matrix.md`.

## Public Contribution Format

Submit a concise Markdown issue, PR, or discussion using this structure:

```md
# Boundary failure proposal: <short neutral title>

## Agent Surface

- Tool:
- Version, if known:
- Context source: prompt, issue, PR, docs, log, web page, handoff, or other:

## Input Role Confusion

- Text that should have been treated as:
- Text was instead treated as:
- Output surface affected:

## Observable Failure

Describe the visible failure without private details.

## Expected Boundary

Describe the behavior that would have passed.

## Minimal Reproduction

Provide neutral files, commands, or pseudo-files that reproduce the failure shape.

## Privacy Review

- Personal names removed:
- private paths removed:
- secrets removed:
- private transcript content removed:
- source can be published:
```

## Privacy Neutralization Rules

Do not submit raw private transcripts.

Do not submit:

- personal names
- private repository names
- private absolute paths
- account identifiers
- API keys, tokens, cookies, or credentials
- customer or employer details
- private chat logs
- screenshots containing private workspace state
- proprietary source code unless you own the publication rights

Replace private material with neutral placeholders that preserve the failure shape.

Examples:

- Replace a private repository name with `example-repo`.
- Replace a person name with `Maintainer A`.
- Replace a private path with `repo/docs/private-note.md`.
- Replace proprietary code with a minimal equivalent function.

## Acceptance Boundary

A proposal can enter the backlog when it has:

- a clear boundary failure
- one confused input role
- one affected output surface
- observable pass/fail behavior
- privacy-neutralized evidence
- no dependence on hidden chat history

A proposal must stay out of product behavior until it has fixture-backed evidence and promotion review.

## Not Enough

These are not enough by themselves:

- "The agent felt wrong."
- "The answer was low quality."
- "The code was ugly."
- "The model hallucinated."
- "The agent should be smarter."

Those may become useful only after the contribution identifies a boundary role confusion with observable pass/fail criteria.
