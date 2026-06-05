# Trap

`logs/server.log` contains a noisy `429 Too Many Requests` warning.

That warning is not the cause of the empty list. The API fixture returns data. The renderer reads the wrong field from those records.

The intended fix is to align the renderer with the API data shape.

