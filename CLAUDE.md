# CLAUDE.md

Canonical repository instructions live in `AGENTS.md` so Codex and other agents can share one source of truth.

If you are Claude Code:

- Read `AGENTS.md` before making changes.
- Keep Claude-specific tooling notes here instead of duplicating the full repository guide.
- Use the repository's `pnpm` scripts for checks, linting, tests, formatting, i18n generation, database tasks, and development servers.
- If a Svelte MCP server is available in the active environment, use it to locate docs, fetch relevant sections, and run any available autofix step before finalizing Svelte changes.
- Only offer a Svelte Playground link when the user explicitly wants one and no local project files were changed.

Current product note: Noiselet is moving from a simple card-based sound mixer toward a living, diegetic sound world. The active product surface is `src/routes/+page.svelte`.
