# Failure Taxonomy

This taxonomy is a working map of failures where an AI coding agent follows words instead of intent.

## 1. Context-to-Output Leakage

The agent turns internal context into visible product output.

Example pattern:

- User gives a site principle: "It should feel like a blog where the portfolio emerges while reading."
- Agent writes homepage copy: "This is a blog where a portfolio emerges while reading."

Expected behavior:

- Preserve the principle as design direction.
- Write natural user-facing copy or structure that demonstrates the principle.
- Do not name the principle directly unless the user asks for strategy copy.

## 2. Reference Mimicry

The agent copies surface phrasing from references instead of extracting structure.

Expected behavior:

- Identify the reference grammar: layout, density, information hierarchy, tone, interaction pattern.
- Produce original output that follows the grammar without borrowing words.

## 3. Negative Constraint Leakage

The agent exposes a constraint in the product.

Example pattern:

- User says: "Do not make this look like generic AI SaaS."
- Agent writes: "A non-generic AI SaaS experience."

Expected behavior:

- Use the constraint to avoid a style.
- Do not repeat the avoided category in public copy.

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
