# Reading List — Exercise Brief & User Guide

This document captures the requirements for the take-home exercise: build a small frontend-only reading list app, and demonstrate an AI-assisted development workflow around it across a two-day check-in cycle.

## 1. Overview

Build a small **frontend-only** reading list application. The point of the exercise is not the UI — it's to evaluate how the project is set up for AI-assisted work and how Claude is driven through a working day, from planning through review to shipping.

## 2. Application Requirements

### 2.1 Functional Scope

- Track books with a status: **to read**, **reading**, or **finished**.
- Track **pages read** per book, out of the book's total page count.
- Provide a **filter by status** (to read / reading / finished).

### 2.2 Business Rule

- Pages read can never exceed the book's total page count.
- Marking a book as **finished** automatically sets pages read to the book's total.

### 2.3 Constraints

- **Mock data only** — no backend, no persistence layer beyond the frontend.
- **No login, no roles** — single user, no auth of any kind.
- UI polish is explicitly **not** the evaluation criterion.

## 3. Project & Repository Setup

- Initialize the project in a **public GitHub repository**, created specifically for this exercise.
- Since the repo is public, **disable outside contributions** (e.g., restrict who can open PRs / require review before merge) before the Thursday PR workflow step.

## 4. Wednesday Check-In

The Wednesday session walks through the project setup step by step. The following must be in place:

### 4.1 Project Initialization
- Public repo exists.
- README that gets someone running the app in **under 5 minutes**.

### 4.2 CLAUDE.md
- Specific to this project: stack, commands, conventions, and what Claude should **never** do here.
- Treated as a living document — **updated throughout the day**, not written once and forgotten.

### 4.3 Skills
- Look for existing skills with a good reputation first — check Embla's own skills, then well-known public ones.
- Only write a custom skill if nothing existing fits.
- Be ready to explain **why** a custom skill was necessary, if one was written.

### 4.4 Settings
- `settings.json` configured deliberately, not left at defaults.
- Be ready to explain the **settings hierarchy**: user / project / local.

### 4.5 Context Management
Be ready to demonstrate, with concrete examples from the day's work:
- Where **plan mode** was used vs. where Claude was simply let go.
- A **fresh session** vs. **continuing** an existing one.
- Use of **`/clear`** vs. **`/compact`**.
- At least one **subagent** used, and why.

### 4.6 Information (Project Knowledge)
- Project knowledge provided to Claude to work from: README, ADR, product notes.
- Kept **separate** from the CLAUDE.md instructions (CLAUDE.md = how to work; this = what the project is).

### 4.7 Planned Tasks
- An **epic with user stories**, created **with Claude** (not typed by hand).
- The task board must **match what was actually done** — kept in sync, not aspirational.

### 4.8 Data Note (in the ADR)
- A few lines documenting what personal data the app would touch (if any) and what GDPR would require as a result.

### 4.9 Progress Demo
- Show whatever app progress exists at check-in time — a skeleton is acceptable.
- Expect **one small change request** from the reviewers to complete before Thursday.

## 5. Thursday Demo

Run the finished app and walk through what changed since Wednesday, including the Wednesday change request. In addition to everything above:

### 5.1 PR Workflow
- Nothing is merged straight to `main`.
- At least one PR opened and **reviewed by AI**, with **one comment that was actually acted on**.
- Outside contributions on the public repo must be turned off.

### 5.2 QA
- **Two Playwright tests**:
  - One normal-case test.
  - One edge-case test.
- Be ready to explain exactly what each test checks.

### 5.3 Session Log
- Export the session log using the **AI Hub script** (`AI-SDLC Documents > Session-Export`).
- Commit the exported log into the repo.

## 6. Ground Rules

- The brief is **intentionally incomplete**. Missing details are decisions to make independently.
- Every such decision — and the alternatives **not** chosen — must be recorded in the **ADR**.
- No clarification requests during the day; working through ambiguity independently is part of what's being evaluated.
- Work is done **independently** (solo), without external clarification from the reviewers.
- Anything requested as a Wednesday fix **must** be done and working by the Thursday demo.

## 7. Quick Reference Checklist

| Area | Wednesday | Thursday |
|---|---|---|
| Repo | Public, initialized, README (<5 min setup) | Outside contributions disabled |
| CLAUDE.md | Project-specific, living doc | Kept up to date |
| Skills | Reused where possible; custom only if justified | — |
| Settings | `settings.json` deliberate, hierarchy understood | — |
| Context mgmt | Plan mode, sessions, `/clear`/`/compact`, subagent examples ready | — |
| Docs | README, ADR, product notes (separate from CLAUDE.md) | ADR includes GDPR/data note |
| Planning | Epic + user stories via Claude, board matches reality | Board still matches reality |
| App | Skeleton acceptable | Finished, change request applied |
| PR workflow | — | ≥1 PR, AI-reviewed, ≥1 comment acted on |
| QA | — | 2 Playwright tests (normal + edge case) |
| Session log | — | Exported via AI Hub, committed to repo |
