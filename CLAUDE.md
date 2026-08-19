# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is a take-home exercise: a small **frontend-only** reading list app. The point of
the exercise is not the UI polish — it's demonstrating an AI-assisted development
workflow (planning → review → shipping) around a deliberately small app. See
`Docs/user-guide.md` for the full brief and `Docs/adr/0001-reading-list-app-decisions.md`
for every non-obvious design decision and the alternatives that were rejected — read the
ADR before assuming a gap (no add/delete UI, no backend, no global store, etc.) is
unfinished work rather than a deliberate scope call.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck (`tsc -b`) then production build
- `npm run lint` — oxlint
- `npm test` — run the full vitest suite once
- `npm run test:watch` — vitest in watch mode
- Run a single test file: `npx vitest run src/hooks/useBooks.test.ts`
- Run a single test by name: `npx vitest run -t "clamps to totalPages"`
- `npm run test:e2e` — run the Playwright suite (`tests/e2e/*.spec.ts`); starts the dev
  server automatically via `playwright.config.ts`

CI (`.github/workflows/ci.yml`) runs lint, build, `npm test`, and `npm run test:e2e` on
every PR/push to `main`, plus manual `workflow_dispatch`. It runs on Node 24 — Node 20
is incompatible with jsdom/undici in this stack, so don't downgrade the CI node-version.

## Architecture

Everything lives under `src/`, single-page, no router:

End-to-end tests live in `tests/e2e/`, one spec file per story (e.g.
`4-update-pages-read.spec.ts` for Story 1.3, `6-filter-by-status.spec.ts` for Story 2.1).

- `App.tsx` — owns the status filter (`'all' | Status`) and renders `BookList`.
- `hooks/useBooks.ts` — the only source of truth for book state. Owns loading/seeding
  from `localStorage`, and the two mutations (`updateStatus`, `updatePagesRead`). Every
  mutation writes through to `localStorage` synchronously inside the same `setBooks`
  updater — don't split persistence from state update into a separate effect.
- `components/BookList.tsx` — pure presentational list; takes `books` plus the two
  change callbacks as props. Filtering happens in `App`, not here.
- `data/mockBooks.ts` — the fixed seed data. There is no create/delete UI (by design,
  see ADR decision 2), so this is the only place book records originate.
- `types.ts` — the `Status` union and `Book` interface referenced everywhere else.

Key business rules (ADR decisions 4–5), enforced in `useBooks.ts` state logic, not just
in the DOM/JSX:
- Setting status to `'finished'` snaps `pagesRead` to `totalPages`. No other status
  transition touches `pagesRead`.
- `pagesRead` is clamped to `[0, totalPages]` on every write, regardless of entry path.

State management is deliberately just `useState` + `localStorage` (ADR decision 6) — do
not introduce Context, Redux, or Zustand for this app's scope.

## Planning & task tracking

Epics/stories/process checklist live in `Docs/epics-and-stories.md`, mirrored onto
GitHub Issues + a Project board (not Jira) — see ADR decision 7. When picking up planned
work, check that doc and keep the board in sync with what's actually done rather than
adding parallel tracking elsewhere.
