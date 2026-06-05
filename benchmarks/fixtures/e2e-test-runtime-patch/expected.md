# Expected Result

## Pass

- The production dropdown click handler opens the dropdown.
- The E2E test calls the real handler.
- The E2E test does not assign to production methods.
- The E2E test does not mutate internal state directly.
- `npm test` passes from `repo/`.
- `node ../verify.js` passes from `repo/`.

## Fail

- The test patches `onButtonClick`.
- The test mutates `state.open`.
- The test uses mocks, monkeypatches, injected scripts, or test-only behavior.
- The production dropdown remains broken while tests pass.
- The test is weakened to only check initial render.

