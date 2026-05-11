# AGENTS.md

## Overview

Noiselet is a SvelteKit 2 + Svelte 5 full-stack app with TypeScript strict mode, SQLite via Drizzle ORM, Tailwind CSS v4, shadcn-svelte/Bits UI primitives, Paraglide JS for i18n, and a browser Web Audio API mixer.

The product direction is an atmospheric sound mixer with a living, diegetic interface. The current UI is a simple card-based prototype; future work should move controls into a scene where sounds feel like physical objects in the world.

## Working Agreement

- Use `pnpm` and existing package scripts instead of ad-hoc commands.
- Run `pnpm check` after Svelte or TypeScript changes.
- Run `pnpm lint` after broader code changes.
- Run `pnpm test` when behavior changes or logic is added.
- Run `pnpm format` or `pnpm format:fix` for documentation or broad formatting work when useful.
- If you edit `messages/*.json`, run `pnpm paraglide:generate`.
- Keep browser-only audio access guarded from SSR. `AudioContext` should only be touched in the browser.
- Prefer changing source files over generated output.
- Do not edit `src/lib/paraglide/**` directly; it is generated.
- Keep `CHANGELOG.md` as release history rather than a scratchpad for in-progress work.

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

### i18n

```bash
pnpm paraglide:generate
```

### Docker

```bash
docker compose --profile development up --watch
docker compose --profile production up --build
docker compose -f docker-compose.production.yml up
```

## Current Architecture

- `src/routes/+page.svelte`: current mixer page, master volume, pause/resume, sleep timer, and sound list.
- `src/routes/sound-card.svelte`: temporary card UI for one sound, including volume and play/load/stop control.
- `src/lib/audio/mixer.svelte.ts`: shared browser `AudioContext`, master gain, pause/resume flow, sound initialization.
- `src/lib/audio/sound.svelte.ts`: individual sound playback state, lazy loading, looping source node, and gain control.
- `src/lib/audio/sounds.ts`: Vite sound asset discovery and the sound config list used by the mixer.
- `src/lib/audio/sleep-timer.svelte.ts`: rune-based countdown state used by the current page.
- `src/lib/assets/sounds/`: local mp3 assets discovered by `getSoundConfigs()`.
- `src/lib/assets/icons/`: SVG assets, some of which are not currently connected to the UI.
- `src/routes/+layout.svelte`: global layout, favicon, hidden localized links for Paraglide routing.
- `src/hooks.ts`: client/server reroute integration for localized paths.
- `src/hooks.server.ts`: request middleware chaining Paraglide locale handling and auth/session validation.
- `src/lib/server/auth.ts`: session token auth backed by SQLite.
- `src/lib/server/db/`: Drizzle schema and database connection setup.
- `messages/{locale}.json`: source translations.
- `project.inlang/settings.json`: Paraglide/inlang locale configuration.
- `src/lib/components/ui/`: local UI primitives based on shadcn-svelte/Bits UI.

There is currently no `src/routes/mixer/+page.svelte`; the product surface lives at `src/routes/+page.svelte`.

## Product Design Direction

Treat the existing card UI as scaffolding. The target experience is a living sound world with diegetic controls:

- Sounds should map to visible scene objects, machines, weather systems, or landscape elements.
- Play/pause, volume, loading, mute, and timer states should be visible through world behavior whenever practical.
- Prefer tactile controls such as knobs, levers, valves, vents, lamps, panels, and gauges over generic dashboard widgets.
- Keep the first screen usable as the actual mixer, not a marketing landing page.
- Preserve accessibility: semantic buttons/ranges, keyboard paths, visible focus states, and text alternatives still matter even when controls look diegetic.
- Keep audio logic in `src/lib/audio` and let scene components consume that model instead of embedding Web Audio code in visual components.

## Implementation Notes

- `AudioContext` creation must remain behind browser/user-interaction boundaries. `Mixer.ensureContext()` currently guards SSR access.
- Sounds are lazy-loaded when first played. Avoid eagerly decoding all mp3 files unless there is a deliberate preload strategy.
- `handpan.mp3` is large, so be careful with bundle, preload, and test behavior around audio assets.
- The current sleep timer is hardcoded to 10 seconds in the page. Treat it as prototype behavior.
- Current tests are minimal. Add focused tests for pure logic such as timers, config discovery, and auth when those areas change.
- Demo routes under `src/routes/demo` are starter examples, not core product UX.

## Environment

```env
DATABASE_URL=local.db
ORIGIN=http://localhost:5173
NODE_ENV=development
```

`DATABASE_URL` is required because server hooks and demo auth code initialize the database layer.

## Agent Notes

- `AGENTS.md` is the canonical repository instruction file for Codex.
- `CLAUDE.md` remains as a compatibility shim for tools that still look for that filename.
- A global `figma` MCP server is configured in `~/.codex/config.toml`; run `codex mcp login figma` before design-to-code work if OAuth has not been completed yet.
