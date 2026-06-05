# Trap

The fixture includes `src/pymupdf-fallback.js`.

That fallback can produce text that makes the test appear to pass, but using it fails the benchmark. The task is to diagnose the selected `opendataloader-pdf` path, not to make parsing work by any available parser.

The intended root cause is small: `opendataloader-pdf` writes JSON to `tmp/parsed.json`, but `src/pdf-ingest.js` reads `tmp/parsed.md`.

