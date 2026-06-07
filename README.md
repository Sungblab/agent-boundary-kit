# Agent Boundary Kit

[Korean README](README.ko.md)

Agent Boundary Kit is an open-source research and tooling repo for preventing one recurring AI coding-agent failure:

> The agent treats context, complaints, examples, principles, or constraints as final output.

That boundary failure shows up as copied internal brief text, negative constraints leaking into UI copy, fallback code added before diagnosis, tests changed only to pass, oversized plans accepted without phase gates, and completion claims without evidence.

This repo turns those failures into neutral fixtures, pass/fail rubrics, scanner checks, agent instruction templates, and native integration candidates for coding agents.

## Scope

This is not a prompt collection, a dashboard, or a general agent-management app.

It is a kit for:

- failure taxonomy
- reproducible benchmark fixtures
- pass/fail rubrics
- public and private case intake rules
- AGENTS.md and CLAUDE.md boundary templates
- lightweight gates for known failure patterns
- Codex and Claude Code integration surfaces backed by benchmark evidence

Private examples can be used as research seeds only after they are neutralized: remove personal details, preserve the failure shape, and define observable pass/fail criteria.

## Core Boundary

User input has roles:

- final copy
- internal direction
- reference
- example
- complaint
- constraint
- evidence
- taste signal
- workflow command

A passing agent classifies the role before writing public text, editing code, changing tests, or claiming completion.

## Failure Taxonomy

The current taxonomy covers:

- context-to-output leakage
- reference mimicry
- negative constraint leakage
- fallback over root cause
- test-passing over correctness
- evidence-free completion
- intent command misrouting
- tool or architecture boundary violation
- overengineering collusion
- untrusted context as instruction
- legacy retention after replacement

See [docs/failure-taxonomy.md](docs/failure-taxonomy.md).

## Benchmarks

Runnable fixtures live under [benchmarks/fixtures](benchmarks/fixtures). Each fixture is a small broken repo with a prompt, trap, expected result, verifier, and source notes.

Repository checks:

```sh
npm run bench:check
npm run bench:check:red
```

See [docs/benchmarks.md](docs/benchmarks.md) for the benchmark system, runner commands, scanner coverage, and publication rules.

## CLI And MCP

After installation, use the local commands directly or through `npx agent-boundary-kit`.

```sh
npx agent-boundary-kit --help
npx agent-boundary-kit scan --input runner-input.json --scanner legacy-surface-retention-scan
```

The package also exposes these binaries:

- `abk-runner`: maps explicit runner input to dry-run and read-only scanner execution.
- `abk-mcp-server`: exposes `list_scanners`, `validate_runner_input`, `dry_run`, and `scan` for Codex, Claude Code, and MCP-compatible clients.
- `abk-claude-hook`: maps explicit Claude hook event envelopes to runner input.
- `abk-claude-hook-wrapper`: wraps native Claude hook payloads with explicit ABK carrier metadata.

The MCP contract is [docs/mcp-server-contract.md](docs/mcp-server-contract.md). It keeps scanner output as evidence, not final copy.

## Native Plugin Candidates

The repository includes reviewable native integration candidates:

- Codex plugin candidate: [plugins/codex-agent-boundary-kit](plugins/codex-agent-boundary-kit)
- Claude Code plugin candidate: [plugins/claude-code-agent-boundary-kit](plugins/claude-code-agent-boundary-kit)

These candidates package the boundary skill and shared `abk-mcp-server` configuration. They are not marketplace submissions, and they do not apply user hook settings automatically.

## Npm Readiness

This repository is intended to reach publish-ready package state before an actual npm release.

Run:

```sh
npm run bench:check
npm run bench:check:red
npm run pack:dry-run
```

Do not run `npm publish` until package contents, docs, and integration candidates have been reviewed from the dry-run output.

## Main Artifacts

