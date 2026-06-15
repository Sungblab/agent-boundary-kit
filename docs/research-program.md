# Research Program

Agent Boundary Kit should stay research-first until the failure model is stronger than the plugin story.

The core question is:

```text
When does an AI coding agent produce plausible work that crosses the user's intended boundary?
```

The project should answer that question with evidence before turning any behavior into a product feature.

## Research Thesis

Agent failures are not only "bad prompts" or generic model mistakes. Many failures repeat in recognizable shapes:

- fallback before root cause
- test-passing over correctness
- approved-scope drift
- evidence treated as instruction
- examples or constraints copied as final output
- false completion without gate evidence
- oversized requests accepted without a phase gate
- stale public surfaces left after replacement

Agent Boundary Kit studies those shapes and turns the repeatable ones into fixtures, rubrics, and narrow read-only checks.

## Evidence Ladder

Do not promote a rule, scanner, hook, skill, or plugin behavior until it climbs this ladder.

1. **Research seed**
   A neutralized incident or public case describes one boundary failure without private transcript dependency.

2. **Failure taxonomy**
   The seed is classified into one primary failure type and one primary affected surface.

3. **Reproducible fixture**
   A small fixture contains `prompt.md`, `repo/`, `expected.md`, `verify.js` when possible, and source notes.

4. **Pass/fail rubric**
   The fixture has observable pass/fail criteria that do not depend on taste, hidden chat history, or private context.

5. **Red evidence**
   At least one agent run fails the fixture in the intended way.

6. **Green evidence**
   At least one run or hand-written reference path proves the fixture can be passed without weakening the boundary.

7. **Scanner or evaluator candidate**
   A narrow read-only scanner or evaluator is proposed only for the proven boundary condition.

8. **Promotion review**
   The scanner/evaluator is wired into benchmark checks only after red and green evidence are recorded.

9. **Agent surface candidate**
   Skills, MCP tools, hooks, and plugin packaging may reference the behavior only after fixture-backed evidence exists.

## Productization Pause

The Codex and Claude Code plugins are distribution candidates, not the center of the work.

Until the research loop is stronger, avoid positioning ABK as:

- a general agent linter
- a prompt-improvement library
- a project-management tool
- a broad security scanner
- a universal "better Codex" plugin

The product claim should stay narrower:

```text
ABK is a research seed and testbed for AI coding-agent boundary failures.
```

The later product claim is allowed only when the fixtures and scanner evidence justify it:

```text
ABK is a fixture-backed preflight and finish guard for AI coding agents.
```

## Devflow Boundary

Devflow Native and ABK can work together, but they should not merge.

Devflow records repo-local workflow truth:

- active work
- sessions and handoffs
- recorded gates
- review evidence
- repeated-mistake promotion

ABK studies and checks boundary failures:

- whether the agent is solving the wrong problem
- whether a fallback bypasses root-cause work
- whether tests were changed to satisfy the agent
- whether external text was trusted as instruction
- whether completion was claimed without evidence

If a feature needs durable work state, it belongs in Devflow. If it needs a neutral fixture, pass/fail rubric, scanner, or evaluator for a boundary failure, it belongs in ABK.

## Next Research Queue

Choose new work from evidence gaps, not from plugin UX gaps.

Preferred next slices:

1. Add one new public or neutralized failure seed.
2. Promote it into one small fixture with a binary verifier or scoring checklist.
3. Run at least one red evaluation.
4. Add green evidence only after the red trap is proven.
5. Decide whether the failure deserves a scanner, a manual evaluator, or only documentation.

Do not add new plugin commands, dashboards, marketplace polish, or hook automation unless the next fixture-backed research gap requires that surface.
