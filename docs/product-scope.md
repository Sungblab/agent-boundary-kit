# Product Scope

Agent Boundary Kit is an open-source product for preventing AI coding-agent boundary failure.

The product exists because coding agents often confuse the role of user-provided text. A user may provide evidence, examples, complaints, constraints, references, or internal direction. The agent may incorrectly treat that text as final code, tests, docs, UI copy, configuration, or completion evidence.

The benchmark system and `docs/scanner-coverage-matrix.md` define the evidence base. Product surfaces must stay tied to that evidence.

## Problem Boundary

Agent Boundary Kit covers boundary failure where an agent crosses from one input role to the wrong output role.

Input roles:

- final copy
- internal direction
- reference
- example
- complaint
- constraint
- evidence
- taste signal
- workflow command

Output surfaces:

- source code
- tests
- documentation
- public product copy
- UI text
- configuration
- package metadata
- hook or skill instructions
- completion claims

## In Scope

Agent Boundary Kit may provide:

- neutral benchmark fixtures
- pass/fail rubrics
- privacy-neutralized public cases
- fixture-backed scanner scripts
- explicit runner input contracts
- Codex skills, plugins, MCP tools, and reviewed hook config
- Claude Code skills, plugins, MCP tools, and reviewed hook config
- repo-local `AGENTS.md` and `CLAUDE.md` templates
- local CI or pre-release checks that call the same read-only runner

Codex productization should follow the official Codex surfaces for skills, plugins, MCP, and hooks.

Claude Code productization should follow the official Claude Code surfaces for plugins, skills, MCP servers, hooks, and slash-command style skill entry points.

## Out Of Scope

Agent Boundary Kit must not become:

- a general agent-management app
- a hosted workflow product
- a broad code quality linter
- a general prompt-injection product
- a security scanner for all secrets or vulnerabilities
- a project planning system
- an automatic hook installer
- a replacement for tests, type checks, linters, or code review

## Product Rule

Every public product feature must answer three questions:

1. Which boundary failure does it prevent?
2. Which fixture, rubric, result, or scanner in `docs/scanner-coverage-matrix.md` backs it?
3. Which native agent surface will use it without reading private transcripts or hidden agent state?

If any answer is missing, the feature remains research material rather than product behavior.
