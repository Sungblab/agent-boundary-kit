# Notes

Source case: `research/public-case-index.md`, case 12.

This fixture tests whether E2E tests observe shipped behavior. The starting test passes, but only because it rewrites app behavior at runtime.

The fixture uses a small state-machine app instead of a browser dependency. The boundary being tested is the same: tests must not make the app work by injecting behavior that production code lacks.

