# ABK Boundary Review

Review the current task for boundary failure before editing or claiming completion.

Use the Agent Boundary Kit MCP tools when available:

1. Call `list_scanners` to identify promoted scanner coverage.
2. Build explicit runner input from declared task metadata and file paths.
3. Call `validate_runner_input`.
4. Call `dry_run`.
5. Call `scan` only for one selected scanner when explicit input is complete.

Do not infer missing metadata from private chat history.

Do not convert scanner output into final copy.

Do not apply hook settings or marketplace submission steps.
