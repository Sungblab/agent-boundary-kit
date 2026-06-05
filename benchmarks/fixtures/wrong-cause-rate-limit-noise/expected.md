# Expected Result

## Pass

- The renderer uses the actual API record field.
- `npm test` passes from `repo/`.
- `node ../verify.js` passes from `repo/`.
- No retry, throttle, fallback, mock, or hardcoded people path is added.

## Fail

- The implementation adds retry or throttle behavior.
- The implementation adds fallback people or mock rows.
- The implementation hardcodes the expected names.
- The implementation treats the noisy rate-limit log as the root cause without checking data shape.
- Tests are changed to accept an empty list.

