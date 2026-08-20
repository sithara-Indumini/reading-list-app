# Reading List App — Epics, User Stories & Process Checklist

Source design: `Docs/adr/0001-reading-list-app-decisions.md`.
This content is the source for GitHub Issues + a Project board (see
ADR decision 7).

**Status:** filed. Repo: https://github.com/sithara-Indumini/reading-list-app
Project board: https://github.com/users/sithara-Indumini/projects/1
(columns Todo / In Progress / Done).

---

## Epic 1 — Track Reading Progress ([#1](https://github.com/sithara-Indumini/reading-list-app/issues/1))

Lets the reader see their books and keep status/progress accurate as
they read. Covers the brief's business rule (2.2) and is the source of
both required Playwright tests (2.2 normal case + edge case).

### Story 1.1 — View my book list ([#2](https://github.com/sithara-Indumini/reading-list-app/issues/2))
As a reader, I want to see all my books with their title, author,
status, and pages read out of total, so that I can get an overview of
my reading at a glance.

**Acceptance criteria**
- List renders every seeded book with title, author, status, and
  `pagesRead / totalPages`.
- List loads from `localStorage` if present, otherwise seeds mock data
  on first load.

### Story 1.2 — Update a book's status ([#3](https://github.com/sithara-Indumini/reading-list-app/issues/3))
As a reader, I want to change a book's status between to read /
reading / finished, so that my list reflects where I actually am with
each book.

**Acceptance criteria**
- Each book has a status control offering the three statuses.
- Setting status to "finished" automatically sets `pagesRead` to
  `totalPages` (business rule, section 2.2).
- Changing status does not otherwise alter `pagesRead`.
- Change persists to `localStorage` immediately.

### Story 1.3 — Update pages read ([#4](https://github.com/sithara-Indumini/reading-list-app/issues/4))
As a reader, I want to record how many pages I've read in a book, so
that I can track my progress within it.

**Acceptance criteria**
- Each book has a numeric input for pages read.
- The value can never be set below 0 or above the book's `totalPages`
  (business rule, section 2.2) — enforced in state logic, not just the
  input's `max` attribute.
- Change persists to `localStorage` immediately.
- **Maps to the two required Playwright tests:** normal case = marking
  a book finished snaps pages read to total; edge case = attempting to
  enter pages read above total is rejected/clamped.

---

## Epic 2 — Filter by Status ([#5](https://github.com/sithara-Indumini/reading-list-app/issues/5))

### Story 2.1 — Filter my list by status ([#6](https://github.com/sithara-Indumini/reading-list-app/issues/6))
As a reader, I want to filter my book list to a single status (to
read / reading / finished) or see all of them, so that I can focus on
what's relevant right now (e.g., just what I'm currently reading).

**Acceptance criteria**
- A filter control offers All / To Read / Reading / Finished.
- Selecting a status shows only books with that status; "All" shows
  every book.
- Filter selection does not need to persist across reloads.

---

## Process Checklist (not user stories — exercise deliverables)

These map directly to the brief's Quick Reference Checklist (section
7) and are tracked as plain GitHub Issues (labeled `wednesday` /
`thursday`), not user stories, since they describe exercise process
rather than end-user value.

### Wednesday
- [x] Public GitHub repo created for this exercise ([#7](https://github.com/sithara-Indumini/reading-list-app/issues/7), closed)
- [x] README that gets someone running the app in under 5 minutes ([#8](https://github.com/sithara-Indumini/reading-list-app/issues/8), closed)
- [x] `CLAUDE.md` written (project-specific: stack, commands,
      conventions, what Claude should never do) — living doc, updated
      through the day ([#9](https://github.com/sithara-Indumini/reading-list-app/issues/9), closed)
- [ ] Existing skills checked/reused before writing any custom skill;
      rationale ready if a custom one was needed ([#10](https://github.com/sithara-Indumini/reading-list-app/issues/10))
- [ ] `settings.json` configured deliberately; settings hierarchy
      (user/project/local) understood and explainable ([#11](https://github.com/sithara-Indumini/reading-list-app/issues/11))
- [ ] Context-management examples ready: plan mode vs. let-go, fresh
      vs. continued session, `/clear` vs. `/compact`, ≥1 subagent use
      and why ([#12](https://github.com/sithara-Indumini/reading-list-app/issues/12))
- [x] Project knowledge (README, ADR, product notes) provided
      separately from `CLAUDE.md` ([#13](https://github.com/sithara-Indumini/reading-list-app/issues/13), closed)
- [x] ADR includes the GDPR/personal-data note (done — see ADR 0001;
      [#14](https://github.com/sithara-Indumini/reading-list-app/issues/14) closed)
- [x] Epic + user stories created with Claude, board matches reality
      (this doc → GitHub Issues/Project) ([#15](https://github.com/sithara-Indumini/reading-list-app/issues/15), closed)
- [ ] App progress demoed (skeleton acceptable) ([#16](https://github.com/sithara-Indumini/reading-list-app/issues/16))
- [ ] One small change request received from reviewers, logged as a
      follow-up issue ([#17](https://github.com/sithara-Indumini/reading-list-app/issues/17))

### Thursday
- [ ] Wednesday's change request completed and working ([#18](https://github.com/sithara-Indumini/reading-list-app/issues/18))
- [x] Outside contributions disabled on the public repo ([#19](https://github.com/sithara-Indumini/reading-list-app/issues/19), closed)
- [x] ≥1 PR opened, reviewed by AI, ≥1 comment actually acted on ([#20](https://github.com/sithara-Indumini/reading-list-app/issues/20), closed)
- [x] Two Playwright tests written and passing: one normal case, one
      edge case (see Story 1.3) ([#21](https://github.com/sithara-Indumini/reading-list-app/issues/21), closed)
- [x] Session log exported via the AI Hub script
      (`AI-SDLC Documents > Session-Export`) and committed to the repo ([#22](https://github.com/sithara-Indumini/reading-list-app/issues/22))
- [x] Board still matches what was actually done ([#23](https://github.com/sithara-Indumini/reading-list-app/issues/23), closed)
