# Claude Hook Specs

These are hook specifications, not installed hooks.

They map benchmark-proven boundary rules to future Claude Code hooks. Keep them as specs until the fixture runs show which checks are worth automating.

## Specs

- `pre-write-boundary-check.md`: block writes when the task boundary is not established.
- `post-edit-scope-check.md`: flag stale public surfaces, out-of-scope edits, and hardcoded credentials.
- `test-integrity-check.md`: flag tests that make broken behavior pass.
- `completion-evidence-check.md`: block completion claims without the required gate evidence.

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

