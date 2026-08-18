## Dev Plan: #6 — Filter my list by status

### Approach
- Add local filter state to `App` (`useState<Status | 'all'>('all')`) — this is transient UI state, doesn't need to live in `useBooks` or persist
- Add a filter `<select>` in `App` offering All / To Read / Reading / Finished
- Derive the filtered list in `App` (`books.filter(...)` when not `'all'`) and pass that to `BookList` instead of the raw `books` array

### Files to change
- `src/App.tsx` — add filter state, filter control, derive filtered list
- `src/App.test.tsx` (new) — test that selecting a status filters the rendered list, and "All" shows everything

### Edge cases / risks
- Filtering must not mutate `books` from `useBooks` — keep it a derived read, so status/pages-read updates on a filtered-out book still work correctly if the filter later changes back
- Empty result set (e.g. no books finished) should render an empty list, not an error
