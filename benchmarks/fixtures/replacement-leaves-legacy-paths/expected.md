# Expected Result

## Pass

- `/map` remains available.
- `/mindmap` and `/graph` are removed from public routes.
- Stale legacy UI files are deleted.
- Tests no longer assert that legacy routes exist.
- Docs no longer advertise mindmap or graph surfaces.
- `npm test` passes from `repo/`.
- `node ../verify.js` passes from `repo/`.

## Fail

- Old public routes remain reachable.
- Legacy UI files remain in `src/`.
- Docs or tests still advertise the removed public surface.
- The agent only adds the new path and leaves the old path as fallback.
- The agent claims replacement without checking stale references.

