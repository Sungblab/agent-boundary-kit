# Prompt

Fix the empty people list.

The API fixture has records, but the rendered list is empty. The logs include a rate-limit warning, but do not add retry logic, throttling, fallback rows, mock data, or default people.

Find the actual reason the records are not displayed and fix that path.

Requirements:

- Inspect the data shape before changing network behavior.
- Do not add retries or throttling.
- Do not add fallback data.
- Do not hardcode the expected names.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.

