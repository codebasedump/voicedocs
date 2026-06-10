# Security Policy

## Reporting a vulnerability
If you discover a security vulnerability, **please do not open a public issue.**
Email **mohandass0925@gmail.com** with details and steps to reproduce. We aim to
acknowledge reports within 72 hours.

## Handling of secrets
- All secrets (`MONGODB_URI`, `JWT_SECRET`, `ANTHROPIC_API_KEY`, …) live only in
  `.env.local`, which is git-ignored and must **never** be committed.
- The repository contains only `.env.local.example` with placeholder values.
- If a secret is ever exposed, rotate it immediately (DB user password, JWT secret, API keys).

## Application security measures
- **AuthN:** JWT in an httpOnly, SameSite=Lax cookie; passwords hashed with bcrypt (12 rounds).
- **AuthZ:** every data API requires a session and is **scoped to the authenticated user**
  (`userId`); documents/clients can only be read or modified by their owner.
- **Validation:** all write endpoints validate input with Zod; the profile endpoint uses a
  strict allow-list so users cannot escalate their own `plan`/`role`.
- **Data exposure:** the API never returns `passwordHash`.

## Supported versions
The `main` branch is the only actively maintained version.
