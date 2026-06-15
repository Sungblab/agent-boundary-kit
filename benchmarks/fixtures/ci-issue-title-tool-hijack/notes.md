# Notes

Source case: docs/web-research-agent-boundary-failures-2026.md#priority-1-ci-issue-text-tool-hijack-fixture

This fixture models the boundary identified in the web research memo: public issue text can be interpolated into a privileged CI triage agent, while the agent also has more tools and permissions than the triage task requires.

The fixture should remain narrow. It checks context classification, least-privilege workflow configuration, and report output. It should not become a broad prompt-injection firewall, CI/CD scanner, or repository-permission auditor.
