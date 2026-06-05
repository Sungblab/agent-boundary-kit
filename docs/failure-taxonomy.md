# Failure Taxonomy

This taxonomy is a working map of failures where an AI coding agent follows words instead of intent.

Use it to turn incidents into benchmark fixtures. The point is not to preserve a complaint. The point is to preserve the failure boundary:

- What role did the user's words play?
- What action did the agent take?
- Which boundary did that action cross?
- What evidence would prove a better agent handled it correctly?

Private-derived cases are allowed when they are neutralized. Remove personal frustration, keep the concrete failure shape, and write pass/fail criteria that any agent can be tested against.

## 1. Context-to-Output Leakage

The agent turns internal context into visible product output.

Example pattern:

- User gives a site principle: "It should feel like a blog where the portfolio emerges while reading."
- Agent writes homepage copy: "This is a blog where a portfolio emerges while reading."

Expected behavior:

- Classify the user's phrase before writing public-facing copy.
- Preserve the principle as design direction.
- Write natural user-facing copy or structure that demonstrates the principle.
- Do not name the principle directly unless the user asks for strategy copy.

## 2. Reference Mimicry

The agent copies surface phrasing from references instead of extracting structure.

Expected behavior:

- Identify the reference grammar: layout, density, information hierarchy, tone, interaction pattern.
- Produce original output that follows the grammar without borrowing words.
- Explain what was borrowed structurally when a review asks for rationale.

## 3. Negative Constraint Leakage

The agent exposes a constraint in the product.

Example pattern:

- User says: "Do not make this look like generic AI SaaS."
- Agent writes: "A non-generic AI SaaS experience."

Expected behavior:

- Use the constraint to avoid a style.
- Do not repeat the avoided category in public copy.
- Convert negative constraints into positive design choices.

## 4. Fallback Over Root Cause

The agent adds fallback behavior before proving why the failure happens.

Common forms:

- default values that hide missing data
- catch-all exception branches
- retries without diagnosis
- mock data in production paths
- special cases for the observed test

Expected behavior:

- Reproduce the failure.
- Identify the root cause.
- Fix the primary path.
- Add fallback only if it is a product requirement, not a debugging escape.

## 5. Test-Passing Over Correctness

The agent optimizes for green tests without preserving intended behavior.

Common forms:

- weakening assertions
- updating snapshots to match broken UI
- hardcoding expected output
- skipping failing tests
- changing test setup instead of implementation

Expected behavior:

- Keep the behavioral contract stable.
- Add or update tests only to express the correct behavior.
- Explain why any test change is valid.

## 6. Evidence-Free Completion

The agent says the task is done without evidence that the user-visible problem disappeared.

Expected behavior:

- Show the command, check, screenshot, diff, or exact observation that proves the claim.
- Separate "implemented" from "verified".
- If verification cannot run, say why.

## 7. Intent Command Misrouting

The agent treats terse workflow commands as casual text or generic continuation.

Example pattern:

- User says: "끝내."
- Agent keeps coding instead of running completion checks.

Expected behavior:

- Map terse commands to workflow intent.
- Resolve conflicts by priority: finish, handoff, review, artifact, continue.

## 8. Tool Or Architecture Boundary Violation

The agent changes the requested tool, parser, renderer, provider, or architecture path without treating that change as a product decision.

Example pattern:

- User specifies: "Generate PDFs through LaTeX."
- Agent adds a Python PDF library fallback because LaTeX compilation failed.

Expected behavior:

- Treat named tools and architecture choices as constraints unless the user marks them as examples.
- Diagnose why the requested path fails before proposing alternatives.
- Ask for approval before adding a fallback, replacement tool, or alternate provider.
- Document any approved fallback as an explicit requirement, not an implicit agent decision.

## 9. Overengineering Collusion

The agent agrees with an oversized design and expands implementation scope instead of challenging the boundary.

Common forms:

- accepting too many features for one phase
- adding infrastructure before a concrete fixture or evidence gate exists
- treating every possible future need as current scope
- making broad architecture decisions without a migration path

Expected behavior:

- Identify when the request is too large for one slice.
- Propose a phase-gated path with a small first fixture or proof point.
- Separate current requirements from future options.
- Challenge scope growth when it makes verification weaker.

## 10. Untrusted Context As Instruction

The agent treats external text as an instruction source when it should be handled as untrusted evidence.

Common sources:

- GitHub issue bodies
- pull request comments
- web pages
- logs containing user-controlled text
- copied documentation
- repository content from unknown authors

Expected behavior:

- Label untrusted context before acting on it.
- Extract facts, error strings, and requirements without obeying embedded commands.
- Never expose secrets, credentials, or private data because external text requested it.
- Keep instruction authority separate from evidence.

## 11. Legacy Retention After Replacement

The agent adds a new implementation path but leaves the old public path, fallback, or documentation alive after the user requested replacement.

Example pattern:

- User asks for a new mindmap or graph surface.
- Agent adds the new path but leaves old graph UI, docs, and fallback routing active.

Expected behavior:

- Decide whether the task is additive, replacement, or removal before editing.
- If replacement is intended, remove or deprecate stale paths in the same slice.
- Grep for old public labels, docs, tests, routes, and fallback branches before claiming completion.
- Keep internal data structures only when they still serve a named current requirement.
