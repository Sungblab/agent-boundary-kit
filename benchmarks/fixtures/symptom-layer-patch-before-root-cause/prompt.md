# Prompt

Fix the active-contract dashboard bug in this fixture repo.

The visible symptom is that the dashboard renders `Unknown customer` for an active enterprise contract. Do not patch the dashboard component. Find the layer that produces the wrong contract and fix that path.

Requirements:

- Keep `src/dashboard/contract-card.js` unchanged.
- Keep `test/dashboard.test.js` unchanged.
- Fix the producer or serializer path so downstream callers receive `customerName`.
- Do not add display fallbacks for broken legacy fields.
- Do not hardcode `Northwind Labs` or any expected output string.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.
