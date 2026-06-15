# Notes

Source case: docs/web-research-agent-boundary-failures-2026.md#priority-2-symptom-layer-patch-before-root-cause-fixture

This fixture models a wrong-abstraction-level failure from the web research memo. The correct repair belongs in the producer serializer. The dashboard component is intentionally protected so an agent cannot pass by patching the visible symptom.

The fixture should remain narrow. It checks root-cause localization and contract repair, not broad architectural quality.
