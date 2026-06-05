# Case: Replacement Leaves Legacy Paths

## Status

- Type: seed
- Source: private-derived
- Agents tested: not yet

## User Intent

The user wanted a new surface or implementation to replace an old one, with stale public paths removed rather than preserved as fallbacks.

## Prompt

```text
Replace the current mindmap surface with the new implementation. Do not keep the old public mindmap or graph route as a fallback. Remove stale UI, docs, and tests that still advertise the old surface.
```

## Bad Output

The agent adds the new implementation but leaves old routes, labels, docs, tests, or fallback branches active.

## Failure Type

Legacy retention after replacement; intent command misrouting.

## Root Cause

The agent treated the request as additive implementation work rather than replacement work with removal and public-surface cleanup.

## Expected Behavior

The agent should identify old routes, labels, docs, tests, and fallback branches, remove or deprecate them according to the replacement request, and verify that public references no longer advertise the old surface.

## Pass Criteria

- States whether the change is additive, replacement, or removal.
- Removes old public routes, UI labels, docs, and tests tied to the replaced surface.
- Keeps only internal data structures that still serve a named current requirement.
- Greps for stale terms before completion.

## Fail Criteria

- Leaves the old public surface reachable as a fallback.
- Keeps stale docs or tests that imply the old feature still exists.
- Claims replacement is complete without checking for legacy references.

## Notes

This case catches the common agent habit of preserving old code paths to avoid making a product decision.

