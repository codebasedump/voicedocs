# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]
### Added
- Enterprise repo setup: CI (lint · typecheck · test · build), LICENSE, SECURITY,
  CONTRIBUTING, issue/PR templates, `.editorconfig`, `.nvmrc`.
- Premium single-page marketing site with smooth-scroll navigation, competitor comparison,
  personas and FAQ.
- Business profile in Settings (ABN, business name, address, payment & bank details) that
  flows into generated invoices.
- Secure `/api/me` profile endpoint (session-scoped, strict validation).

### Changed
- Unified typeface to Poppins across the whole app.
- Dashboard, documents and clients now read live data scoped to the logged-in user.

## [0.1.0] — 2026-06
### Added
- Voice → AI → saved document core loop (Claude with offline mock fallback).
- Email/password auth (JWT in httpOnly cookie), protected app routes.
- MongoDB models (User, Client, Document) and per-user-scoped REST APIs.
- Light/dark theme, icon sidebar, recorder with live transcription, document preview.
- Vitest unit tests (GST math, formatting, auth).
