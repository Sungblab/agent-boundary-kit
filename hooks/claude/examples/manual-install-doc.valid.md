# Manual Review Fixture

This is a documentation fixture only.

Installation mode: manual-review-only.

Source manifest:

- `hooks/claude/examples/package-manifest.valid.json`

Review checklist:

- Confirm `docs/claude-hook-packaging-contract.md` is current.
- Confirm `docs/claude-hook-package-manifest-fixtures.md` is current.
- Confirm the manifest keeps `autoInstall` disabled.
- Confirm each hook command starts with `abk-runner map-event --input <hook-event.json>`.
- Confirm scanner execution is not described before map-event succeeds.
- Confirm scanner output is not described as final copy.

Stop conditions:

- No repository mutation.
- No raw private transcripts.
- No automatic hook installation.
- No final response generation.

This fixture does not provide copy commands, configuration edits, or hook setup commands.
