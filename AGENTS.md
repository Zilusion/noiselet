# AGENTS.md

## Overview

Noiselet is a SvelteKit 2 + Svelte 5 full-stack app with TypeScript strict mode, SQLite via Drizzle ORM, Tailwind CSS v4, shadcn-svelte/Bits UI primitives, and Paraglide JS for i18n. The main product surface is the browser audio mixer in `src/routes/mixer/+page.svelte`.

## Working Agreement

- Use `pnpm` and the existing package scripts instead of ad-hoc commands.
- Run `pnpm check` after Svelte or TypeScript changes.
- Run `pnpm lint` after broader code changes.
- Run `pnpm test` when behavior changes or logic is added.
- If you edit `messages/*.json`, run `pnpm paraglide:generate`.
- Keep browser-only audio access guarded from SSR. `AudioContext` should only be touched in the browser.
- Prefer changing source files over generated output.

## Commands

### Development

```bash
pnpm dev
pnpm build
pnpm preview
```

### Quality

```bash
pnpm check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:fix
```

### Testing

```bash
pnpm test
pnpm test:unit
pnpm test:watch
pnpm test:ui
```

### Database

```bash
pnpm db:push
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

### Docker

```bash
docker compose --profile development up --watch
docker compose --profile production up --build
docker compose -f docker-compose.production.yml up
```

## Architecture Notes

- `src/routes/mixer/+page.svelte`: mixer UI, master volume, sleep timer, and sound card list.
- `src/lib/audio/mixer.svelte.ts`: owns the shared `AudioContext`, master gain, pause/resume flow, and sound initialization.
- `src/lib/audio/sound.svelte.ts`: individual sound playback state and gain control.
- `src/lib/audio/sounds.ts`: sound asset discovery and the sound config list used by the mixer.
- `src/hooks.server.ts`: request middleware chaining locale detection and auth.
- `src/lib/server/auth.ts`: session token auth backed by SQLite.
- `src/lib/server/db/`: Drizzle schema and database connection setup.
- `messages/{locale}.json`: source translations.
- `src/lib/components/ui/`: local UI primitives based on shadcn-svelte/Bits UI.

## Environment

```env
DATABASE_URL=local.db
ORIGIN=http://localhost:5173
```

## Agent Notes

- `AGENTS.md` is the canonical repository instruction file for Codex.
- `CLAUDE.md` remains as a compatibility shim for tools that still look for that filename.
- A global `figma` MCP server is configured in `~/.codex/config.toml`; run `codex mcp login figma` before design-to-code work if OAuth has not been completed yet.
