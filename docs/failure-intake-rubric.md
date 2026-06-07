# Failure Intake Rubric

Agent Boundary Kit uses this rubric to decide whether a proposed case is a boundary failure, a research seed, or out of scope.

Existing promoted coverage is listed in `docs/scanner-coverage-matrix.md`.

## Intake Decision

Classify every proposal as one of:

- accepted as research seed
- needs neutralization
- needs smaller reproduction
- duplicate of existing coverage
- out of scope

## Required Evidence

The proposal must identify:

- agent surface
- input source
- confused input role
- affected output surface
- observable pass/fail behavior
- expected boundary behavior
- privacy status

## Boundary Failure Test

Ask:

1. Did the agent receive text with one intended role?
2. Did the agent treat that text as a different role?
3. Did that role confusion cause a visible output failure?
4. Can a reviewer reproduce or inspect the failure without private transcripts?

If the answer to any question is no, the case is not ready.

## Accepted As Research Seed

Use this decision when the failure is real and privacy-neutralized, but not yet fixture-backed.

The seed may be added to a backlog or public case index. It must not become a scanner, plugin behavior, hook behavior, or MCP tool result yet.

## Needs Neutralization

Use this decision when the failure shape is useful but the submission still contains private material.

The contributor must remove or replace private names, paths, screenshots, transcript excerpts, and proprietary source before review continues.

## Needs Smaller Reproduction

Use this decision when the case is plausible but too broad.

Request a minimal reproduction with:

- one prompt or task
- one trap
- one expected result
- one verifier or observable review step

## Duplicate

Use this decision when the case is already covered by a fixture or scanner.

Point to the matching entry in `docs/scanner-coverage-matrix.md` and record any new variant as an application note only when it adds useful context.

## Out Of Scope

Use this decision when the case is only general quality, broad security, broad planning, broad style preference, or normal software correctness without role confusion.

Out-of-scope cases can still be valuable for other tools. They are not Agent Boundary Kit product scope.
