# Claude Hook Specs

These are hook specifications, not installed hooks.

They map benchmark-proven boundary rules to future Claude Code hooks. Keep them as specs until the fixture runs show which checks are worth automating.

The current specs were refined from `docs/first-ten-result-synthesis.md`. They are still not executable hooks.

Scanner input and output contracts are recorded in `docs/hook-scanner-contracts.md`. That document defines the read-only scanner inputs, exit code meaning, and transcript boundary for future hook packaging.

The minimal runner plan is recorded in `docs/hook-runner-minimal-plan.md`. It defines how future hook packaging may pass explicit file or repo paths and declared metadata to the scanners. It is still not an installed hook.

The runner JSON input contract is recorded in `docs/hook-runner-input-contract.md`. It includes `hooks/claude/runner-input.schema.json`, a valid input example, and invalid examples for transcript leakage and missing declared metadata.

The runner JSON output contract is recorded in `docs/hook-runner-output-contract.md`. It includes `hooks/claude/runner-output.schema.json`, clear and finding examples, and invalid examples for final-copy generation and transcript leakage.

The runner dry-run spec is recorded in `docs/hook-runner-dry-run-spec.md`. It uses `runner-dry-run.pre-write-boundary.json`, `runner-dry-run.pre-write-config-error.json`, `runner-dry-run.post-edit-scope.json`, `runner-dry-run.post-edit-scope-clear.json`, `runner-dry-run.post-edit-scope-fanout.json`, `runner-dry-run.test-integrity.json`, and `runner-dry-run.completion-evidence.json` to cover finding, clear, configuration-error, and scanner fan-out output states. It is still not an installed hook.

The hook runner selection matrix is recorded in `docs/hook-runner-selection-matrix.md`. It defines which declared input predicates select which scanner scripts. It is still not an installed hook.

The plan-only dry-run CLI contract is recorded in `docs/hook-runner-dry-run-cli-contract.md`. Its local implementation is split between `bin/abk-runner.js` and `lib/abk-runner-core.js`, and prints scanner selection plans without executing scanners. `runner-dry-run-cli.planned-output.json`, `runner-dry-run-cli.configuration-error-output.json`, `runner-dry-run-cli.invalid-transcript-output.json`, and `runner-dry-run-cli.unsupported-hook-output.json` are output examples. It is still not an installed hook.

The first read-only execution contract is recorded in `docs/hook-runner-read-only-execution-contract.md`. Its local implementation is split between `bin/abk-runner.js` and `lib/abk-runner-core.js`, limited to `parser-fallback-boundary-scan`, `latex-renderer-boundary-scan`, `hardcoded-credential-fallback-scan`, and `legacy-surface-retention-scan` with explicit runner input and changed file paths, `test-runtime-patch-scan` with explicit runner input and test file paths, `test-fake-contract-scan` with explicit runner input plus test and production file paths, `completion-evidence-gate-scan` with explicit runner input plus the declared repo root, `untrusted-context-canary-scan` with explicit runner input plus changed files or completion draft path, `noisy-log-root-cause-scan` with explicit runner input plus changed files or explicit test and production file paths, and `phase-gate-plan-scan` with explicit runner input plus metadata plan file paths. It is still not an installed hook.

That execution contract includes configuration-error examples for unsupported scanner ids, unselected scanner ids, and missing changed file metadata. It is still not an installed hook.

The packaging readiness contract is recorded in `docs/packaging-readiness.md`. It keeps these files as hook specs, not installed hooks, until a separate event-to-runner-input gate exists.

The Claude hook event-to-runner-input contract is recorded in `docs/claude-hook-event-input-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-event-input-contract.js` and keeps future hook events limited to explicit metadata before they become runner input.

The Claude hook event mapping examples are recorded in `docs/claude-hook-event-mapping-examples.md`. They are checked by `benchmarks/scripts/check-claude-hook-event-mapping-examples.js` and cover one valid event plus one rejected transcript event.

The Claude hook event mapper contract is recorded in `docs/claude-hook-event-mapper-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-event-mapper-contract.js` and defines a bounded `abk-runner map-event --input <hook-event.json>` command without installing hooks or executing scanners.

The Claude hook event mapper output fixtures are recorded in `docs/claude-hook-event-mapper-output-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js` and fix the valid runner-input output plus rejected transcript, missing-field, unknown-field, and invalid JSON configuration-error outputs.

