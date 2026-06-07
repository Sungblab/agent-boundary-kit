# Open Source Productization Plan

This repo should become an open-source agent boundary product, not only a benchmark archive.

The benchmark fixtures and scanners are the evidence base. The product surfaces are native integrations for coding agents.

## Product Goal

Agent Boundary Kit should help developers prevent known AI coding-agent boundary failures inside the tools they already use:

- Codex
- Claude Code
- MCP-compatible agent clients
- local CI or pre-release checks

The product should remain local-first and evidence-backed. It should not become a dashboard, SaaS workflow, project-management app, or broad agent orchestration system.

## Official Surface Map

### Codex

Codex productization should use the official Codex extension points:

- Agent skill: package the boundary workflow as a reusable skill.
- Plugin: distribute the skill, lifecycle config, MCP server config, hooks, assets, and app metadata as an installable bundle when stable.
- MCP server: expose scanner selection, runner input validation, and read-only scan execution as tools.
- Hooks: run boundary checks at supported lifecycle points after the command surface is safe and reviewable.
- `AGENTS.md`: provide repo-local durable rules for teams that do not want a plugin yet.

The first Codex product surface should be a plugin candidate that bundles:

- `skills/boundary-check/SKILL.md`
- a local stdio MCP server wrapping `abk-runner`
- optional reviewed hook config that users can inspect before trusting
- documentation that explains which scanner evidence backs each check

### Claude Code

Claude Code productization should use the official Claude Code extension points:

- Plugin: distribute skills, agents, hooks, MCP servers, binaries, and settings as one versioned package.
- Skill: expose the boundary workflow as a namespaced plugin skill.
- MCP server: expose read-only ABK tools through stdio or HTTP.
- Hooks: connect Claude Code events to explicit ABK runner input after native payload mapping is verified.
- Slash-command prompt: provide a manual entry point for boundary review.
- `CLAUDE.md`: provide repo-local durable rules for teams that do not want a plugin yet.

The first Claude Code product surface should be a plugin candidate that bundles:

- a namespaced boundary review skill
- `bin/abk-claude-hook.js` and `bin/abk-claude-hook-wrapper.js`
- `.mcp.json` or inline plugin MCP config for ABK read-only tools
- reviewed hook specs only after the native event mapping and user-owned install boundary are complete

### MCP-Compatible Clients

The shared integration layer should be an ABK MCP server.

Required tools:

- `list_scanners`: return scanner ids, boundary descriptions, required input fields, and evidence docs.
- `validate_runner_input`: validate hook or manual runner input without scanning.
- `dry_run`: return planned scanners and missing metadata.
- `scan`: run one explicit read-only scanner against declared paths only.

The MCP server must not read chat transcripts, hidden agent state, broad home directories, or private examples.

## Packaging Order

1. Publish a documented CLI package with stable `abk-runner`, `abk-claude-hook`, and `abk-claude-hook-wrapper` commands.
2. Add an ABK MCP stdio server that wraps the existing runner without broadening input scope.
3. Create a Codex plugin candidate with the boundary skill and MCP server config.
4. Create a Claude Code plugin candidate with the boundary skill, MCP server config, and hook binaries.
5. Add reviewed manual install and trust-review docs for both agents.
6. Add marketplace/community submission docs only after local plugin validation passes.

## Readiness Gates

Before calling a surface usable by other people:

- The surface must map to an official extension point.
- The surface must cite the scanner coverage matrix.
- The surface must use explicit runner input.
- The surface must include local validation commands.
- The surface must avoid private transcript access.
- The surface must avoid automatic hook installation.
- The surface must keep scanner output separate from final user-facing copy.

Required repo gates:

```sh
npm run bench:check
npm run bench:check:red
```

## Next Implementation Slice

Build the shared MCP server contract first.

Reason:

- Codex and Claude Code both support MCP.
- A shared MCP server prevents duplicate scanner wrappers.
- Plugin packaging can then bundle the same server for each agent.
- It keeps product behavior tied to the existing runner evidence.

Scope:

- Add MCP server contract docs.
- Add JSON fixtures for valid and rejected MCP tool calls.
- Add contract checks for `list_scanners`, `validate_runner_input`, `dry_run`, and `scan`.
- Implement a local stdio MCP server only after the contract fails red.
- Keep all tools read-only.

Do not start with marketplace submission, dashboard UI, SaaS hosting, or automatic hook installation.
