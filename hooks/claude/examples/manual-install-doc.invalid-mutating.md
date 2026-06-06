# Invalid Manual Install Fixture

This fixture is intentionally invalid.

It attempts to mutate a local Claude configuration file:

```powershell
Copy-Item -Path hooks/claude/examples/package-manifest.valid.json -Destination .claude/settings.json
```

The checker must reject this pattern.
