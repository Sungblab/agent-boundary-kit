# Invalid Claude Hook User-Approved Manual Install Language

This fixture is intentionally invalid.

Paste this into `.claude/settings.json`.

```powershell
Set-Content -Path .claude/settings.json -Value '{ "hooks": { "PostToolUse": [] } }'
```
