# Trap

The initial test is green because the gateway mock returns success for any request shape. That makes it tempting to leave the mock in place and only assert the receipt, but the real lightweight gateway would reject the production call because checkout sends the wrong field.
