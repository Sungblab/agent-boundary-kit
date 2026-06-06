# Codex Skill Manual Install

This document gives bounded manual copy instructions for `skills/boundary-check`.

Do not run these commands unless the user explicitly requests installation.

## Boundary

This is manual copy only.

It is not plugin packaging, not hook installation, not connector configuration, and not an installer.

The source contract is `docs/codex-skill-install-contract.md`.

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

Do not add a .codex-plugin manifest.

Do not add plugin.json.

Do not install Claude hooks.

Do not create a connector.

Do not build a dashboard.

## Preconditions

Before publishing or using these instructions, run:

```sh
node benchmarks/scripts/check-boundary-skill-readiness.js
node benchmarks/scripts/check-codex-skill-install-contract.js
node benchmarks/scripts/check-boundary-skill-install-readiness.js
node benchmarks/scripts/check-codex-skill-manual-install-doc.js
npm run bench:check
npm run bench:check:red
```

The `skills/boundary-check` folder must contain only `SKILL.md` for this first manual install path.

## Manual Install

PowerShell example:

```powershell
$SourceSkill = ".\skills\boundary-check"
$TargetRoot = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills" } else { Join-Path $env:USERPROFILE ".codex\skills" }
New-Item -ItemType Directory -Force -Path $TargetRoot
Copy-Item -Recurse -Force -Path $SourceSkill -Destination $TargetRoot
```

POSIX shell example:

```sh
SOURCE_SKILL="./skills/boundary-check"
TARGET_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$TARGET_ROOT"
cp -R "$SOURCE_SKILL" "$TARGET_ROOT/"
```

These examples copy the local `SKILL.md` into the user's local Codex skills directory. They do not run scanners, install hooks, create plugin manifests, configure connectors, or change repository files.

## Verify

After a manual copy, inspect the target folder:

```text
boundary-check/
  SKILL.md
```

Then run the repository gates again from this repo:

```sh
node benchmarks/scripts/check-boundary-skill-install-readiness.js
node benchmarks/scripts/check-codex-skill-manual-install-doc.js
npm run bench:check
npm run bench:check:red
```

The repo gates verify the source candidate and install instructions. They do not prove that a separate Codex runtime has loaded the skill.

## Uninstall

Remove only the copied `boundary-check` skill folder from the user's local Codex skills directory.

PowerShell example:

```powershell
$TargetRoot = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME "skills" } else { Join-Path $env:USERPROFILE ".codex\skills" }
Remove-Item -Recurse -Force -Path (Join-Path $TargetRoot "boundary-check")
```

POSIX shell example:

```sh
TARGET_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
rm -rf "$TARGET_ROOT/boundary-check"
```

Use the uninstall examples only for the copied skill folder.

## Non-Goals

Do not publish automatic setup commands.

Do not add a plugin manifest.

Do not add bundled executable scripts.

Do not add hook setup.

Do not add connector configuration.

Do not add dashboards or workflow apps.

Do not treat scanner output as final copy.
