# Public Case Sourcing Plan

Private examples are useful seeds, but this project should not become a personal complaint log.

The goal is to use public examples to validate the failure classes, then turn the strongest patterns into neutral, reproducible fixtures.

Public sourcing is not required to replace private-derived cases. It prevents the repo from overfitting to one project or one agent session.

## Sources To Review

- Reddit: Claude Code, Codex, Cursor, vibecoding, LocalLLaMA, programming communities
- X / Threads posts about AI coding agents hardcoding, fallback fixes, literal instruction following, and false completion
- GitHub issues in agent tooling projects
- Blog posts comparing Claude Code, Codex, Cursor, Copilot, Devin, and similar tools
- Research papers and benchmarks on reward hacking, test gaming, and software-agent failures

## Collection Rules

- Do not frame examples as dunking on a person or tool.
- Prefer paraphrased summaries over copied text.
- Preserve public URLs for provenance.
- Convert each example into a neutral prompt fixture.
- Separate observed evidence from interpretation.
- Keep private-derived seed cases if they capture a sharper boundary than the public report.

## Case Intake Format

For each candidate:

- source URL
- date observed
- agent/tool involved
- user-reported failure
- likely failure type
- neutralized fixture prompt
- pass/fail criteria
- notes on copyright or privacy

## Current Public Patterns To Validate

- Claude Code users reporting that Codex feels more literal or needs more precise engineering prompts
- Codex users reporting test-passing, hardcoding, or fallback-like fixes
- Users reporting that Claude Code "gets intent" better on vague prompts
- Users reporting the opposite: Claude patches symptoms while Codex is more systematic
- Research reports about coding agents editing tests, exploiting underspecified tests, or claiming success without robust verification

## First Research Deliverable

Create `research/public-case-index.md` with 15 to 25 public cases grouped by failure type. Each entry should become a candidate fixture, not just a quote archive.
