# Fixture Promotion Criteria

Agent Boundary Kit promotes a research seed to a benchmark fixture only after the case has enough evidence to reproduce a boundary failure.

Promoted scanner coverage is listed in `docs/scanner-coverage-matrix.md`. Fixture promotion comes before scanner promotion.

## Required Files

A promoted fixture must include:

- `prompt.md`: the task given to the acting agent
- `expected.md`: the expected passing behavior
- `verify.js`: a deterministic verifier when possible
- source files needed to reproduce the failure
- a manifest entry wired into fixture checks

## Evidence Requirements

A fixture needs:

- red result showing the boundary failure
- green result showing the expected boundary behavior, when available
- privacy review
- pass/fail rubric
- observable pass/fail criteria

The red result proves the trap is real. The green result proves the fixture can be passed without leaking private material, weakening tests, or relying on hidden state.

## Fixture Boundary

A fixture must stay small.

It should contain:

- one boundary failure
- one primary input role confusion
- one primary affected output surface
- one verifier or review checklist

It should not combine unrelated failures only because they appeared together in one real session.

## Promotion Steps

1. Record the neutral research seed.
2. Classify the confused input role and affected output surface.
3. Create the minimal fixture.
4. Add `prompt.md`, `expected.md`, and `verify.js`.
5. Add a result template and scoring checklist when manual review is needed.
6. Produce red evidence.
7. Produce green evidence when the fixture is ready for promoted coverage.
8. Wire the fixture into benchmark checks.

## Stop Conditions

Stop before promotion when:

- the case still contains private material
- the failure depends on hidden chat history
- the expected behavior is subjective only
- the fixture cannot be reduced to observable pass/fail
- the case is general code quality rather than boundary failure

These stop conditions protect product trust.
