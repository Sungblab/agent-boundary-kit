# Claude Hook Specs

These are hook specifications, not installed hooks.

They map benchmark-proven boundary rules to future Claude Code hooks. Keep them as specs until the fixture runs show which checks are worth automating.

The current specs were refined from `docs/first-ten-result-synthesis.md`. They are still not executable hooks.

The first narrow scanner candidate is defined in `docs/first-scanner-candidate.md`. It targets only test runtime patching. Its red/green evidence is recorded in `docs/scanner-validation-test-runtime-patch.md`, its first application sweep is recorded in `docs/scanner-application-test-runtime-patch.md`, and its read-only script is `benchmarks/scripts/scan-test-runtime-patch.js`.

The next scanner candidate is `test-fake-contract-scan`; its red/green evidence is recorded in `docs/scanner-validation-test-fake-contract.md`, and its read-only script is `benchmarks/scripts/scan-test-fake-contract.js`. It is still not an installed hook.

The combined application sweep for the current test-integrity scanners is recorded in `docs/scanner-application-test-integrity.md`.

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
