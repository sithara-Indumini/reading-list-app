## Dev Plan: #2 — View my book list

### Approach
- Scaffold Vite + React + TS in the repo root (`npm create vite@latest . -- --template react-ts`), since `Docs/`/`.claude/`/`.git` already exist there
- Define `Book`/`Status` types per ADR 0001's data model
- Add a mock seed of ~6–8 books spanning all three statuses
- Add a small load/seed hook: read from `localStorage`, seed once if empty, persist on writes
- Add a `BookList` component rendering title, author, status, `pagesRead / totalPages`, wired into `App`

### Files to change
- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` — scaffold
- `src/types.ts` — `Book`, `Status`
- `src/data/mockBooks.ts` — seed data
- `src/hooks/useBooks.ts` — localStorage load/seed
- `src/components/BookList.tsx` — the list view
- `src/App.tsx` — wiring

### Edge cases / risks
- Scaffolding into a non-empty directory (Docs/.claude/.git already present) — Vite may need explicit non-interactive flags to avoid an overwrite prompt
- Seed logic must only run once (don't clobber existing `localStorage` on every load)
