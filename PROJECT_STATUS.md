# Project status

Updated: 2026-08-13

## Architecture

- `apps/web`: React 19, TypeScript, React Router, Vite.
- `apps/api`: Express REST API for menu, locations, checkout, YooKassa, and R-Keeper.
- Root: npm workspaces and deployment scripts.

## Development commands

- `npm run dev:web`: frontend only.
- `npm run dev:api`: API only.
- `npm run check`: lint, typecheck, tests, and production build.
- `npm run ai:route -- "task"`: choose local LOW workflow or premium HIGH workflow.

## Safety checkpoint

- Baseline commit before AI workflow setup: `89bf065`.
- Backup branch: `backup/ai-system-before-20260813`.
- Setup branch: `chore/ai-workflow-setup`.
- At setup time, `gh-pages` was 10 commits ahead and 11 behind `origin/gh-pages`; no pull, rebase, reset, or force-push was performed.

## Known test coverage

- The project did not have an automated application test suite when this workflow was added.
- The initial test command verifies the task router. Add focused application tests alongside future feature work.
