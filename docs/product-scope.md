# Product Scope

Agent Boundary Kit is a research-first open-source project for preventing AI coding-agent boundary failure.

`docs/research-program.md` is the source of truth for what must be proven before a behavior becomes a product feature.

The product exists because coding agents often take shortcuts when a request is ambiguous, underspecified, or oddly phrased. They may treat evidence as instruction, constraints as final copy, passing tests as product truth, a fallback as root-cause repair, or a failed command log as enough evidence to claim completion.

ABK's job is to upgrade the agent harness with preflight and finish guards:

- before editing, identify which boundary can be crossed;
- during review, map the task to fixture-backed scanner evidence;
- before completion, block claims that lack declared verification evidence.

User-text role confusion is one important case, not the whole product.

The benchmark system and `docs/scanner-coverage-matrix.md` define the evidence base. Product surfaces must stay tied to that evidence. Plugin packaging is a distribution candidate, not the proof. The proof is the evidence ladder: failure taxonomy, reproducible fixture, pass/fail rubric, red evidence, green evidence, then scanner or evaluator promotion.

## Problem Boundary

Agent Boundary Kit covers boundary failure where an agent crosses from the user's intended work boundary into a shortcut output that looks plausible but is not the requested work.

Common boundary crossings:

- evidence or examples become final code, tests, docs, UI copy, configuration, or completion claims
- a named tool, parser, renderer, provider, or architecture path is bypassed by a fallback before root cause is identified
- tests, fixtures, or snapshots are weakened to satisfy the agent instead of the product contract
- a declared file mask or task scope is ignored because adjacent files are easier to edit
- an oversized request is accepted as one broad build instead of being phase-gated around a first proof point
- logs, issue text, web pages, or generated notes are treated as trusted instructions instead of untrusted evidence
- completion is claimed before the named gate, command, or reviewer evidence exists

Input roles still matter because many boundary failures start with role confusion:

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

## Devflow Boundary

Agent Boundary Kit and Devflow Native are adjacent, but they should not own the same layer.

Devflow Native owns repo-local workflow state:

- active work items
- sessions and handoffs
- configured project gates
- review and gate evidence records
- repeated-mistake promotion into durable repo rules

Agent Boundary Kit owns fixture-backed boundary checks:

- preflight risk classification for odd or mixed user requests
- scanner selection from explicit task metadata and paths
- read-only findings for known boundary failures
- finish-claim checks that treat missing evidence as a boundary failure

Use Devflow when the question is "what work is active, what evidence was recorded, and what should the next agent do?"

Use ABK when the question is "is the agent about to solve the wrong problem, mutate the wrong surface, fake the evidence, or claim completion too early?"

ABK may report that a finish claim needs gate evidence, but Devflow remains the system that records work-scoped gate and review evidence.

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
