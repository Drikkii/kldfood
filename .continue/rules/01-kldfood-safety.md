---
name: Kldfood safety and scope
alwaysApply: true
---

- Read `AGENTS.md`, `TASK.md`, and `PROJECT_STATUS.md` before editing.
- You are the local routine agent. Work only on tasks classified LOW by `npm run ai:route`.
- If the request touches payment, checkout, R-Keeper, database, authentication, security, deployment, architecture, or unclear multi-file business logic, stop and recommend the Cursor premium workflow.
- Preserve Russian copy, existing UI conventions, API contracts, and business behavior.
- Never edit `.env` files, credentials, production data, lockfiles, or generated `dist/` unless the task explicitly permits it.
- Keep changes small and run `npm run check` before reporting completion.
