---
name: github-test-case-generator
description: >
  Use when a QA engineer or developer provides a GitHub issue number, a
  GitHub issue URL (e.g. https://github.com/<owner>/<repo>/issues/4), or a
  story title and asks to generate test cases, test scenarios, or QA
  coverage. Also triggers on phrases like "generate tests for issue #4",
  "write test scenarios for this story", "add test cases to this GitHub
  issue". Fetches the issue via the GitHub CLI, generates Positive,
  Negative, Functional, Non-Functional, and UX test cases, then appends
  them under a "## Test Scenarios" section in the issue body without
  altering any existing content.
---

# GitHub Test Case Generator

Adapted from Embla's `embla-test-case-generator` Jira skill for repos where
user stories live as GitHub Issues instead of Jira (see this project's ADR
decision 7, which chose GitHub Issues + Project board over Jira). Reads a
GitHub issue and appends a structured test case table under
`## Test Scenarios` in the issue body. Covers five test types: Positive,
Negative, Functional, Non-Functional, and UX.

Requires the GitHub CLI (`gh`) authenticated in this environment. If
unsure, run `gh auth status` before Step 2.

---

## Step 1 — Extract Issue Reference

Parse the user's message for:

- **Full GitHub URL**: `https://github.com/<owner>/<repo>/issues/<number>`
  - Extract: `<owner>/<repo>` — use as the `-R` flag value for every `gh`
    command below
  - Extract: the issue number
- **Issue number only** (e.g. `#4`, `issue 4`, `story 4`): use the current
  repo, inferred from `git remote get-url origin` in the working
  directory — don't ask the user to repeat the repo name if it's already
  derivable from the local checkout
- **Story title, no number given**: search with
  ```
  gh issue list --search "<title text>" --state all --json number,title,url
  ```
  If more than one plausible match comes back, list them and confirm with
  the user before proceeding — do not guess.

---

## Step 2 — Fetch the Issue

```
gh issue view <number> -R <owner>/<repo> --json title,body,url,labels
```

From the response, read and internalize:
- **title** — the story title
- **body** — user flow, acceptance criteria, business rules, and any
  existing sections (including a possible prior `## Test Scenarios`)
- **labels** — distinguish a user story from an epic or a process-checklist
  item (e.g. this project's `wednesday`/`thursday` labels). Epics and
  process items usually don't have acceptance criteria to test against —
  if the fetched issue doesn't read like a testable user story, say so and
  confirm with the user before generating anything rather than inventing
  criteria that aren't there.

If the issue isn't found, or `gh` reports an auth/permission error, tell
the user clearly and stop — never guess at a repo name or issue number to
paper over a failed lookup.

After successfully fetching the issue, inform the user:

> "Fetched **#<number>: <title>**. I will generate test cases across 5
> types: Positive, Negative, Functional, Non-Functional, and UX."

---

## Step 3 — Analyze the User Story

Before writing any test cases, map the story from every angle:

| Angle | What to explore |
|---|---|
| **Happy path** | Every valid success scenario and input variation |
| **Failure paths** | Rejections, errors, unavailable services |
| **Auth & access** | Unauthenticated users, insufficient permissions, expired sessions |
| **Data & inputs** | Missing required fields, invalid formats, boundary values |
| **UI/UX behaviour** | Message display, element visibility, loading states, responsiveness |
| **Performance** | Response times, load under concurrent users, large data sets |
| **State changes** | Double submission, duplicate actions, re-visiting completed flows |
| **External services** | APIs, SSO, payment gateways — success, failure, and timeout |
| **Non-functional** | Security, accessibility, compatibility across browsers/devices |

For a frontend-only app with no backend and no auth (check the project's
ADR/CLAUDE.md first — this is exactly that kind of project), several rows
won't apply (Auth & access, External services). Skip them, but say so
explicitly in the summary at the end rather than silently omitting them —
a reviewer should be able to tell the gap was a deliberate scope call, not
an oversight.

---

## Step 4 — Write the Test Cases

Assign sequential IDs: `TC-01`, `TC-02`, …

Classify each case as exactly one of:
- **Positive** — valid inputs, expected success scenarios and happy paths
- **Negative** — invalid inputs, failures, rejections, unauthorized access
- **Functional** — verifies the feature behaves per business/acceptance
  requirements
- **Non-Functional** — performance, security, accessibility, compatibility
- **UX** — usability, layout, copy, loading states, visual feedback

**Table format (use exactly this):**

| ID | Type | Title | Preconditions | Steps | Expected Result |
|---|---|---|---|---|---|
| TC-01 | Positive | Short descriptive title | What must be true before test | 1. Step one 2. Step two 3. Step three | Observable outcome |
| TC-02 | Negative | Short descriptive title | What must be true before test | 1. Step one 2. Step two | Observable outcome |

**Column rules:**
- **ID**: `TC-01`, `TC-02`, … sequential across all types
- **Type**: exactly `Positive`, `Negative`, `Functional`, `Non-Functional`,
  or `UX`
- **Title**: 5–8 words describing what is being tested
- **Preconditions**: one sentence; what must be true before the test
  starts
- **Steps**: numbered inline, e.g. `1. Do X 2. Do Y 3. Observe Z` —
  concise
- **Expected Result**: the observable outcome the tester verifies — be
  specific

Aim for at least 2–3 cases per applicable type. Generate every case that
covers a distinct risk or scenario — completeness matters more than
brevity.

**If a Playwright suite already exists for this story** (check
`tests/e2e/` for a spec matching this issue's number, per this project's
naming convention), cross-reference it: mark which generated test cases
are already automated versus still manual-only, e.g. append
"*(automated: tests/e2e/4-update-pages-read.spec.ts)*" to the Expected
Result column where applicable. Don't skip generating the case just
because it's automated — the table is meant to be a complete QA map, not
just a to-do list.

---

## Step 5 — Handle Existing Test Scenarios Section

Before updating, check whether the fetched `body` already contains a
`## Test Scenarios` heading.

- **Not present** → proceed directly to Step 6.
- **Already present** → inform the user:
  > "A '## Test Scenarios' section already exists in this issue. Should I
  > **replace** the existing table with the new one, or **append** the
  > new cases below?"
  Wait for their answer before continuing.

---

## Step 6 — Update the GitHub Issue Body

Construct the updated body:

```
<existing body content — verbatim, unchanged>

---

## Test Scenarios

<generated table>
```

Write the full updated body to a temporary file first — this avoids
shell-escaping problems with multi-line markdown tables and pipe
characters — then call:

```
gh issue edit <number> -R <owner>/<repo> --body-file /tmp/updated-issue-body.md
```

**Critical:** never truncate, rewrite, or omit any part of the existing
body. The only change is appending the separator and new
`## Test Scenarios` section at the end.

---

## Step 7 — Confirm

After the update succeeds, reply with:

1. A direct link: `https://github.com/<owner>/<repo>/issues/<number>`
2. A breakdown by type, e.g.:
   > "Successfully added **16 test cases** to #4:
   > - Positive: 3
   > - Negative: 4
   > - Functional: 3
   > - Non-Functional: 3
   > - UX: 3
   > (Auth & access and External services skipped — this app has no
   > backend or auth, per ADR decision 3.)"

If the `gh` command fails, show the error and tell the user what to check
(`gh auth status`, repo access, whether the issue number/repo is correct).

---

## Quick Reference

| Command | When |
|---|---|
| `gh issue view` | Fetch issue details (always first) |
| `gh issue list --search` | Only if the user provided a title instead of a number |
| `gh auth status` | If fetch/edit fails with an auth error |
| `git remote get-url origin` | To infer `<owner>/<repo>` if not given explicitly |
| `gh issue edit --body-file` | Append test cases under `## Test Scenarios` |
