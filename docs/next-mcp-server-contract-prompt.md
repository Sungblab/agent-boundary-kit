# Next MCP Server Contract Prompt

Use this prompt to start the shared MCP server contract slice for Agent Boundary Kit.

The MCP server is the next native product layer because Codex and Claude Code both support MCP, and promoted scanner coverage is already recorded in `docs/scanner-coverage-matrix.md`.

The contract must preserve Agent Boundary Kit's core boundary failure model: agents must not confuse evidence, examples, complaints, constraints, references, internal direction, or workflow commands with final code, tests, docs, UI copy, configuration, or completion claims.

```text
You are working in the `agent-boundary-kit` repository.

Goal:
Define and test the shared MCP server contract for Agent Boundary Kit before implementing a server.

Required context:
- `AGENTS.md`
- `README.md`
- `docs/product-scope.md`
- `docs/open-source-productization-plan.md`
- `docs/contributing-boundary-failures.md`
- `docs/failure-intake-rubric.md`
- `docs/fixture-promotion-criteria.md`
- `docs/scanner-promotion-criteria.md`
- `docs/scanner-coverage-matrix.md`
- `docs/hook-runner-read-only-execution-contract.md`
- `lib/abk-runner-core.js`
- `bin/abk-runner.js`

Official surface constraints:
- Codex integration should align with official Codex plugin, skill, MCP, and hook surfaces.
- Claude Code integration should align with official Claude Code plugin, skill, MCP, and hook surfaces.
- The shared MCP server must stay useful for both Codex and Claude Code.

Required MCP tools:
- `list_scanners`
- `validate_runner_input`
- `dry_run`
- `scan`

Tool boundaries:
- `list_scanners` returns scanner ids, boundary descriptions, required input fields, and evidence docs.
- `validate_runner_input` validates explicit runner input without scanning.
- `dry_run` returns planned scanners and missing metadata.
- `scan` runs one explicit read-only scanner against declared paths only.

Hard boundaries:
- Do not implement SaaS workflow.
- Do not build a web reporting UI.
- Do not submit to a marketplace.
- Do not perform automatic hook installation.
- Do not read private transcripts, hidden agent state, or broad user home directories.
- Do not let scanner output become final user-facing copy.
- Do not broaden `abk-runner` path scope.

Phased work:
1. Add `docs/mcp-server-contract.md`.
2. Add MCP request and response fixtures for valid and rejected tool calls.
3. Add `benchmarks/scripts/check-mcp-server-contract.js`.
4. Run the new check and confirm it fails before contract docs are complete.
5. Fill the contract and fixtures until the check passes.
6. Do not implement the server until the contract is green.

Required verification:
- `node benchmarks/scripts/check-mcp-server-contract.js`
- `node benchmarks/scripts/check-open-source-productization-docs.js`
- `node benchmarks/scripts/check-public-surface-privacy.js`
- `npm run bench:check`
- `npm run bench:check:red`
- `git diff --check`

Completion criteria:
- The MCP contract is explicit enough for Codex and Claude Code plugin packaging to share one server.
- Tool inputs are bounded and read-only.
- Missing or overbroad input is rejected.
- Scanner coverage links back to `docs/scanner-coverage-matrix.md`.
- No hook installation, marketplace submission, hosted workflow, or web reporting UI is introduced.
```

Current status: the contract exists at `docs/mcp-server-contract.md`, fixtures live under `mcp/examples/`, and `benchmarks/scripts/check-mcp-server-contract.js` checks the contract. The next implementation session should implement the server against that contract instead of redefining it.
