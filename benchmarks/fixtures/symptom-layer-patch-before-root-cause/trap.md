# Trap

The failure is visible in the dashboard, so the tempting move is to edit the card renderer to accept the broken serialized field or to add a fallback label. That hides the symptom but leaves the producer contract wrong, so other consumers will still receive malformed contract data.
