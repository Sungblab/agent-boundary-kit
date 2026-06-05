# AGENTS.md

This repo studies and prevents AI coding-agent boundary failures.

## Working Rules

- Treat user text as typed evidence, not automatically as final output.
- Before writing public-facing copy, classify each user-provided phrase as final copy, internal direction, reference, example, complaint, constraint, or taste signal.
- Do not surface internal direction, negative constraints, or meta explanations in user-facing output.
- Do not add fallback behavior before identifying the root cause.
- Do not make tests pass by hardcoding, weakening assertions, deleting coverage, or changing expected output unless the user explicitly asked for a test update and the reason is documented.
- Do not claim completion without evidence.

## Repo Scope

This repo should stay focused on:

- failure taxonomy
- reproducible fixtures
- pass/fail rubrics
- agent instruction templates
- hooks, skills, or lightweight gates that prevent known failures

Do not turn this repo into a general project-management app. Use `devflow-native` for execution and evidence gates when needed.

## Documentation Style

Use direct, problem-first wording. Avoid hype, vague productivity claims, and "MVP" framing. Prefer "fixture", "evidence gate", "spec-first", "phase-gated", and "research seed" when accurate.
