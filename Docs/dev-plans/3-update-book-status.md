## Dev Plan: #3 — Update a book's status

### Approach
- Add an `updateStatus(id, status)` function to `useBooks` that updates the matching book's status, snaps `pagesRead` to `totalPages` when the new status is `'finished'`, and leaves `pagesRead` untouched otherwise
- Switch `useBooks`'s internal state to be derived via a setter so `updateStatus` can produce a new array (immutable update) and re-render
- Persist the full array to `localStorage` immediately after each status change, reusing the existing `STORAGE_KEY`/serialization shape from #2
- Add a status `<select>` per book row in `BookList`, offering the three `Status` options (`to-read` / `reading` / `finished`), wired to call `updateStatus`

### Files to change
- `src/hooks/useBooks.ts` — add `updateStatus`, persist-on-change logic
- `src/components/BookList.tsx` — add status `<select>` per row
- `src/hooks/useBooks.test.ts` — tests for `updateStatus` (sets status, snaps pagesRead on finished, leaves pagesRead alone otherwise, persists to localStorage)
- `src/components/BookList.test.tsx` — test that changing the select fires the status update

### Edge cases / risks
- Changing status *away* from `'finished'` should not un-snap `pagesRead` (spec only requires snapping on finished, not reverting)
- Must not clobber the malformed-storage guard added in `useBooks` (#2) — persistence writes should reuse the same `STORAGE_KEY`/serialization shape
- Book not found by id (defensive no-op) — unlikely via UI but worth a guard
