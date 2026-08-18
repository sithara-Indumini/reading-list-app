## Dev Plan: #4 — Update pages read

### Approach
- Add an `updatePagesRead(id, pagesRead)` function to `useBooks` that clamps the value to `[0, totalPages]` in state logic (not just the input's `max`), updates the matching book, and persists to `localStorage` immediately
- Add a numeric `<input type="number">` per book row in `BookList`, wired to `updatePagesRead`

### Files to change
- `src/hooks/useBooks.ts` — add `updatePagesRead` with clamping logic
- `src/components/BookList.tsx` — add pages-read numeric input per row
- `src/hooks/useBooks.test.ts` — tests for `updatePagesRead` (normal set, clamp above total, clamp below 0, persists, unknown-id no-op)
- `src/components/BookList.test.tsx` — test that changing the input fires the update

### Edge cases / risks
- Clamping must happen in state logic so it can't be bypassed (e.g. programmatic input, paste of an out-of-range value) — the `max`/`min` attributes are a UX hint only
- Negative or non-numeric input (e.g. empty string while typing) shouldn't crash — needs a safe parse before clamping
- Changing `pagesRead` should not affect `status` (independent of the finished-snap rule from #3)
