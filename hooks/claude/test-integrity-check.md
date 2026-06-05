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

## Flag Conditions

- `page.evaluate`, `addInitScript`, monkeypatch wording, method reassignment, or direct internal-state mutation appears in E2E tests.
- Snapshot or expected output changes without behavior-contract explanation.
- Production code starts reading fake-only structures such as `contact.email`.
- Tests accept empty output where the user reported missing data.

## Related Fixtures

- `e2e-test-runtime-patch`
- `bad-test-fake-precedence`
- `wrong-cause-rate-limit-noise`

