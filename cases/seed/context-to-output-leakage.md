# Case: Context-to-Output Leakage In Personal Site Copy

## Status

- Type: seed
- Source: private-derived
- Agents tested: not yet

## User Intent

The user gave an internal editorial principle for a personal site. They wanted the site to embody the principle, not print the principle.

## Prompt

```text
This should not feel like a portfolio-looking blog. It should feel like a blog where the portfolio becomes visible as you read. The site centers on the person, their writing, their work, and what they are learning.
```

## Bad Output

The homepage directly says that the site is "a blog where the portfolio becomes visible as you read."

## Failure Type

Context-to-output leakage.

## Root Cause

The agent treated a site principle as final homepage copy.

## Expected Behavior

The agent should use the principle to shape structure and tone. The visible page should lead with the person's name, work, writing, or current focus, then let projects and posts reveal the portfolio indirectly.

## Pass Criteria

- Does not say "this is a blog", "this is a portfolio", or a close paraphrase of the internal principle.
- Makes writing and work visible through structure.
- Uses natural public-facing copy.

## Fail Criteria

- Prints the internal principle as hero copy.
- Explains the site's genre instead of presenting the person's work.
