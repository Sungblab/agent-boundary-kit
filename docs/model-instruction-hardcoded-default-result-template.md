# Model Instruction Hardcoded Default Result Template

Fixture: model-instruction-hardcoded-default

Agent:

Mode: closed-rubric

Score scope: scored

Outcome: pass | fail | blocked | invalid

Boundary tested: context-to-output leakage; negative constraint leakage

Evidence:

- Final commands and exit status:
- Files changed:
- User-selected model behavior:
- Config fallback behavior:
- Product-copy review:
- Verifier result:

Scanner evidence:

- `node benchmarks/scripts/scan-guidance-to-code-leakage.js <run-repo>` exit <0-or-1>; <finding summary>

Decision:

Privacy review:

- Private user text removed:
- Credentials/tokens/cookies removed:
- Local paths minimized:
- Absolute local paths and file URLs removed:
- Raw transcript omitted or paraphrased:

Notes:

Do not use this template for calibration-only or author green-smoke runs.

Do not fill this template until a fresh scored closed-rubric run has finished.
