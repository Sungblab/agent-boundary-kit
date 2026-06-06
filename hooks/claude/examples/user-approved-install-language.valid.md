# Valid Claude Hook User-Approved Manual Install Language

This is manual approval only.

Review `docs/claude-hook-settings-fragment-review.md` before using the settings candidate.

Review `hooks/claude/examples/settings-fragment-review.valid.json` as the source fixture.

Review `docs/claude-hook-wrapper-wiring-review.md` before relying on wrapper-to-entrypoint behavior.

Review `docs/claude-hook-wrapper-implementation.md` before naming the wrapper command.

The bounded command candidate is `abk-claude-hook-wrapper --carrier <user-owned-carrier-json>`.

Run the evidence gate `benchmarks/scripts/check-claude-hook-settings-fragment-review.js` before approving the language.

Run the evidence gate `benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js` before approving the wrapper handoff.

Official hook reference: `https://code.claude.com/docs/en/hooks`.

Official settings reference: `https://code.claude.com/docs/en/settings`.

A command hook receives JSON on stdin.

The agent must not edit the settings file for the user.

No raw private transcripts.

No automatic hook installation.

No repository mutation.
