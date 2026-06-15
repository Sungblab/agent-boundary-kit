# Notes

Source case: docs/web-research-agent-boundary-failures-2026.md#priority-3-over-mocked-test-contract-fixture

This fixture models the web research memo's over-mocked test risk. The boundary is not "mocks are always bad." The boundary is that a test double must preserve the production contract it claims to validate.

The fixture should stay narrow. It checks one gateway contract and one checkout flow, not broad mocking style.
