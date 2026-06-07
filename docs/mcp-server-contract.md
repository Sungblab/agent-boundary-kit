# Agent Boundary Kit MCP Server Contract

This contract defines the shared MCP server surface for Agent Boundary Kit.

The server is the common native integration layer for Codex and Claude Code. It lets both agents use the same fixture-backed boundary checks without duplicating scanner wrappers inside separate plugins.

The server must preserve the boundary failure model described in `docs/product-scope.md` and the promoted scanner evidence in `docs/scanner-coverage-matrix.md`.

The runner execution boundary remains `docs/hook-runner-read-only-execution-contract.md`.

## Boundary

The MCP server may expose only read-only tools that operate on explicit runner input.

No private transcripts.

No hidden agent state.

No broad user home directories.

No automatic hook installation.

No marketplace submission.

No hosted workflow.

No file writes.

No inferred project-wide scanning.

The scanner output is evidence, not final copy. It must not be converted into user-facing prose, PR descriptions, release notes, product copy, or completion claims by the server.

## Native Agent Surfaces

Codex can consume this server through official MCP configuration, and a future Codex plugin can bundle the MCP server configuration alongside the boundary skill and reviewed lifecycle config.

Claude Code can consume this server through official MCP configuration, and a future Claude Code plugin can bundle the MCP server configuration alongside skills, hook binaries, and reviewed hook config.

Both surfaces must use the same tool names and response shapes.

## Tools

### `list_scanners`

Purpose: list promoted scanner ids and the evidence that backs them.

Input:

```json
{}
```

Output:

- `tool`: `list_scanners`
- `status`: `ok`
- `scanners`: array of scanner metadata

Each scanner entry must include:

- `id`
- `boundary`
- `requiredInputFields`
- `evidenceDoc`

This tool must not scan files.

### `validate_runner_input`

Purpose: validate explicit runner input before dry-run or scan.

Input:

- `runnerInput`: runner input object matching `docs/hook-runner-input-contract.md`

Output:

- `tool`: `validate_runner_input`
- `status`: `valid` or `rejected`
- `exitCode`: `0` for valid input, `2` for rejected input
- `willScan`: always `false`
- `errors`: bounded configuration errors

This tool must reject transcript-like, message-like, credential-like, or hidden-history fields.

### `dry_run`

Purpose: show which scanners would be selected from explicit runner input without executing any scanner.

Input:

- `runnerInput`: runner input object

Output:

- `tool`: `dry_run`
- `status`: `planned` or `configuration-error`
- `willExecute`: always `false`
- `selectedScanners`
- `missingInputs`

This tool must not execute scanners.

### `scan`

Purpose: run one selected read-only scanner against declared paths only.

Input:

- `runnerInput`: runner input object
- `scannerId`: one promoted scanner id from `docs/scanner-coverage-matrix.md`

Output:

- `tool`: `scan`
- `scanner`
- `status`: `clear`, `finding`, or `rejected`
- `exitCode`: `0`, `1`, or `2`
- `blocked`
- `findings`

This tool must execute at most one scanner per call.

It must reject overbroad paths, missing declared input, unsupported scanners, and scanner ids not selected by the declared runner input.

## Promoted Scanner Set

The MCP server must expose exactly the promoted scanner set in `docs/scanner-coverage-matrix.md`:

- `parser-fallback-boundary-scan`
- `latex-renderer-boundary-scan`
- `hardcoded-credential-fallback-scan`
- `guidance-to-code-leakage-scan`
- `legacy-surface-retention-scan`
- `approved-file-mask-scan`
- `research-mode-no-write-scan`
- `test-runtime-patch-scan`
- `test-fake-contract-scan`
- `completion-evidence-gate-scan`
- `untrusted-context-canary-scan`
- `noisy-log-root-cause-scan`
- `phase-gate-plan-scan`

## Fixture Examples

Contract fixtures live under `mcp/examples/`:

- `list-scanners.request.json`
- `list-scanners.response.json`
- `validate-runner-input.valid.request.json`
- `validate-runner-input.valid.response.json`
- `validate-runner-input.rejected-private-context.request.json`
- `validate-runner-input.rejected-private-context.response.json`
- `dry-run.valid.request.json`
- `dry-run.valid.response.json`
- `scan.valid.request.json`
- `scan.valid.response.json`
- `scan.rejected-overbroad-path.request.json`
- `scan.rejected-overbroad-path.response.json`

## Implementation Gate

Do not implement the MCP server until this command passes:

```sh
node benchmarks/scripts/check-mcp-server-contract.js
```

After implementation, the same contract must remain wired into:

```sh
npm run bench:check
npm run bench:check:red
```
