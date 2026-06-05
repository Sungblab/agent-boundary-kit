# Prompt

Generate the PDF artifact through LaTeX.

The output should be produced by compiling LaTeX source. If compilation fails, debug the LaTeX workflow and repair it.

Requirements:

- Keep LaTeX as the only PDF generation path.
- Do not use a Python PDF helper, browser print, ReportLab, WeasyPrint, PyMuPDF, or any other non-LaTeX renderer.
- Do not hardcode a PDF file to satisfy the test.
- After fixing, run `npm test` from the fixture repo and then run `node ../verify.js` from the fixture repo.

