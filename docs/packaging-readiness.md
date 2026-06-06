# Packaging Readiness Contract

This contract defines when Agent Boundary Kit may move from fixture-backed docs and scanner execution into a small installable surface.

It is not an installed hook, not plugin packaging, not a connector, and not a dashboard plan.

## Boundary

Packaging may use only:

- fixture-backed rules from `docs/scanner-coverage-matrix.md`
- explicit runner input from `docs/hook-runner-read-only-execution-contract.md`
- read-only `abk-runner scan` results
- bounded templates and skill instructions

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No automatic inference of scope, named tools, final gates, stale terms, external evidence, command logs, test files, production files, or plan artifacts.

## Candidate Surfaces

`templates/AGENTS.boundary.md` and `templates/CLAUDE.boundary.md` are documentation surfaces. They are ready to keep as repo templates because they do not execute code.

`skills/boundary-check/SKILL.md` is the first Codex skill candidate. It may wrap the boundary checklist, scanner selection guidance, and explicit `abk-runner scan` examples. It must not run broad scans, install hooks, generate final responses, or read chat history.

The manual install boundary for that candidate is defined in `docs/codex-skill-install-contract.md`.

The user-approved manual copy instructions for that candidate are defined in `docs/codex-skill-manual-install.md`.

The future Claude hook candidates remain specs:

- `hooks/claude/pre-write-boundary-check.md`
- `hooks/claude/post-edit-scope-check.md`
- `hooks/claude/test-integrity-check.md`
- `hooks/claude/completion-evidence-check.md`

Those Claude hook specs may inform a later hook package only after the hook runtime has a safe way to receive explicit runner input.

The event-to-runner-input boundary for those future hooks is recorded in `docs/claude-hook-event-input-contract.md`.

The event mapper command boundary is recorded in `docs/claude-hook-event-mapper-contract.md`.

The event mapper output fixture gate is recorded in `docs/claude-hook-event-mapper-output-fixtures.md`.

The future Claude hook packaging boundary is recorded in `docs/claude-hook-packaging-contract.md`.

The future Claude hook package manifest fixtures are recorded in `docs/claude-hook-package-manifest-fixtures.md`.

The future Claude hook manual install documentation fixture is recorded in `docs/claude-hook-manual-install-doc-fixture.md`.

The future Claude hook manual install contract is recorded in `docs/claude-hook-manual-install-contract.md`.

The Claude hook manual install language fixtures are recorded in `docs/claude-hook-manual-install-language-fixtures.md`.

The Claude hook manual install document is recorded in `docs/claude-hook-manual-install.md`.

The Claude hook native payload mapping fixtures are recorded in `docs/claude-hook-native-payload-mapping-fixtures.md`.

The Claude hook native metadata carrier fixtures are recorded in `docs/claude-hook-native-metadata-carrier-fixtures.md`.

The Claude hook native adapter is recorded in `docs/claude-hook-native-adapter.md`.

The future Claude hook command adapter contract is recorded in `docs/claude-hook-command-adapter-contract.md`.

The Claude hook command adapter fixtures are recorded in `docs/claude-hook-command-adapter-fixtures.md`.

The Claude hook command adapter implementation contract is recorded in `docs/claude-hook-command-adapter-implementation-contract.md`.

The Claude hook command adapter entrypoint fixtures are recorded in `docs/claude-hook-command-adapter-entrypoint-fixtures.md`.

The Claude hook command adapter entrypoint is recorded in `docs/claude-hook-command-adapter-entrypoint.md`.

## Minimum Installable Slice

The first installable slice should be a small Codex skill update, not a hook package.

Allowed:

- reference the scanner coverage matrix
- ask the agent to classify user input roles before public text
- ask the agent to choose matching scanner ids from declared task metadata
- show exact `abk-runner scan --input <runner-input.json> --scanner <scanner-id>` command shapes
- require evidence from `benchmarks/scripts/check-abk-runner-scan.js` before any completion claim

Blocked until a separate fixture-backed gate exists:

- automatic hook installation
- background watchers
- broad repository scans without declared input
- final-response generation from scanner output
- plugin manifests
- connector setup
- dashboard or SaaS workflow

## Required Evidence

The packaging candidate must cite all scanner ids that can be executed through the runner:

- `parser-fallback-boundary-scan`
- `latex-renderer-boundary-scan`
- `legacy-surface-retention-scan`
- `phase-gate-plan-scan`
- `test-runtime-patch-scan`
- `completion-evidence-gate-scan`
- `noisy-log-root-cause-scan`
- `hardcoded-credential-fallback-scan`
- `test-fake-contract-scan`
- `untrusted-context-canary-scan`

Before any installable surface is claimed ready, run:

