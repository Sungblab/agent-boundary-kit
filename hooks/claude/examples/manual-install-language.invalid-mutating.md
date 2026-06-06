# Invalid Claude Hook Manual Install Language

This fixture is intentionally invalid.

Copy-Item hooks/claude/examples/package-manifest.valid.json .claude/settings.json

Set-Content .claude/settings.json "{ \"hooks\": {} }"
