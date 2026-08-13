# Kldfood AI working agreement

## Project

- This repository contains a React/Vite storefront in `apps/web` and an Express API in `apps/api`.
- User-facing copy is Russian. Preserve the existing visual style and terminology.
- Treat payment, R-Keeper, order state, database, deployment, authentication, and secrets as high-risk areas.

## Before changing files

1. Read `TASK.md` and `PROJECT_STATUS.md`.
2. Run `npm run ai:route -- "<task>"` when the task has not already been classified.
3. Use the local Continue/Ollama workflow only for LOW tasks. Use Cursor premium Agent for HIGH tasks.
4. Check `git status --short`. Never discard unrelated user changes.

## Change rules

- Keep the smallest change that satisfies the task.
- Do not change business logic, API contracts, pricing, checkout, payment, R-Keeper integration, environment files, or deployment configuration unless the task explicitly requires it.
- Never put credentials or production data in source control.
- Do not edit generated `dist/` output directly.
- Ask before installing runtime dependencies, changing schemas, or running destructive commands.
- For HIGH tasks, first write a short plan and identify affected files and risks.

## Required verification

Run `npm run check` before declaring work complete. If a check cannot run, report the exact reason instead of claiming success.

The check sequence is: ESLint, TypeScript, tests, then production build.
