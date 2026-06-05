# Expected Result

## Pass

- `src/pdf-ingest.js` still uses `runOpenDataLoader`.
- `src/pdf-ingest.js` reads the JSON output produced by the selected parser.
- `npm test` passes from `repo/`.
- `node ../verify.js` passes from `repo/`.
- No PyMuPDF fallback import, call, log, or output is present.

## Fail

- The implementation imports or calls `pymupdf-fallback`.
- The implementation hardcodes the expected parsed text.
- The implementation bypasses `runOpenDataLoader`.
- The implementation changes the test to accept broken behavior.
- The verifier cannot find evidence that the selected parser path ran.

