# Agent Boundary Kit

Agent Boundary Kit is a research and tooling project for one recurring failure in AI coding agents:

> The agent treats context, complaints, examples, principles, or constraints as final output.

That mistake shows up as UI copy that repeats an internal brief, landing pages that explain the site instead of embodying it, fallback code that hides the real bug, tests that pass while the product stays broken, and completion claims without evidence.

This repo turns those failures into reproducible cases, pass/fail rules, and reusable agent instructions.

## What This Is

This is not a prompt collection.

It is a kit for:

- naming common AI coding-agent failure modes
- collecting public and private examples without turning them into personal complaints
- rewriting those examples as neutral reproducible fixtures
- testing multiple agents against the same fixture
- producing AGENTS.md, CLAUDE.md, skills, hooks, and evidence gates that prevent the failures

## Core Problem

AI agents often collapse different kinds of user input into one bucket: "things to implement."

But user input has roles:

- final output
- internal direction
- reference
- example
- complaint
- constraint
- evidence
- taste signal
- workflow command

When an agent fails to classify that role, it leaks internal context into the product.

## Initial Failure Taxonomy

| Failure type | Short description | Bad behavior |
| --- | --- | --- |
| Context-to-output leakage | Internal direction becomes visible output | A homepage says "this is a portfolio-like blog" because the user described that strategy |
| Reference mimicry | Agent copies reference words instead of extracting structure | A landing page copies the phrasing of example sites |
| Negative constraint leakage | "Do not make it AI-like" appears as visible copy | UI says "not AI-like" instead of becoming less AI-like |
| Fallback over root cause | Agent adds workaround before understanding the bug | Adds default values, retry branches, or mock data to pass |
| Test-passing over correctness | Agent optimizes for green tests instead of product behavior | Updates tests, snapshots, or hardcoded outputs |
| Evidence-free completion | Agent claims done without proof | Says fixed without running verification or showing the failure disappeared |

## First Artifacts

- `docs/failure-taxonomy.md`: working taxonomy for agent failures
- `cases/templates/case-template.md`: format for turning a complaint into a reusable fixture
- `cases/seed/`: starter cases based on observed patterns
- `research/public-case-sourcing.md`: plan for collecting public examples responsibly
- `docs/next-session-prompt.md`: handoff prompt for the next Codex or Claude session

## Intended Outputs

The first useful version should produce:

- an AGENTS.md template for Codex
- a CLAUDE.md template for Claude Code
- a small set of reproducible failure fixtures
- a rubric for pass/fail evaluation
- optional hooks or scripts that block evidence-free completion
- integration notes for devflow-native as the execution/evidence layer

## Relationship To devflow-native

`devflow-native` should remain the local execution and evidence engine.

Agent Boundary Kit should define the boundary rules, failure cases, and evaluation fixtures. Devflow can later enforce parts of those rules through finish gates, handoff prompts, and workflow evidence.

## Principle

The agent should not ask "what words did the user say?"

It should ask:

> What role did this input play, and what output would satisfy that role without leaking it?
