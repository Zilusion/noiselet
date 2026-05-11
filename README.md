# Noiselet

Noiselet is an atmospheric browser sound mixer shaped around a living, diegetic sound world. Instead of a plain dashboard of controls, sounds should eventually feel like physical objects in a small animated scene.

The current app is an early SvelteKit prototype with a working Web Audio API mixer, local sound assets, a sleep timer, and a simple card-based UI. The next major design direction is to replace that ordinary mixer surface with a world-like interface where rain, wind, instruments, and ambience are controlled through objects in the scene.

## Current Product Surface

- Main route: `src/routes/+page.svelte`
- Sound card component: `src/routes/sound-card.svelte`
- Audio mixer state: `src/lib/audio/mixer.svelte.ts`
- Individual sound model: `src/lib/audio/sound.svelte.ts`
- Sound asset discovery: `src/lib/audio/sounds.ts`
- Sleep timer state: `src/lib/audio/sleep-timer.svelte.ts`

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5
- **Language**: TypeScript strict mode
- **Styling**: Tailwind CSS v4
- **UI primitives**: shadcn-svelte/Bits UI local components
- **Audio**: Web Audio API
- **i18n**: Paraglide JS with inlang project config
- **Database**: SQLite with Drizzle ORM
- **Runtime adapter**: `@sveltejs/adapter-node`
- **Tests**: Vitest with browser test support configured

The database and auth code currently support demo routes only. The main Noiselet mixer does not use accounts or persistence yet.

## Getting Started

```bash
pnpm install
pnpm dev
```

The development server defaults to Vite's local host. For Docker development:

```bash
docker compose --profile development up --watch
```

## Environment

Copy `.env.example` to `.env`.

```env
DATABASE_URL=local.db
ORIGIN=http://localhost:5173
NODE_ENV=development
```

`DATABASE_URL` is required because the SvelteKit server hooks include auth/session plumbing, even though the product mixer does not currently use it.

## Useful Scripts

```bash
pnpm check
pnpm lint
pnpm test
pnpm format
pnpm paraglide:generate
```

Run `pnpm check` after Svelte or TypeScript changes. Run `pnpm paraglide:generate` after changing `messages/*.json`.

## Architecture Notes

`Mixer` owns the browser-only `AudioContext`, master gain node, global pause/resume state, and the initialized list of `Sound` instances. It guards `AudioContext` access so it is only created in the browser.

`Sound` owns one looping audio buffer, its gain node, loading state, playback state, and any load error. Sounds are loaded lazily when the user first plays them.

`getSoundConfigs()` discovers all `src/lib/assets/sounds/*.mp3` files through Vite's `import.meta.glob`. Labels are currently simple English fallbacks.

`SleepTimer` is a small rune-based state class used by the home page to pause the mixer after a countdown.

The current UI uses local shadcn-svelte/Bits UI primitives, but the intended product direction is a custom diegetic scene. Treat the card UI as scaffolding, not the final design language.

## Assets

Audio files live in `src/lib/assets/sounds`. SVG icons live in `src/lib/assets/icons`; several are not currently wired into the UI.

Large sound files are intentionally loaded on demand. Be careful with eager decoding or autoplay behavior because browsers require user interaction before audio playback.

## Demo Routes

The `src/routes/demo` area contains starter examples for Paraglide and auth:

- `/demo/paraglide`
- `/demo/lucia`
- `/demo/lucia/login`

These are not part of the Noiselet product surface yet. They can be kept as reference code or removed once the product direction no longer needs them.

## Quality Gates

```bash
pnpm check
pnpm lint
pnpm test
```

The current test suite is minimal and mostly verifies that the Vitest setup runs. Add focused tests when changing audio logic, timers, server auth, or reusable utilities.

## Product Direction

Noiselet should become a calm, tactile sound world:

- Sounds are represented by objects, machines, weather, or landscape elements.
- Controls should feel embedded in the scene rather than floating in an app dashboard.
- Visual state should follow audio state: playing, loading, muted, paused, and volume changes should have visible world feedback.
- The UI should remain accessible even when the presentation becomes more playful.

The immediate next step is to introduce a scene component around the existing audio model, then migrate individual sound controls from cards into diegetic objects one at a time.