The local mapper implementation is checked by `benchmarks/scripts/check-abk-runner-map-event.js`. It maps explicit event metadata only and still does not install hooks, select scanners, or execute scanners.

The Claude hook packaging contract is recorded in `docs/claude-hook-packaging-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-packaging-contract.js` and keeps future packaging limited to explicit hook events plus `abk-runner map-event`, `abk-runner dry-run`, and `abk-runner scan` command templates. It is still not an installed hook.

The Claude hook package manifest fixtures are recorded in `docs/claude-hook-package-manifest-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js` and keep future manifests fixture-only, manual-review-only, and auto-install disabled. They are still not installed hooks.

The Claude hook manual install documentation fixture is recorded in `docs/claude-hook-manual-install-doc-fixture.md`. It is checked by `benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js` and keeps future install documentation non-mutating before any install contract exists.

The Claude hook manual install contract is recorded in `docs/claude-hook-manual-install-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-manual-install-contract.js` and keeps future install language user-approved and non-mutating until install instructions exist.

The Claude hook manual install language fixtures are recorded in `docs/claude-hook-manual-install-language-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js` and name `abk-claude-hook` without shell copy commands, repository mutation, or automatic setup.

The Claude hook manual install document is recorded in `docs/claude-hook-manual-install.md`. It is checked by `benchmarks/scripts/check-claude-hook-manual-install-document.js` and is ready only for user-approved manual install language review while agent-performed installation remains blocked.

The Claude hook manual install native entrypoint readiness check is recorded in `benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js`. It keeps manual install language review gated by native command entrypoint evidence while agent-performed installation remains blocked.

The Claude hook manual install review packet is recorded in `docs/claude-hook-manual-install-review-packet.md`. It is checked by `benchmarks/scripts/check-claude-hook-manual-install-review-packet.js` and keeps user-facing review language separate from live settings fragments and shell commands.

The Claude hook native payload mapping fixtures are recorded in `docs/claude-hook-native-payload-mapping-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js` and prove native Claude Code payload alone is insufficient because ABK task metadata must remain explicit.

The Claude hook native metadata carrier fixtures are recorded in `docs/claude-hook-native-metadata-carrier-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js` and prove native payload plus explicit carrier metadata can produce an ABK hook event without reading transcripts.

The Claude hook native adapter is recorded in `docs/claude-hook-native-adapter.md`. It is checked by `benchmarks/scripts/check-claude-hook-native-adapter.js` and maps native payload plus explicit carrier metadata into an ABK hook event without reading transcripts, installing hooks, or editing Claude configuration.

The Claude hook native command input contract is recorded in `docs/claude-hook-native-command-input-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-native-command-input-contract.js` and keeps native payload input as a single explicit stdin envelope with `nativePayload` and `metadataCarrier`.

The Claude hook native command entrypoint is checked by `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`. It verifies `abk-claude-hook` maps that envelope through the native payload adapter without echoing `transcript_path`, `session_id`, raw native content, or tool responses.

The Claude hook command adapter contract is recorded in `docs/claude-hook-command-adapter-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-command-adapter-contract.js` and records the stdin-to-runner-input bridge required before live hook instructions.

The Claude hook command adapter fixtures are recorded in `docs/claude-hook-command-adapter-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js` and keep the stdin bridge fixture-backed.

The Claude hook command adapter implementation contract is recorded in `docs/claude-hook-command-adapter-implementation-contract.md`. It is checked by `benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js` and bounds the stdin entrypoint implementation.

The Claude hook command adapter entrypoint fixtures are recorded in `docs/claude-hook-command-adapter-entrypoint-fixtures.md`. They are checked by `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js` and fix stdin parsing, cleanup, exit-code, and rejection expectations.

The local Claude hook command adapter entrypoint is recorded in `docs/claude-hook-command-adapter-entrypoint.md`. It is checked by `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js` and verifies `bin/abk-claude-hook.js` plus `lib/abk-claude-hook-adapter.js` against the entrypoint fixtures without installing hooks.

The first narrow scanner candidate is defined in `docs/first-scanner-candidate.md`. It targets only test runtime patching. Its red/green evidence is recorded in `docs/scanner-validation-test-runtime-patch.md`, its first application sweep is recorded in `docs/scanner-application-test-runtime-patch.md`, and its read-only script is `benchmarks/scripts/scan-test-runtime-patch.js`.

