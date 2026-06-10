# VoiceDocs 🎙️ → 📄

> **Speak it. Get the document.**

An AI-powered voice-to-document platform for Australian small businesses. Speak for 30
seconds and get a finished, professionally formatted document — tax invoice, quote, NDIS
progress note, clinical SOAP note, meeting summary, report, email or contract — ready to
download or send. Not a transcript: a finished document.

Built in Leeton, NSW by **Hoffstee**.

## Why
Tradies, NDIS providers, allied health and small businesses lose 5–10 hours a week to
routine paperwork. Voice-transcription tools only give you text; VoiceDocs gives you the
**finished, Australian-compliant document** (ABN, GST, NDIS formats) in about 60 seconds.

## Tech stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (custom design system, light/dark themes, Poppins)
- **MongoDB Atlas** via **Mongoose**
- **JWT** auth (httpOnly cookie) + **bcrypt**
- **Claude (Anthropic)** for document formatting · browser **Web Speech API** for transcription
- **Vitest** for unit tests

## Getting started
```bash
npm install
cp .env.local.example .env.local   # then fill in MONGODB_URI + JWT_SECRET
npm run dev                         # http://localhost:3000
npm test                            # run unit tests
```
See [`BACKEND_SETUP.md`](BACKEND_SETUP.md), [`WORKFLOW.md`](WORKFLOW.md) and
[`TESTING.md`](TESTING.md) for details.

## Status
Working: auth, voice → AI → saved document, per-user secured APIs, dashboard/documents/
clients, business-profile settings that flow into invoices, premium marketing site.
Roadmap: PDF/DOCX export, Stripe billing, email/SMS delivery, custom template builder, PWA,
Xero/MYOB integrations.

---
🤖 Built with [Claude Code](https://claude.com/claude-code)
