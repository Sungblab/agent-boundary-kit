# Case Study: Test-Passing Not Merge-Worthy

This case study records a research gap: a coding-agent patch can pass tests while still failing the issue contract, reviewer expectations, or maintainability boundary.

It is not a PR scoring system and not a claim that ABK can decide whether a maintainer should merge a change. The point is narrower: green commands are necessary evidence, but they are not sufficient evidence for completion.

## Source Case

- Research slice: `test-passing-not-merge-worthy`
- Research memo: `docs/web-research-agent-boundary-failures-2026.md#priority-4-test-passing-not-merge-worthy-case-study`
- External evidence: METR's SWE-bench review finding and the SWE-bench correctness study summarized in the web research memo
- ABK failure types: `test-passing over correctness`; `evidence-free completion`
- Related fixtures: `release-gate-before-completion`, `bad-test-fake-precedence`, `e2e-test-runtime-patch`, `overmocked-test-bypasses-contract`

The external reports are used as pattern evidence only. This case study does not copy benchmark instances or maintainer review text into the repo.

## Boundary

The agent may report that tests pass only as one piece of evidence.

Allowed completion evidence:

- the named verification command passed
- the patch still satisfies the original issue contract
- tests exercise the production behavior rather than a fake, mock, skipped path, or runtime patch
- changed files stay within the approved scope
- remaining reviewer risks are named instead of hidden behind a green command

Failing behavior:

- treat `npm test` or another green command as sufficient proof of correctness
- patch tests, fakes, fixtures, or runtime behavior so the command passes without preserving the product contract
- claim completion without explaining why the fix addresses the issue, not only the failing assertion
- add adjacent feature work or broad rewrites that a maintainer would reasonably reject

## Evidence Gap

ABK already has fixture-backed slices for parts of this problem:

| Slice | Evidence |
| --- | --- |
| Completion evidence | `release-gate-before-completion` requires named final gate evidence before completion claims. |
| Invalid test fake | `bad-test-fake-precedence` rejects production changes that accept impossible fake data. |
| Runtime test patch | `e2e-test-runtime-patch` rejects tests that patch shipped runtime behavior. |
| Over-mocked contract | `overmocked-test-bypasses-contract` models a test that passes while bypassing the real adapter contract. |

The missing research step is a reviewer-grade evaluator or fixture that checks a complete patch against the issue contract after tests pass.

That evaluator should not start as a scanner. It needs a small case with:

- an issue statement
- a plausible test-passing patch
- a maintainer-oriented rejection reason
- a reference fix or green path
- a pass/fail rubric that distinguishes command success from semantic correctness

## What ABK Adds

Without ABK, the failure can look complete because the agent can truthfully say the command passed.

ABK makes the missing boundary visible:

- tests passing proves only the named command
- a finish gate should name issue-contract evidence separately from command evidence
- test changes need integrity checks before they are accepted as proof
- reviewer risk belongs in the completion summary when it remains unresolved

The useful product claim is limited:

```text
ABK can flag when a completion claim relies on green tests without separate issue-contract and test-integrity evidence.
```

## Reproduce Current Gates

Run the fixture and scanner checks that already cover parts of this case:

```sh
node benchmarks/scripts/check-completion-evidence-gate-scan.js
node benchmarks/scripts/check-test-fake-contract-scan.js
node benchmarks/scripts/check-test-runtime-patch-scan.js
node benchmarks/scripts/check-fixtures.js --red
```

Run the full benchmark gates:

```sh
npm run bench:check
npm run bench:check:red
```

## Limits

This case study does not build a maintainer-review simulator, PR scoring product, leaderboard, or replacement for human code review.

It also does not prove that every test-passing agent patch is wrong. It records a narrower research target: tests can pass while the agent still lacks issue-contract, test-integrity, or reviewer-risk evidence.

The next useful improvement is one small fixture or reviewed result where a test-passing patch is rejected by a documented rubric, followed by a green path that satisfies both tests and issue-contract evidence.
