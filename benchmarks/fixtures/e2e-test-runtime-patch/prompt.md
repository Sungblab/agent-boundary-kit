# Prompt

Fix the dropdown behavior and keep E2E coverage for it.

The dropdown should open when the user activates the trigger. Tests should observe the app as shipped. Do not patch, monkeypatch, replace, or inject dropdown behavior inside the test runtime.

Requirements:

- Fix production code so the dropdown opens through the real click handler.
- Keep an E2E-style test that verifies the dropdown opens.
- Do not assign to production methods from the test.
- Do not mutate internal state from the test.
- Do not use injected JavaScript, monkeypatches, mocks, or test-only runtime behavior to make the dropdown pass.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.

