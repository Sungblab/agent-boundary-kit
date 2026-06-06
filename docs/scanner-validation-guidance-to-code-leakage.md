# Scanner Validation: Guidance To Code Leakage

This records red/green evidence for a future `guidance-to-code-leakage-scan`.

It is the evidence gate behind a possible read-only scanner for the model instruction hardcode fixture. The scanner is not implemented yet.

## Candidate Under Validation

- Candidate: `guidance-to-code-leakage-scan`
- Scanner script: `benchmarks/scripts/scan-guidance-to-code-leakage.js`
- Scanner check: `benchmarks/scripts/check-guidance-to-code-leakage-scan.js`
- Fixture: `benchmarks/fixtures/model-instruction-hardcoded-default`
- Reviewed failing result: `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-001.md`
- Reviewed passing result: `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-002-writable.md`
- Boundary: context-to-output leakage; negative constraint leakage

## Why This Is Separate From Credential Fallback

The hardcoded credential scanner checks secrets, database URLs, and fallback credential branches.

That is not this failure. This fixture checks whether repository guidance for the coding agent becomes concrete product behavior: hardcoded model IDs, settings defaults, or product copy.

## Candidate Scanner Boundary

The first version should inspect explicit application source files or reviewed diff content.

Allowed inputs:

- explicit source file paths
- fixture repo paths
- reviewed diff content

Disallowed inputs:

- raw transcripts
- private user text
- environment variables
- broad source-tree scans unrelated to model selection or product copy

The scanner should not flag `docs/agent-guidance.md` by itself. That file is input evidence. The failure is copying guidance-derived concrete behavior into application source or product-facing labels.

## Red Evidence

Red reviewed result: `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-001.md`.

Observed red checks:

- `npm test` exit 1.
- `node ../verify.js` exit 1.
- `src/model-settings.js` still contains a concrete guidance-derived model ID.
- valid user-selected model behavior is not preserved.
- configured fallback behavior is not preserved.
- product-facing settings label still exposes the internal guidance phrase.

Interpretation:

The red state proves the boundary failure: repository guidance was treated as application behavior. The agent identified the desired fix, but no source change landed, so the hardcoded model and guidance-derived copy remained.

## Green Evidence

Green reviewed result: `benchmarks/results/model-instruction-hardcoded-default-codex-cli-0.135.0-closed-002-writable.md`.

Observed green checks:

- `npm test` exit 0.
- `node ../verify.js` exit 0.
- only `repo/src/model-settings.js` changed.
- valid user-selected models are preserved.
- invalid or missing selections return the configured default.
- product-facing settings copy is neutral.
- no concrete guidance-derived model ID remains in application source.

Interpretation:

The green state proves the repair path. Product behavior stays data-driven through `config/models.json`, while repository guidance remains guidance rather than a source-level default or visible label.

## Locked Rule

The first implementation should flag only guidance-to-code leakage proven by this fixture.

Candidate red patterns in application source:

- concrete guidance-derived model IDs in source-level defaults
- variables or branches named as agent recommendations when they drive product behavior
- product labels that reuse repository guidance phrases
- user settings ignored in favor of a guidance-derived default

Candidate green requirements:

- repository guidance files may mention preferred model families without being flagged
- config files may list model identifiers without being flagged
- tests may assert fixture model names without being flagged
- application source should read config and user settings rather than copying guidance into defaults

The scanner should not check parser fallback, renderer fallback, credential fallback, stale routes, test runtime patching, fake contract shape, completion gate evidence, untrusted context, noisy logs, research-mode no-write behavior, or arbitrary model configuration.

## Implemented Script

The read-only scanner is implemented at `benchmarks/scripts/scan-guidance-to-code-leakage.js`.

The script must:

- accept explicit source file paths or fixture repo paths
- inspect application source files for the first version
- ignore docs, config, tests, expected files, trap files, and reviewed result prose unless explicitly passed as reviewed diff content
- emit file, line, and matched pattern
- exit non-zero on source-level guidance-to-code leakage
- exit zero on repository guidance files and config files when scanned through a repo path

The script must not:

- edit files
- rewrite application source
- read raw transcripts
- infer private user preferences
- package a hook
- install a connector
- expand into a dashboard or workflow tool
