# Reading List App

A small frontend-only app for tracking books you're reading. There's no
add or delete UI — the list is seeded from fixed sample data by design
(see ADR decision 2) — but you can mark each book as to-read, reading, or
finished, and track pages read as you go. Everything is stored in your
browser's `localStorage` — there's no backend and no login.

## Prerequisites

- **Node 24** (matches CI)

## Getting started

```bash
git clone <repo-url>
cd READ_LIST
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173) and you're up
and running.

If you also want to run the end-to-end tests, there's one extra one-time
step people tend to miss:

```bash
npx playwright install
```

This downloads the browser binaries Playwright needs; without it,
`npm run test:e2e` will fail on a clean machine.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck (`tsc -b`) then production build |
| `npm run lint` | Run oxlint |
| `npm test` | Run the full vitest suite once |
| `npm run test:watch` | Run vitest in watch mode |
| `npx vitest run src/hooks/useBooks.test.ts` | Run a single test file |
| `npx vitest run -t "clamps to totalPages"` | Run a single test by name |
| `npm run test:e2e` | Run the Playwright e2e suite (starts the dev server automatically) |

## Project docs

- [`Docs/user-guide.md`](Docs/user-guide.md) — the full project brief
- [`Docs/adr/0001-reading-list-app-decisions.md`](Docs/adr/0001-reading-list-app-decisions.md) — the design decisions behind this app and the alternatives that were rejected
- [`Docs/epics-and-stories.md`](Docs/epics-and-stories.md) — epics, stories, and the process checklist
