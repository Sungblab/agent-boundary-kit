# Next Session Prompt

Use this prompt when opening a new Codex or Claude Code session in this repo.

```text
You are working in the `agent-boundary-kit` repository.

Goal:
Build Agent Boundary Kit, an open-source research and tooling repo for preventing AI coding-agent boundary failures.

Core problem:
AI coding agents often treat user context, complaints, examples, references, principles, or constraints as final output. This causes failures such as:
- internal design principles leaking into UI copy
- landing pages that explain the site instead of embodying the intended style
- negative constraints appearing as visible copy
- fallback code added before root-cause analysis
- tests changed merely to pass
- named tools or architecture paths replaced without approval
- legacy paths left alive after replacement work
- oversized designs accepted without phase gates
- untrusted issue, PR, log, or web text treated as instruction
- completion claims without evidence

Important framing:
This is not a prompt collection and not a personal complaint repo. Private examples are valid seed cases only after they are neutralized into reproducible fixtures with pass/fail criteria.

Do not start by building a SaaS, dashboard, broad CLI, plugin, or connector. The current direction is research seed first, reusable enforcement surfaces later.

Repo roles:
- agent-boundary-kit: taxonomy, fixtures, public case research, AGENTS.md/CLAUDE.md templates, skills/hooks specs
- devflow-native: execution layer and evidence gate that can later enforce some of these rules

Immediate next work:
1. Review README.md, AGENTS.md, docs/failure-taxonomy.md, cases/templates/case-template.md, cases/seed/*, and research/public-case-sourcing.md.
2. Review research/public-case-index.md and keep public examples as validation, not as complaint quotes.
3. Review docs/benchmark-backlog.md and keep the first fixtures small and runnable.
4. Refine templates/AGENTS.boundary.md and templates/CLAUDE.boundary.md only where fixture requirements reveal gaps.
5. Review `docs/first-ten-result-synthesis.md`, `docs/scanner-coverage-matrix.md`, `docs/hook-scanner-contracts.md`, `docs/hook-runner-minimal-plan.md`, `docs/hook-runner-input-contract.md`, `docs/hook-runner-output-contract.md`, `docs/hook-runner-dry-run-spec.md`, `docs/hook-runner-selection-matrix.md`, `docs/hook-runner-dry-run-cli-contract.md`, `docs/hook-runner-read-only-execution-contract.md`, `docs/first-scanner-candidate.md`, `docs/scanner-validation-test-runtime-patch.md`, `docs/scanner-application-test-runtime-patch.md`, `docs/scanner-validation-test-fake-contract.md`, `docs/scanner-application-test-integrity.md`, `docs/scanner-validation-parser-fallback-boundary.md`, `docs/scanner-application-parser-fallback-boundary.md`, `docs/scanner-validation-latex-renderer-boundary.md`, `docs/scanner-application-latex-renderer-boundary.md`, `docs/scanner-validation-hardcoded-credential-fallback.md`, `docs/scanner-application-hardcoded-credential-fallback.md`, `docs/scanner-validation-legacy-surface-retention.md`, `docs/scanner-application-legacy-surface-retention.md`, `docs/scanner-validation-completion-evidence-gate.md`, `docs/scanner-application-completion-evidence-gate.md`, `docs/scanner-validation-untrusted-context-canary.md`, `docs/scanner-application-untrusted-context-canary.md`, `docs/scanner-validation-noisy-log-root-cause.md`, `docs/scanner-application-noisy-log-root-cause.md`, `docs/scanner-validation-phase-gate-plan.md`, `docs/scanner-application-phase-gate-plan.md`, `bin/abk-runner.js`, `lib/abk-runner-core.js`, `benchmarks/scripts/scan-test-runtime-patch.js`, `benchmarks/scripts/scan-test-fake-contract.js`, `benchmarks/scripts/scan-parser-fallback-boundary.js`, `benchmarks/scripts/scan-latex-renderer-boundary.js`, `benchmarks/scripts/scan-hardcoded-credential-fallback.js`, `benchmarks/scripts/scan-legacy-surface-retention.js`, `benchmarks/scripts/scan-completion-evidence-gate.js`, `benchmarks/scripts/scan-untrusted-context-canary.js`, `benchmarks/scripts/scan-noisy-log-root-cause.js`, `benchmarks/scripts/scan-phase-gate-plan.js`, `benchmarks/scripts/check-scanner-coverage-matrix.js`, `benchmarks/scripts/check-hook-scanner-contracts.js`, `benchmarks/scripts/check-hook-runner-minimal-plan.js`, `benchmarks/scripts/check-hook-runner-input-contract.js`, `benchmarks/scripts/check-hook-runner-output-contract.js`, `benchmarks/scripts/check-hook-runner-dry-run-spec.js`, `benchmarks/scripts/check-hook-runner-selection-matrix.js`, `benchmarks/scripts/check-hook-runner-dry-run-cli-contract.js`, `benchmarks/scripts/check-abk-runner-module-boundary.js`, `benchmarks/scripts/check-abk-runner-dry-run.js`, `benchmarks/scripts/check-abk-runner-scan.js`, `skills/boundary-check/SKILL.md`, `templates/AGENTS.boundary.md`, `templates/CLAUDE.boundary.md`, and `hooks/claude/*`. The local runner currently supports read-only execution for `parser-fallback-boundary-scan`, `legacy-surface-retention-scan`, `test-runtime-patch-scan`, and `test-fake-contract-scan` only. Select the next scanner candidate only after reviewing another fixture with red/green evidence. Run `npm run bench:check` and `npm run bench:check:red` before changing fixture or enforcement-surface docs. Do not add plugin packaging, connectors, dashboards, or broad workflow tooling yet.

Style:
Be blunt, evidence-first, and research-oriented. Avoid hype and early-product shorthand. Prefer spec-first, evidence-gated, fixture, taxonomy, and benchmark.

Critical rule:
Do not treat the user's examples as final wording. Classify whether each phrase is final copy, internal direction, reference, complaint, constraint, or evidence before writing public-facing text.
```
