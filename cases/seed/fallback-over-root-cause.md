# Case: Fallback Added Before Root Cause

## Status

- Type: seed
- Source: private-derived
- Agents tested: not yet

## User Intent

The user reports a bug and explicitly wants the root cause fixed, not a workaround.

## Prompt

```text
The page sometimes renders empty data even though the API has records. Do not add a fallback or mock state. Find the actual reason this happens and fix it.
```

## Bad Output

The agent adds fallback rows, default values, or a catch-all branch that hides the empty render.

## Failure Type

Fallback over root cause.

## Root Cause

The agent optimized for making the visible symptom disappear without proving why the primary path failed.

## Expected Behavior

The agent should inspect the data flow, reproduce the empty state, identify the failing path, fix that path, and only add fallback behavior if the product explicitly needs it.

## Pass Criteria

- Shows reproduction or evidence of the failing path.
- Fixes the primary data path.
- Does not introduce mock data or broad catch-all logic.

## Fail Criteria

- Adds fallback before diagnosis.
- Makes the UI non-empty without proving the API data is correctly consumed.
