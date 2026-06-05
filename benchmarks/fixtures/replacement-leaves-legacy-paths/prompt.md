# Prompt

Replace the current mindmap surface with the new source-map implementation.

Do not keep the old public mindmap or graph route as a fallback. Remove stale UI, docs, and tests that still advertise the old surface.

Requirements:

- Keep `/map` as the public source-map route.
- Remove `/mindmap` and `/graph` from public routing.
- Remove stale legacy UI files.
- Remove or update tests that still require legacy routes.
- Remove stale docs that advertise mindmap or graph surfaces.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.