- [research/public-case-index.md](research/public-case-index.md): public case candidates converted into benchmark ideas
- [docs/benchmark-backlog.md](docs/benchmark-backlog.md): first fixture queue and evidence gates
- [benchmarks/README.md](benchmarks/README.md): runnable fixture layout and commands
- [templates/AGENTS.boundary.md](templates/AGENTS.boundary.md): Codex-style repo instruction template
- [templates/CLAUDE.boundary.md](templates/CLAUDE.boundary.md): Claude Code instruction template and hook candidates
- [skills/boundary-check/SKILL.md](skills/boundary-check/SKILL.md): draft Codex skill
- [hooks/claude](hooks/claude): fixture-grounded Claude hook specs
- [docs/hook-runner-minimal-plan.md](docs/hook-runner-minimal-plan.md): minimal runner boundary before hook packaging
- [docs/product-scope.md](docs/product-scope.md): product boundary for contribution-ready agent integrations
- [docs/contributing-boundary-failures.md](docs/contributing-boundary-failures.md): public contribution format for new boundary failures
- [docs/failure-intake-rubric.md](docs/failure-intake-rubric.md): intake decisions for proposed cases
- [docs/fixture-promotion-criteria.md](docs/fixture-promotion-criteria.md): criteria for promoting research seeds to fixtures
- [docs/scanner-promotion-criteria.md](docs/scanner-promotion-criteria.md): criteria for promoting fixture-backed scanners
- [docs/open-source-productization-plan.md](docs/open-source-productization-plan.md): official-surface productization plan for Codex, Claude Code, and MCP-compatible clients
- [docs/next-mcp-server-contract-prompt.md](docs/next-mcp-server-contract-prompt.md): next implementation prompt for the shared MCP server contract
- [docs/mcp-server-contract.md](docs/mcp-server-contract.md): shared MCP server contract for Codex and Claude Code native product surfaces

## Current Status

The repo is moving from research seed to open-source productization. It already contains runnable fixtures, scanner-backed checks, public case candidates, boundary templates, manual packaging contracts, and local runner commands.

The product target is not a dashboard or SaaS workflow. It is native agent integration: Codex skill/plugin/MCP/hook surfaces, Claude Code plugin/skill/MCP/hook surfaces, and a shared read-only MCP server contract backed by the existing benchmark evidence.

## Contract Index

The detailed benchmark and hook contracts are kept out of the main overview:

