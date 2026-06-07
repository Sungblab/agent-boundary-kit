# Scanner Promotion Criteria

Agent Boundary Kit promotes a scanner only after fixture-backed evidence proves a narrow boundary failure.

The current promoted scanners are listed in `docs/scanner-coverage-matrix.md`.

## Required Evidence

A scanner candidate needs:

- fixture-backed boundary definition
- red evidence from a failing result
- green evidence from a passing result
- scanner validation note
- scanner application note
- read-only implementation
- explicit runner input contract
- check script wired into both benchmark gates

## Scanner Boundary

A scanner must be narrow.

It should check one observable failure pattern from one promoted fixture family. It must not become a broad style linter, security scanner, test framework, or hidden transcript analyzer.

## Implementation Rules

The scanner must:

- be read-only
- accept explicit file or repo paths
- reject missing input with exit 2
- report findings with exit 1
- report clear state with exit 0
- avoid private transcripts
- avoid broad user home scans
- avoid changing files, tests, config, or package metadata

## Promotion Steps

1. Confirm the fixture has red and green evidence.
2. Write scanner validation before implementation.
3. Define the exact finding condition.
4. Define explicit non-goals.
5. Add the scanner script.
6. Add the scanner check.
7. Wire the check into `npm run bench:check`.
8. Wire the check into `npm run bench:check:red`.
9. Add runner support only after scanner checks pass.
10. Update `docs/scanner-coverage-matrix.md`.

## Stop Conditions

Stop before scanner promotion when:

- only mechanical green smoke exists
- no red evidence exists
- no green evidence exists
- expected output is subjective
- the scanner would need hidden chat history
- the scanner would need broad repository inference
- the scanner would overlap another scanner without a clear boundary

Scanner promotion is a product decision, not only a script addition.