```sh
node benchmarks/scripts/check-packaging-readiness.js
node benchmarks/scripts/check-boundary-skill-readiness.js
node benchmarks/scripts/check-codex-skill-install-contract.js
node benchmarks/scripts/check-boundary-skill-install-readiness.js
node benchmarks/scripts/check-codex-skill-manual-install-doc.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-packaging-contract.js
node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-native-adapter.js
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must prove:

- the candidate surface links to the scanner coverage matrix
- the candidate surface uses explicit runner input
- the candidate surface does not ask for raw private transcripts
- the candidate surface does not broaden scanner input paths
- the candidate surface does not treat scanner output as final copy

## Explicit Non-Goals

Do not build a dashboard.

Do not build a SaaS workflow.

Do not create a connector.

Do not install Claude hooks.

Do not package a Codex plugin.

Do not add a broad CLI beyond the existing runner command contracts.

Do not turn this repository into a project-management app.

## Next Gate

The Codex skill packaging check is `benchmarks/scripts/check-boundary-skill-readiness.js`. It verifies `skills/boundary-check/SKILL.md` references this contract, `docs/scanner-coverage-matrix.md`, `docs/hook-runner-read-only-execution-contract.md`, every runner scanner id, and the explicit read-only `abk-runner scan` command shape.

The Codex skill install contract check is `benchmarks/scripts/check-codex-skill-install-contract.js`. It verifies `docs/codex-skill-install-contract.md` keeps the first installable candidate manual, bounded, and separate from plugin, hook, connector, dashboard, and watcher behavior.

The boundary skill install-readiness check is `benchmarks/scripts/check-boundary-skill-install-readiness.js`. It verifies the first installable candidate remains a plain `skills/boundary-check/` folder before manual install instructions are published.

The manual install doc check is `benchmarks/scripts/check-codex-skill-manual-install-doc.js`. It verifies `docs/codex-skill-manual-install.md` stays limited to user-approved copy commands and does not introduce plugin, hook, connector, dashboard, or broad scanning behavior.

The Claude hook event input contract check is `benchmarks/scripts/check-claude-hook-event-input-contract.js`. It verifies `docs/claude-hook-event-input-contract.md` keeps future hook runtime events limited to explicit metadata before they become runner input.

The Claude hook event mapper contract check is `benchmarks/scripts/check-claude-hook-event-mapper-contract.js`. It verifies `docs/claude-hook-event-mapper-contract.md` keeps the `abk-runner map-event --input <hook-event.json>` command bounded to event-to-runner-input mapping without installing hooks or executing scanners.

The Claude hook event mapper output fixture check is `benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js`. It verifies `docs/claude-hook-event-mapper-output-fixtures.md` fixes valid, rejected transcript, missing-field, unknown-field, and invalid JSON outputs.

The local mapper implementation check is `benchmarks/scripts/check-abk-runner-map-event.js`. It verifies `abk-runner map-event --input <hook-event.json>` emits those output fixtures exactly.

The Claude hook packaging contract check is `benchmarks/scripts/check-claude-hook-packaging-contract.js`. It verifies `docs/claude-hook-packaging-contract.md` keeps future hook packaging bounded to explicit event JSON, `abk-runner map-event`, `abk-runner dry-run`, and `abk-runner scan` command templates without installing hooks automatically.

The Claude hook package manifest fixture check is `benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js`. It verifies `docs/claude-hook-package-manifest-fixtures.md` keeps future manifests fixture-only, manual-review-only, and auto-install disabled.

The Claude hook manual install documentation fixture check is `benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js`. It verifies `docs/claude-hook-manual-install-doc-fixture.md` keeps future install documentation non-mutating before any install contract exists.

The Claude hook manual install contract check is `benchmarks/scripts/check-claude-hook-manual-install-contract.js`. It verifies `docs/claude-hook-manual-install-contract.md` keeps future manual installation language user-approved and non-mutating until install instructions exist.

The Claude hook manual install language fixture check is `benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js`. It verifies `docs/claude-hook-manual-install-language-fixtures.md` names `abk-claude-hook` without shell copy commands, repository mutation, or automatic setup.

The Claude hook manual install document check is `benchmarks/scripts/check-claude-hook-manual-install-document.js`. It verifies `docs/claude-hook-manual-install.md` remains blocked for live installation until native Claude Code hook payload mapping is proven.

The Claude hook native payload mapping fixture check is `benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js`. It verifies `docs/claude-hook-native-payload-mapping-fixtures.md` rejects transcript reads and blocks native payloads that lack explicit ABK task metadata.

The Claude hook native metadata carrier fixture check is `benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js`. It verifies `docs/claude-hook-native-metadata-carrier-fixtures.md` keeps `hookId`, `repoRoot`, and `task` explicit when native payloads become ABK hook events.

The Claude hook native adapter check is `benchmarks/scripts/check-claude-hook-native-adapter.js`. It verifies `docs/claude-hook-native-adapter.md` maps native payload plus explicit carrier metadata without reading transcripts, installing hooks, or editing Claude configuration.

The Claude hook command adapter contract check is `benchmarks/scripts/check-claude-hook-command-adapter-contract.js`. It verifies `docs/claude-hook-command-adapter-contract.md` records the stdin-to-runner-input bridge required before live hook instructions.

The Claude hook command adapter fixture check is `benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js`. It verifies `docs/claude-hook-command-adapter-fixtures.md` records red/green stdin adapter fixtures.

The Claude hook command adapter implementation contract check is `benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js`. It verifies `docs/claude-hook-command-adapter-implementation-contract.md` keeps adapter entrypoint behavior bounded.

The Claude hook command adapter entrypoint fixture check is `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js`. It verifies `docs/claude-hook-command-adapter-entrypoint-fixtures.md` records stdin parsing, cleanup, exit-code, and rejection fixtures.

The Claude hook command adapter entrypoint check is `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js`. It verifies `docs/claude-hook-command-adapter-entrypoint.md`, `bin/abk-claude-hook.js`, and `lib/abk-claude-hook-adapter.js` execute fixture-backed stdin mapping without installing hooks.

Only after those checks pass should the repo consider a command-entrypoint input contract for native payload plus explicit carrier metadata.

Claude hook installation remains later because packaging still needs red/green package manifest fixtures and must not read private transcripts.
