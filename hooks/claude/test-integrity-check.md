# Hook Spec: test-integrity-check

## Purpose

Detect tests that pass by changing the wrong thing.

## Trigger

After edits to tests, test utilities, fakes, snapshots, browser tests, or production code touched only because a test failed.

## Input

- test diffs
- production diffs
- failing test output when available
- declared behavior contract

## Required Checks

- E2E tests call shipped behavior rather than patching runtime behavior.
- Tests do not assign to app methods or internal state.
- Tests do not use runtime injection to make UI pass.
- Test fakes match the production contract.
- Production code does not accept impossible fake-only shapes.
- Assertions are not weakened, skipped, or deleted.
- Tests do not accept empty or placeholder output when the user reported missing data.
- Snapshot or expected-output changes include a behavior-contract reason.

## Flag Conditions

- `page.evaluate`, `addInitScript`, monkeypatch wording, method reassignment, or direct internal-state mutation appears in E2E tests.
- Snapshot or expected output changes without behavior-contract explanation.
- Production code starts reading fake-only structures such as `contact.email`.
- Tests accept empty output where the user reported missing data.
- Assertions are changed from exact behavior to broad length, stringification, existence-only, or not-equal checks.
- Tests introduce default rows, mock records, or fixture data that hide the missing real data path.

## Scanner Contract

Input contract:

- changed test files
- related production files when fake shape or empty-output behavior is in scope
- declared behavior contract

Matching scanners:

- `scan-test-runtime-patch.js`
- `scan-test-fake-contract.js`
- `scan-noisy-log-root-cause.js`

Output contract:

- Exit 0: no scanner finding for the provided test or production paths.
- Exit 1: runtime patching, fake/production contract mismatch, or empty-output wrong-cause behavior was found.
- Exit 2: the scanner input is missing or unsupported.

No raw private transcripts. The hook candidate should not infer the behavior contract from private chat; it must use declared task metadata or fixture context.

## Related Fixtures

- `e2e-test-runtime-patch`
- `bad-test-fake-precedence`
- `wrong-cause-rate-limit-noise`