The next scanner candidate is `test-fake-contract-scan`; its red/green evidence is recorded in `docs/scanner-validation-test-fake-contract.md`, and its read-only script is `benchmarks/scripts/scan-test-fake-contract.js`. It is still not an installed hook.

The combined application sweep for the current test-integrity scanners is recorded in `docs/scanner-application-test-integrity.md`.

The first non-test-integrity scanner is `parser-fallback-boundary-scan`; its red/green evidence is recorded in `docs/scanner-validation-parser-fallback-boundary.md`, its application sweep is recorded in `docs/scanner-application-parser-fallback-boundary.md`, and its read-only script is `benchmarks/scripts/scan-parser-fallback-boundary.js`. It is still not an installed hook.

The next named-tool scanner is `latex-renderer-boundary-scan`; its red/green evidence is recorded in `docs/scanner-validation-latex-renderer-boundary.md`, its application sweep is recorded in `docs/scanner-application-latex-renderer-boundary.md`, and its read-only script is `benchmarks/scripts/scan-latex-renderer-boundary.js`. It is still not an installed hook.

The next env/config scanner is `hardcoded-credential-fallback-scan`; its red/green evidence is recorded in `docs/scanner-validation-hardcoded-credential-fallback.md`, its application sweep is recorded in `docs/scanner-application-hardcoded-credential-fallback.md`, and its read-only script is `benchmarks/scripts/scan-hardcoded-credential-fallback.js`. It is still not an installed hook.

The next replacement cleanup scanner is `legacy-surface-retention-scan`; its red/green evidence is recorded in `docs/scanner-validation-legacy-surface-retention.md`, its application sweep is recorded in `docs/scanner-application-legacy-surface-retention.md`, and its read-only script is `benchmarks/scripts/scan-legacy-surface-retention.js`. It is still not an installed hook.

The next completion scanner is `completion-evidence-gate-scan`; its red/green evidence is recorded in `docs/scanner-validation-completion-evidence-gate.md`, its application sweep is recorded in `docs/scanner-application-completion-evidence-gate.md`, and its read-only script is `benchmarks/scripts/scan-completion-evidence-gate.js`. It is still not an installed hook.

The next untrusted-context scanner is `untrusted-context-canary-scan`; its red/green evidence is recorded in `docs/scanner-validation-untrusted-context-canary.md`, its application sweep is recorded in `docs/scanner-application-untrusted-context-canary.md`, and its read-only script is `benchmarks/scripts/scan-untrusted-context-canary.js`. It is still not an installed hook.

The next root-cause scanner is `noisy-log-root-cause-scan`; its red/green evidence is recorded in `docs/scanner-validation-noisy-log-root-cause.md`, its application sweep is recorded in `docs/scanner-application-noisy-log-root-cause.md`, and its read-only script is `benchmarks/scripts/scan-noisy-log-root-cause.js`. It is still not an installed hook.

The next planning scanner is `phase-gate-plan-scan`; its red/green evidence is recorded in `docs/scanner-validation-phase-gate-plan.md`, its application sweep is recorded in `docs/scanner-application-phase-gate-plan.md`, and its read-only script is `benchmarks/scripts/scan-phase-gate-plan.js`. It is still not an installed hook.

## Specs

- `pre-write-boundary-check.md`: block writes when the task boundary is not established.
- `post-edit-scope-check.md`: flag stale public surfaces, out-of-scope edits, and hardcoded credentials.
- `test-integrity-check.md`: flag tests that make broken behavior pass.
- `completion-evidence-check.md`: block completion claims without the required gate evidence.

## Automation Rule

Do not add hook scripts until a spec has:

- a fixture-backed failure pattern
- a red fixture state that demonstrates the pattern
- a passing fixture state that demonstrates the intended allowed behavior
- a narrow scanner rule that can be checked without reading raw private transcripts

## Fixture Coverage

- `parser-fallback-before-root-cause`
- `latex-pdf-tool-boundary`
- `replacement-leaves-legacy-paths`
- `overengineering-collusion`
- `e2e-test-runtime-patch`
- `release-gate-before-completion`
- `wrong-cause-rate-limit-noise`
- `hardcoded-fallback-secret`
- `bad-test-fake-precedence`
- `untrusted-issue-comment-canary`
