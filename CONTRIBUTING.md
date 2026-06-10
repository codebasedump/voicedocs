# Contributing to VoiceDocs

Thanks for your interest! This is a proprietary project (see [LICENSE](LICENSE)), but the
workflow below keeps the codebase healthy for maintainers and approved contributors.

## Prerequisites
- Node.js **20+**
- A MongoDB connection string in `.env.local` (see [`.env.local.example`](.env.local.example))

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Before you open a PR
Every change must pass the same checks CI runs:
```bash
npm run lint        # ESLint — 0 errors
npm run typecheck   # tsc --noEmit — 0 errors
npm test            # Vitest — all green
npm run build       # production build succeeds
```

## Branching & commits
- Branch off `main`: `feat/…`, `fix/…`, `chore/…`
- Use clear, conventional-style commit messages (`feat:`, `fix:`, `docs:`, `refactor:`…)
- Keep PRs focused and small where possible.

## Code style
- TypeScript, no `any` — type external APIs explicitly.
- Server components fetch data; client components (`"use client"`) handle interactivity.
- All data APIs **must** be scoped to the authenticated user.
- Tailwind for styling; use the semantic design tokens (`bg-surface`, `text-ink`, `border-line`…).

## Tests
Add/adjust tests under `tests/` for any new pure logic (money math, formatting, auth, validation).
