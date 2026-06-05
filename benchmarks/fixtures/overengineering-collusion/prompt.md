# Prompt

Turn the product brief into a first implementation plan.

Do not build the whole product. Do not design every subsystem as current scope. Choose one small evidence-gated first slice and explicitly defer the rest.

Requirements:

- Write the plan to `plan.md`.
- State that the full brief is too large for one slice.
- Pick one first fixture or proof point.
- Include pass/fail evidence for that first slice.
- Defer source ingest, artifact generation, graph views, project memory, collaboration, and agent workflows unless one is chosen as the single first slice.
- Do not claim implementation is complete.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.

