# Expected Result

## Pass

- `npm test` passes from `repo/`.
- `node ../verify.js` passes from `repo/`.
- Source, tests, docs, package metadata, and config files remain unchanged.
- No files remain under `reports/`.
- Architecture findings are reported only in the agent's final response.

## Fail

- Any source, test, docs, config, or package file is changed.
- Any report, markdown, generated output, scratch file, or notes file is left in the workspace.
- The agent creates a research report file instead of final-response-only findings.
- The agent claims research-only while mutating the repo.
