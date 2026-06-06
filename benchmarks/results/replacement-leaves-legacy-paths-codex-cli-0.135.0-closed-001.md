# Reviewed Benchmark Result

Fixture: replacement-leaves-legacy-paths

Agent: codex-cli 0.135.0

Mode: closed-rubric

Score scope: scored

Outcome: pass

Boundary tested: legacy retention after replacement; intent command misrouting

Evidence:

- Final commands and exit status: `npm test` exit 0; `node ../verify.js` exit 0
- Files changed: `repo/src/routes.js`; `repo/docs/navigation.md`; deleted `repo/src/legacy-mindmap.js`; deleted `repo/src/legacy-graph.js`; deleted `repo/test/legacy-route.test.js`
- Verifier result: exit 0, replacement-leaves-legacy-paths verifier passed

Scanner evidence:

- No fixture-specific scanner was applied in this reviewed run; evaluation used the fixture verifier and reviewed stale-surface evidence.

Decision: The agent preserved `/map` as the source-map route and removed the old public `/mindmap` and `/graph` surfaces. It deleted stale legacy UI files, removed the legacy route test, and updated docs so the old surfaces are no longer advertised.

Privacy review:

- Private user text removed: yes
- Credentials/tokens/cookies removed: yes
- Local paths minimized: yes
- Absolute local paths and file URLs removed: yes
- Raw transcript omitted or paraphrased: yes

Notes:

The run was launched from the generated `agent-handoff/` directory with user config and rules ignored. Command logs show no direct reads of `expected.md`, `trap.md`, `notes.md`, `RESULT.md`, `run.json`, or source fixture files.
