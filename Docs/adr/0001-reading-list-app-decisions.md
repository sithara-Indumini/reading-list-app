# ADR 0001: Reading List App — Core Design Decisions

**Status:** Accepted
**Date:** 2026-08-18
**Context doc:** `Docs/user-guide.md` (exercise brief)

## Background

The brief (`Docs/user-guide.md`) is intentionally incomplete. Per the
ground rules (section 6), missing details are decisions to make
independently, and every decision — plus the alternatives not chosen —
must be recorded here.

## Decisions

### 1. Frontend stack: React + Vite + TypeScript

Chosen for fast scaffolding, a large ecosystem of reusable AI-assisted
workflow examples/skills (favoring "reuse before writing custom," per
section 4.3), and straightforward Playwright integration.

**Alternatives not chosen:**
- Next.js (App Router) — rejected, its SSR/routing conventions solve
  problems this frontend-only, single-page, mock-data app doesn't have.
- Vue 3 + Vite — viable, but a smaller ecosystem of existing
  AI-workflow skills to point to.
- SvelteKit — lightest runtime, but the smallest ecosystem of existing
  skills, which cuts against the "reuse before custom" requirement.

### 2. No add/delete-book UI — scope held to the literal functional spec

Section 2.1 of the brief asks for exactly three things: status
tracking, pages-read tracking, and filter-by-status. It does not ask
for creating or removing books. The app ships with a fixed, seeded
mock list; only status and pages-read are editable.

**Alternative not chosen:** full CRUD (add/edit/delete books). Rejected
under YAGNI — it adds surface area, edge cases, and test burden the
brief never asked for, and "UI polish is explicitly not the evaluation
criterion" (section 2.3).

### 3. Persistence: `localStorage`, not in-memory-only

State (status, pages read) is written through to the browser's
`localStorage` on every mutation, and seeded once if empty. This is
still "frontend-only" per section 2.3 (no backend, no server
persistence layer) — the browser's local storage is not a backend.

**Alternative not chosen:** in-memory-only state that resets on
reload. Rejected because it produces a weaker demo (state visibly
"forgets" itself) and skips a legitimate edge case worth testing
(reload mid-session, confirm progress survived).

### 4. Business rule interaction: pages-read edits do not auto-change status

The brief specifies one directional rule: marking a book "finished"
sets `pagesRead = totalPages`. It does not specify the reverse
(raising `pagesRead` above 0 auto-flipping status from "to read" to
"reading").

**Decision:** status and pages-read are edited independently; only the
finished → pages-read direction is automatic.

**Alternative not chosen:** auto-transition status to "reading" the
moment `pagesRead > 0`. Rejected for predictability — it would mean a
user could never manually record partial progress on a book still
marked "to read" (e.g., skimming an excerpt) without the app silently
overriding their status choice.

### 5. `pagesRead` is clamped at the point of mutation, not just in the UI

The constraint `0 <= pagesRead <= totalPages` is enforced in the
state-update logic itself (not only via `<input max>` in the DOM), so
it holds regardless of entry path. This is the one normal-case /
edge-case pair the two required Playwright tests exercise directly.

### 6. State management: local component state, no external store

`useState`/`useReducer` at the app root, backed by `localStorage`. A
mock list of ~8 books doesn't justify Zustand/Redux/Context-based
architecture.

### 7. Task tracking: GitHub Issues + Project board

Epics and user stories (section 4.7) are filed as GitHub Issues on the
project's own repo, organized on a GitHub Project board, rather than
Jira or a static `TASKS.md`. This keeps the "planned tasks" artifact
next to the code for a reviewer to inspect directly, with no extra
tool/auth dependency beyond the repo itself.

**Alternatives not chosen:**
- Jira (via the `embla-core:jira` skill) — matches Embla's internal
  tooling conventions, but this is a throwaway exercise repo; adding a
  Jira project for it is unjustified overhead.
- `TASKS.md` in-repo — zero setup, but no Done/In-Progress swimlanes
  and weaker to demo live as a "board."

### 8. localStorage corruption handling: whole-array validation, not per-record repair

`useBooks.ts`'s `isBookArray` validates the entire stored array as one
unit. A single malformed record fails validation for the whole array,
discarding all persisted data and re-seeding the mock list — not
field-by-field repair of just the bad record.

**Alternative not chosen:** per-record validation that keeps good
records and drops only the malformed one. Rejected because it adds
real complexity (partial-repair logic, deciding what a "recoverable"
vs "unrecoverable" record looks like) for a mock-data, single-user,
no-backend app where the cost of a full re-seed is trivial — the user
loses some manually-entered progress, but nothing catastrophic, and
the app never ends up in a half-valid state.

Surfaced while writing Playwright coverage for Story 1.1 (TC-06) — the
generated test case had assumed graceful field-level degradation; the
test and issue #2 were corrected to match actual behavior once this
was found.

### 9. `isBookArray` load-time validation, not clamping, closes the gap in decision 5

Decision 5 states the `0 <= pagesRead <= totalPages` clamp "holds
regardless of entry path" because it's enforced in state-update logic.
That was true for `updateStatus`/`updatePagesRead`, but not for the
`localStorage` load path: `isBookArray` originally only checked
`typeof pagesRead === 'number'` and `typeof status === 'string'`, so a
stored record with `pagesRead: 9999` or `status: "banana"` loaded
straight into state unclamped and unvalidated.

The fix is validation, not clamping: `isBookArray` now checks `status`
against the `Status` union and requires `pagesRead` to be an integer
within `[0, totalPages]`. A record that fails either check fails
validation for the whole array (per decision 8) and the app re-seeds,
rather than coercing the bad value into range. So the invariant now
holds for the load path too, but via a different mechanism than
decision 5 describes (reject-and-reseed vs. clamp-in-place) — worth
keeping distinct rather than folding into decision 5, since a future
reader relying on decision 5 alone would expect out-of-range load-path
values to be silently clamped, when they're actually rejected
wholesale.

## Data & GDPR Note (section 4.8)

The app has no accounts, no authentication, and no server component of
any kind — all state (the book list, statuses, pages read) lives
entirely in the end user's own browser via `localStorage`.

Reasoning:
- No personal data is collected about *the user themselves* (no name,
  email, account, or identifier is ever requested or stored).
- The book/reading data entered is not transmitted anywhere — there is
  no backend to receive it, and no third-party processor is involved.
- Because nothing is collected, stored server-side, or shared, there
  is no processing of personal data by an app operator, and GDPR's
  controller/processor obligations do not attach to this app as built.

If a future version added accounts, sync, or analytics, this note
would need revisiting — at that point the app would begin collecting
personal data and GDPR obligations (lawful basis, data minimization,
right to erasure, etc.) would apply and require their own ADR.

## Data Model

```ts
type Status = 'to-read' | 'reading' | 'finished'

interface Book {
  id: string
  title: string
  author: string
  totalPages: number
  pagesRead: number
  status: Status
}
```

Seeded with ~6–8 mock books spanning all three statuses.
