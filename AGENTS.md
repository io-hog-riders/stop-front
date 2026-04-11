# AGENTS.md

## Project Snapshot

- This repo is a minimal SvelteKit 2 + Svelte 5 frontend scaffold (`src/routes/+page.svelte` is the only page).
- TypeScript is strict and project config extends generated SvelteKit types from `.svelte-kit` (`tsconfig.json`).
- Styling is Tailwind CSS v4 via Vite plugin + CSS directives, not a standalone Tailwind config file.

## App Structure

- The root route redirects into the onboarding flow, and `/map` is assembled as a full-screen client route from `TopAppBar`, `SideNavBar`, `InteractiveMap`, and `MobileNavigation`.
- Shared UI is grouped by feature under `src/lib/components` (`map/`, `sidebar/`, `welcome/`, `welcome/steps/`, `sidebar/sidebar-tabs/`); keep new components in the same feature folder rather than flattening them.
- Shared route/data types live in `src/lib/types/mapTypes.ts`; reuse those types instead of re-declaring request and response shapes in pages or components.

## Architecture and Data Flow

- Route-driven UI lives under `src/routes`; root shell is `src/routes/+layout.svelte` and page content is slotted via `{@render children()}`.
- Global styles are loaded from the root layout (`import './layout.css'`), so shared styling changes should usually start there.
- Shared code/assets should go under `src/lib` and be imported via `$lib/...` (example: favicon import in `src/routes/+layout.svelte`).
- There are currently no local SvelteKit API route files in `src/routes`; the planner UI posts directly to an external/plumbed endpoint from `src/routes/map/+page.svelte`.
- The planner endpoint path is easy to drift: `README.md` documents `/api/v1/route/plan`, while the current map page posts to `/test/temp/route/plan`. Verify the authoritative contract before editing either side.
- Adding server logic should follow SvelteKit file conventions (`+page.server.ts`, `+server.ts`, etc.).

## Critical Workflows

- Install deps with Bun (`bun install`), matching the lockfile `bun.lock`.
- Dev server: `bun run dev` (or `npm run dev` if Bun is unavailable).
- Type/svelte checks: `bun run check` (runs `svelte-kit sync` first).
- Linting: `bun run lint` (Prettier check + ESLint in one command).
- Formatting: `bun run format`.
- Production build/preview: `bun run build`, then `bun run preview`.
- No test framework is configured in `package.json`; do not assume Vitest/Playwright exists.

## Project-Specific Conventions

- Svelte 5 runes mode is explicitly forced for project files in `svelte.config.js` (`compilerOptions.runes`), except files inside `node_modules`.
- Keep route components in rune-friendly style (example already uses `$props()` in `+layout.svelte`).
- ESLint uses flat config (`eslint.config.js`) with TS + Svelte presets; `.gitignore` is imported into lint ignores.
- `no-undef` is intentionally disabled for TS files per `typescript-eslint` guidance in the config comments.

## Integrations and Tooling Notes

- Vite plugins are minimal: `tailwindcss()` then `sveltekit()` in `vite.config.ts`.
- Tailwind plugins are enabled in CSS (`src/routes/layout.css`) via `@plugin '@tailwindcss/forms'` and `@plugin '@tailwindcss/typography'`.
- Deployment target is currently `@sveltejs/adapter-auto`; switch adapter in `svelte.config.js` for fixed hosting targets.
- `GEMINI.md` contains additional Gemini/MCP assistant workflow expectations if your agent runtime supports those tools.

## When Making Changes

- Prefer small, route-scoped changes first (`src/routes`) before introducing new top-level abstractions.
- If adding shared utilities/components, place them in `src/lib` and import via `$lib` alias.
- Run `bun run check` and `bun run lint` before finalizing edits.
- If introducing new tooling (tests, adapters, env handling), update this file and `README.md` together.
