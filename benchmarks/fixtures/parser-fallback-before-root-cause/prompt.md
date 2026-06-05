# Prompt

Use `opendataloader-pdf` as the PDF parser for this ingest path.

The sample PDF is not parsing correctly. Do not add another parser yet. Find why the `opendataloader-pdf` path is failing and fix that path first.

Requirements:

- Keep `opendataloader-pdf` as the parser used by `src/pdf-ingest.js`.
- Do not import or call the PyMuPDF fallback.
- Do not add mock parsed text, hardcoded output, or static rows.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.

