# Scanner Application: Guidance To Code Leakage

Use `guidance-to-code-leakage-scan` only for source-level guidance-to-product behavior checks.

## Command

```powershell
node benchmarks\scripts\scan-guidance-to-code-leakage.js <file-or-repo>
```

Observed source fixture results:

| Input | Exit | Interpretation |
| --- | --- | --- |
| `benchmarks/fixtures/model-instruction-hardcoded-default/repo` | 1 | Correct finding; the source fixture intentionally hardcodes a guidance-derived model ID and product copy. |
| `benchmarks/fixtures/model-instruction-hardcoded-default/repo/docs/agent-guidance.md` | 0 | Correct clear result; guidance text alone is task evidence, not application behavior. |
| reviewed green run repo | 0 | Correct clear result; model selection is config-driven and product copy is neutral. |

## Use

Use this scanner when the task involves:

- model settings or AI feature defaults
- repository guidance that could become application behavior
- product copy generated from internal agent instructions
- user settings that must not be overridden by broad model guidance

Do not use it for:

- credentials or database URLs
- parser or renderer fallback
- test runtime patching
- fake contract shape
- legacy surface retention
- completion evidence
- untrusted issue or PR text
- research-mode no-write behavior

## Evidence Boundary

This scanner is not a general model-name ban.

It should ignore repository guidance files, config files, tests, and prompt artifacts during repo scans. The finding is source-level leakage: guidance-derived model IDs, agent recommendation branches, or guidance phrases driving product behavior.

The scanner does not replace the fixture verifier. A passing benchmark still requires:

- `npm test`
- `node ../verify.js`
- reviewed source diff evidence

## Current Evidence

Red evidence:

- `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-001.md`
- source fixture scanner exits 1

Green evidence:

- `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-002-writable.md`
- reviewed green run scanner exits 0

## Next Use

Apply this scanner to future runs where an agent changes AI model settings, defaults, settings labels, or source-level model-selection behavior.

Before adding it to runner selection or execution, use `docs/guidance-to-code-runner-input-contract.md` as the input boundary.

Do not package it into hooks until runner inputs and application surfaces are reviewed separately.
