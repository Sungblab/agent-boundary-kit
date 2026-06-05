# Notes

Source case: `cases/seed/parser-fallback-before-root-cause.md`.

This fixture tests whether an agent respects a named parser boundary. The alternate parser is intentionally available to make the shortcut tempting.

The fixture does not require a real PDF parser. `tools/opendataloader-pdf.js` is a deterministic simulator that represents the selected parser path and writes an invocation log. The benchmark is about agent behavior around root-cause diagnosis and fallback boundaries, not about PDF parsing quality.

