# Codex Skill Install Contract

This contract defines the first narrow installable surface for `skills/boundary-check/SKILL.md`.

It is not a plugin package, not an automatic installer, not a Claude hook package, not a connector, and not a dashboard plan.

## Boundary

The current installable surface is a manual Codex skill candidate only.

Manual install only.

Do not install the skill without an explicit user request.

The install candidate may contain only bounded skill instructions that point back to:

- `docs/packaging-readiness.md`
- `docs/scanner-coverage-matrix.md`
- `docs/hook-runner-read-only-execution-contract.md`
- `benchmarks/scripts/check-boundary-skill-readiness.js`

It must not add new execution behavior beyond the existing read-only runner command:

```sh
abk-runner scan --input <runner-input.json> --scanner <scanner-id>
```

## Installable Candidate

The first candidate is `skills/boundary-check/SKILL.md`.

It may instruct an agent to:

- classify user input roles before public-facing text
- identify named tools, off-limits fallbacks, stale terms, and final gates from explicit task context
- choose a scanner id from `docs/scanner-coverage-matrix.md`
- run the read-only runner only with explicit runner input
- record scanner status as evidence
- run completion gates before completion claims

It must not:

- run scanners automatically
- infer missing runner input from private chat context
- generate final responses from scanner output
- install hooks
- create plugin manifests
- add connector setup

## Allowed Install Shape

The first install shape is a plain skill folder:

```text
skills/boundary-check/
  SKILL.md
```

No bundled executable scripts are allowed in the first installable slice.

Do not add bundled executable scripts.

If metadata such as `agents/openai.yaml` is added later, it must mirror the `SKILL.md` trigger and must not broaden scope, add tools, or introduce installer behavior.

## Privacy And Input Contract

The skill may reference only explicit task metadata and explicit runner input.

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No background watchers.

Do not treat scanner output as final copy.

The runner input must not contain final responses, PR descriptions, release notes, product copy, credentials, cookies, tokens, passwords, raw chat messages, or hidden conversation state.

## Evidence Gate

Before the skill is described as installable, run:

```sh
node benchmarks/scripts/check-packaging-readiness.js
node benchmarks/scripts/check-boundary-skill-readiness.js
node benchmarks/scripts/check-codex-skill-install-contract.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the skill is tied to fixture-backed scanner coverage
- the skill uses explicit runner input
- the install surface has no `.codex-plugin` manifest
- the install surface has no `plugin.json`
- the install surface has no bundled executable scripts
- the install surface does not install hooks, connectors, or background watchers

## Blocked Surfaces

Do not add a .codex-plugin manifest.

Do not add plugin.json.

Do not install Claude hooks.

Do not create a connector.

Do not build a dashboard.

Do not add background watchers.

Do not add automatic install commands.

Do not add broad workspace scans.

Do not turn this repository into a project-management app.

## Next Gate

The next gate is a small install-readiness check for the plain `skills/boundary-check/` folder. It should verify the skill folder shape before any manual installation instructions are published.

Only after that check passes should the repo document a user-approved manual install command.

Claude hook packaging remains later because hooks need an event-to-runner-input contract that does not read private transcripts.
