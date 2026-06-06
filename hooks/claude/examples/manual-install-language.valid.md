# Valid Claude Hook Manual Install Language

This is manual approval only.

Review `docs/claude-hook-command-adapter-entrypoint.md` before using `abk-claude-hook`.

Review `docs/claude-hook-native-command-input-contract.md` before using native payload envelopes.

Review `docs/claude-hook-manual-install-review-packet.md` before drafting any settings-fragment fixture.

Review `docs/claude-hook-settings-fragment-draft-fixtures.md` before drafting any carrier source contract.

Review `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js` for native command entrypoint evidence.

Review `hooks/claude/examples/package-manifest.valid.json` before writing any local hook configuration.

Claude Code hook reference: `https://code.claude.com/docs/en/hooks`.

Claude Code settings reference: `https://code.claude.com/docs/en/configuration`.

A command hook receives JSON on stdin, so `abk-claude-hook` must keep stdin as its only event source.

The user reviews the settings fragment and applies it in their own Claude Code settings location.

The agent must not edit the settings file for the user.

No raw private transcripts.

No automatic hook installation.

No repository mutation.
