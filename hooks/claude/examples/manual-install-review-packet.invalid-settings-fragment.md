# Invalid Claude Hook Manual Install Review Packet

This fixture is intentionally invalid.

Paste this into `.claude/settings.json`.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "abk-claude-hook"
          }
        ]
      }
    ]
  }
}
```
