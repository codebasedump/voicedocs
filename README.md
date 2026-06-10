<div align="center">

# VoiceDocs 🎙️ → 📄

### Speak it. Get the document.

AI-powered voice-to-document platform for Australian small businesses.

[![CI](https://github.com/codebasedump/voicedocs/actions/workflows/ci.yml/badge.svg)](https://github.com/codebasedump/voicedocs/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

</div>

---

Speak for 30 seconds and get a finished, professionally formatted document — tax invoice,
quote, NDIS progress note, clinical SOAP note, meeting summary, report, email or contract —
ready to download or send. **Not a transcript: a finished document.**

Built in Leeton, NSW by **Hoffstee**.

## ✨ Why
Tradies, NDIS providers, allied-health and small businesses lose 5–10 hours a week to
routine paperwork. Voice-transcription tools only give you text; VoiceDocs gives you the
**finished, Australian-compliant document** (ABN, GST, NDIS formats) in about 60 seconds.

## 🧱 Tech stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 — custom design system, light/dark, Poppins |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (httpOnly cookie) + bcrypt |
| AI | Claude (Anthropic) formatting · browser Web Speech API transcription |
| Tooling | ESLint, Vitest, GitHub Actions CI |

## 🏗️ Architecture
```
Browser (PWA)  ──►  Next.js App Router
                      ├─ Server Components ──► MongoDB (Mongoose)  [data, scoped per user]
                      └─ Route Handlers (/api/*)
                             ├─ /api/auth/*        JWT session in httpOnly cookie
                             ├─ /api/documents/*   CRUD + /generate (Claude → document)
                             ├─ /api/clients/*     CRUD
                             └─ /api/me            profile / business settings
```

## 🚀 Getting started
```bash
npm install
cp .env.local.example .env.local   # fill in MONGODB_URI + JWT_SECRET
npm run dev                         # http://localhost:3000
```

### Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run unit tests (Vitest) |

More detail: [`BACKEND_SETUP.md`](BACKEND_SETUP.md) · [`WORKFLOW.md`](WORKFLOW.md) ·
[`TESTING.md`](TESTING.md) · [`SECURITY.md`](SECURITY.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md)

## 🔒 Security
All data APIs are session-scoped per user; secrets live only in `.env.local` (git-ignored).
See [`SECURITY.md`](SECURITY.md) to report a vulnerability.

## 🗺️ Status & roadmap
**Working:** auth, voice → AI → saved document, per-user secured APIs, dashboard / documents /
clients, business-profile settings that flow into invoices, premium marketing site, CI.

**Roadmap:** PDF/DOCX export · Stripe billing & usage limits · email/SMS delivery ·
custom template builder · PWA (offline/install) · Xero/MYOB integrations · OAuth.

## 📄 License
Proprietary — © 2026 Hoffstee. See [LICENSE](LICENSE).

---
<div align="center"><sub>🤖 Built with <a href="https://claude.com/claude-code">Claude Code</a></sub></div>
