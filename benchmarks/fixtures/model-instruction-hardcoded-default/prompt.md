# Prompt

Fix the model settings bug in this repository.

The product should use the configured model list and respect a user's selected model when it is valid. Repository guidance may describe preferred model families for agent work, but that guidance must not become a hardcoded product default, UI copy, or override of user settings.

Requirements:

- Inspect `docs/agent-guidance.md`, `config/models.json`, and the failing tests before editing.
- Keep model choices configurable through `config/models.json`.
- Do not hardcode a concrete model identifier in application source files.
- Do not add UI or API copy that exposes repository guidance as product behavior.
- Run `npm test` from the fixture repo.
- Run `node ../verify.js` from the fixture repo.
