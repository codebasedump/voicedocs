# VoiceDocs — Testing

Unit tests use [Vitest](https://vitest.dev). They cover the pure, security-relevant
logic (money/GST math, formatting, password hashing & JWT tokens) — no DB or network needed.

## Run
```bash
npm install        # picks up vitest (added to devDependencies)
npm test           # run once
npm run test:watch # watch mode while developing
```

## What's covered
| File | Tests |
|---|---|
| `tests/calc.test.ts` | GST 10% math, line amounts, rounding, sample invoice totals |
| `tests/format.test.ts` | AUD money formatting, initials, relative time |
| `tests/auth.test.ts` | bcrypt hash never stores plaintext + verifies; JWT sign/verify + rejects tampered tokens |

## Manual end-to-end checklist
1. **Auth** — `/signup` creates a user (check the `voicedocs.users` collection in Atlas); sign out + sign in works; visiting `/dashboard` while logged out redirects to `/login`.
2. **Generate** — pick a template → record → a real document is created, shown, and appears in **My documents** (and the `voicedocs.documents` collection).
3. **Security** — documents/clients only ever show the logged-in user's data; `/api/documents` returns **401** when logged out (try in an incognito window).
4. **Clients** — **Add** creates a client that persists after refresh.

## Optional: enable full AI
Without a key, generation uses a built-in mock (the app still works end-to-end).
For real Claude formatting, set `ANTHROPIC_API_KEY` in `.env.local` and restart.