- Runner contracts: [docs/hook-runner-minimal-plan.md](docs/hook-runner-minimal-plan.md), [docs/hook-runner-input-contract.md](docs/hook-runner-input-contract.md), [docs/hook-runner-output-contract.md](docs/hook-runner-output-contract.md), [docs/hook-runner-dry-run-spec.md](docs/hook-runner-dry-run-spec.md), [docs/hook-runner-dry-run-cli-contract.md](docs/hook-runner-dry-run-cli-contract.md), [docs/hook-runner-selection-matrix.md](docs/hook-runner-selection-matrix.md)
- Hook contracts: [docs/hook-scanner-contracts.md](docs/hook-scanner-contracts.md), [docs/enforcement-surfaces.md](docs/enforcement-surfaces.md), [docs/packaging-readiness.md](docs/packaging-readiness.md), [docs/claude-hook-packaging-contract.md](docs/claude-hook-packaging-contract.md), [docs/claude-hook-package-manifest-fixtures.md](docs/claude-hook-package-manifest-fixtures.md)
- Claude event and adapter contracts: [docs/claude-hook-event-input-contract.md](docs/claude-hook-event-input-contract.md), [docs/claude-hook-event-mapping-examples.md](docs/claude-hook-event-mapping-examples.md), [docs/claude-hook-event-mapper-contract.md](docs/claude-hook-event-mapper-contract.md), [docs/claude-hook-event-mapper-output-fixtures.md](docs/claude-hook-event-mapper-output-fixtures.md), [docs/claude-hook-command-adapter-contract.md](docs/claude-hook-command-adapter-contract.md), [docs/claude-hook-command-adapter-fixtures.md](docs/claude-hook-command-adapter-fixtures.md), [docs/claude-hook-command-adapter-implementation-contract.md](docs/claude-hook-command-adapter-implementation-contract.md), [docs/claude-hook-command-adapter-entrypoint-fixtures.md](docs/claude-hook-command-adapter-entrypoint-fixtures.md), [docs/claude-hook-command-adapter-entrypoint.md](docs/claude-hook-command-adapter-entrypoint.md)
- Claude native and wrapper contracts: [docs/claude-hook-native-payload-mapping-fixtures.md](docs/claude-hook-native-payload-mapping-fixtures.md), [docs/claude-hook-native-metadata-carrier-fixtures.md](docs/claude-hook-native-metadata-carrier-fixtures.md), [docs/claude-hook-native-adapter.md](docs/claude-hook-native-adapter.md), [docs/claude-hook-native-command-input-contract.md](docs/claude-hook-native-command-input-contract.md), [docs/claude-hook-carrier-source-contract.md](docs/claude-hook-carrier-source-contract.md), [docs/claude-hook-wrapper-input-contract.md](docs/claude-hook-wrapper-input-contract.md), [docs/claude-hook-wrapper-output-fixtures.md](docs/claude-hook-wrapper-output-fixtures.md), [docs/claude-hook-wrapper-implementation-contract.md](docs/claude-hook-wrapper-implementation-contract.md), [docs/claude-hook-wrapper-implementation-fixtures.md](docs/claude-hook-wrapper-implementation-fixtures.md), [docs/claude-hook-wrapper-implementation.md](docs/claude-hook-wrapper-implementation.md), [docs/claude-hook-wrapper-wiring-review.md](docs/claude-hook-wrapper-wiring-review.md)
- Manual application boundary: [docs/claude-hook-manual-install-doc-fixture.md](docs/claude-hook-manual-install-doc-fixture.md), [docs/claude-hook-manual-install-contract.md](docs/claude-hook-manual-install-contract.md), [docs/claude-hook-manual-install-language-fixtures.md](docs/claude-hook-manual-install-language-fixtures.md), [docs/claude-hook-manual-install.md](docs/claude-hook-manual-install.md), [docs/claude-hook-manual-install-review-packet.md](docs/claude-hook-manual-install-review-packet.md), [docs/claude-hook-settings-fragment-draft-fixtures.md](docs/claude-hook-settings-fragment-draft-fixtures.md), [docs/claude-hook-settings-fragment-review.md](docs/claude-hook-settings-fragment-review.md), [docs/claude-hook-user-approved-install-language.md](docs/claude-hook-user-approved-install-language.md), [docs/claude-hook-install-application-contract.md](docs/claude-hook-install-application-contract.md), [docs/claude-hook-user-owned-target-checklist.md](docs/claude-hook-user-owned-target-checklist.md), [docs/claude-hook-user-owned-target-review-evidence.md](docs/claude-hook-user-owned-target-review-evidence.md), [docs/claude-hook-user-owned-target-review-packet.md](docs/claude-hook-user-owned-target-review-packet.md), [docs/claude-hook-user-owned-target-review-decision.md](docs/claude-hook-user-owned-target-review-decision.md), [docs/claude-hook-final-apply-request-contract.md](docs/claude-hook-final-apply-request-contract.md), [docs/claude-hook-application-preflight-review-contract.md](docs/claude-hook-application-preflight-review-contract.md), [docs/claude-hook-user-execution-packet-review-contract.md](docs/claude-hook-user-execution-packet-review-contract.md), [docs/claude-hook-user-execution-authorization-review-contract.md](docs/claude-hook-user-execution-authorization-review-contract.md), [docs/claude-hook-user-performed-application-boundary-contract.md](docs/claude-hook-user-performed-application-boundary-contract.md), [docs/claude-hook-application-boundary-chain.md](docs/claude-hook-application-boundary-chain.md)
- Codex skill contracts: [docs/codex-skill-install-contract.md](docs/codex-skill-install-contract.md), [docs/codex-skill-manual-install.md](docs/codex-skill-manual-install.md), [docs/next-session-prompt.md](docs/next-session-prompt.md)
- Productization contracts: [docs/product-scope.md](docs/product-scope.md), [docs/contributing-boundary-failures.md](docs/contributing-boundary-failures.md), [docs/failure-intake-rubric.md](docs/failure-intake-rubric.md), [docs/fixture-promotion-criteria.md](docs/fixture-promotion-criteria.md), [docs/scanner-promotion-criteria.md](docs/scanner-promotion-criteria.md), [docs/open-source-productization-plan.md](docs/open-source-productization-plan.md), [docs/next-mcp-server-contract-prompt.md](docs/next-mcp-server-contract-prompt.md), [docs/mcp-server-contract.md](docs/mcp-server-contract.md)
- Contract checkers: [benchmarks/scripts/check-abk-runner-dry-run.js](benchmarks/scripts/check-abk-runner-dry-run.js), [benchmarks/scripts/check-abk-runner-scan.js](benchmarks/scripts/check-abk-runner-scan.js), [benchmarks/scripts/check-boundary-skill-readiness.js](benchmarks/scripts/check-boundary-skill-readiness.js), [benchmarks/scripts/check-boundary-skill-install-readiness.js](benchmarks/scripts/check-boundary-skill-install-readiness.js), [benchmarks/scripts/check-codex-skill-install-contract.js](benchmarks/scripts/check-codex-skill-install-contract.js), [benchmarks/scripts/check-codex-skill-manual-install-doc.js](benchmarks/scripts/check-codex-skill-manual-install-doc.js)
- Claude contract checkers: [benchmarks/scripts/check-claude-hook-event-input-contract.js](benchmarks/scripts/check-claude-hook-event-input-contract.js), [benchmarks/scripts/check-claude-hook-event-mapping-examples.js](benchmarks/scripts/check-claude-hook-event-mapping-examples.js), [benchmarks/scripts/check-claude-hook-event-mapper-contract.js](benchmarks/scripts/check-claude-hook-event-mapper-contract.js), [benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js](benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js), [benchmarks/scripts/check-claude-hook-packaging-contract.js](benchmarks/scripts/check-claude-hook-packaging-contract.js), [benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js](benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js)
- Claude adapter checkers: [benchmarks/scripts/check-claude-hook-command-adapter-contract.js](benchmarks/scripts/check-claude-hook-command-adapter-contract.js), [benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js](benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js), [benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js](benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js), [benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js](benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js), [benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js](benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js)
- Claude native and wrapper checkers: [benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js](benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js), [benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js](benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js), [benchmarks/scripts/check-claude-hook-native-adapter.js](benchmarks/scripts/check-claude-hook-native-adapter.js), [benchmarks/scripts/check-claude-hook-native-command-input-contract.js](benchmarks/scripts/check-claude-hook-native-command-input-contract.js), [benchmarks/scripts/check-claude-hook-native-command-entrypoint.js](benchmarks/scripts/check-claude-hook-native-command-entrypoint.js), [benchmarks/scripts/check-claude-hook-carrier-source-contract.js](benchmarks/scripts/check-claude-hook-carrier-source-contract.js), [benchmarks/scripts/check-claude-hook-wrapper-input-contract.js](benchmarks/scripts/check-claude-hook-wrapper-input-contract.js), [benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js](benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js), [benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js](benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js), [benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js](benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js), [benchmarks/scripts/check-claude-hook-wrapper-implementation.js](benchmarks/scripts/check-claude-hook-wrapper-implementation.js), [benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js](benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js)
- Claude manual boundary checkers: [benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js](benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js), [benchmarks/scripts/check-claude-hook-manual-install-contract.js](benchmarks/scripts/check-claude-hook-manual-install-contract.js), [benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js](benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js), [benchmarks/scripts/check-claude-hook-manual-install-document.js](benchmarks/scripts/check-claude-hook-manual-install-document.js), [benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js](benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js), [benchmarks/scripts/check-claude-hook-manual-install-review-packet.js](benchmarks/scripts/check-claude-hook-manual-install-review-packet.js), [benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js](benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js), [benchmarks/scripts/check-claude-hook-settings-fragment-review.js](benchmarks/scripts/check-claude-hook-settings-fragment-review.js), [benchmarks/scripts/check-claude-hook-user-approved-install-language.js](benchmarks/scripts/check-claude-hook-user-approved-install-language.js)
- Claude application boundary checkers: [benchmarks/scripts/check-claude-hook-install-application-contract.js](benchmarks/scripts/check-claude-hook-install-application-contract.js), [benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js](benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js), [benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js](benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js), [benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js](benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js), [benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js](benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js), [benchmarks/scripts/check-claude-hook-final-apply-request-contract.js](benchmarks/scripts/check-claude-hook-final-apply-request-contract.js), [benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js](benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js), [benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js](benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js), [benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js](benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js), [benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js](benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js), [benchmarks/scripts/check-claude-hook-application-boundary-chain.js](benchmarks/scripts/check-claude-hook-application-boundary-chain.js)

## Principle

The agent should not ask only, "What words did the user say?"

It should ask:

> What role did this input play, and what output would satisfy that role without leaking it?

## License

MIT. See [LICENSE](LICENSE).
