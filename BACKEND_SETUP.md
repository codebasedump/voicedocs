# VoiceDocs — Backend setup (step by step)

The backend lives **inside the Next.js app** (no separate server): MongoDB via Mongoose,
exposed through Route Handlers under `app/api/`.

## 1. Install backend dependencies
```bash
npm install mongoose zod bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```
> Required now — auth is wired in, so the app's protected pages won't load without these.
> (Later steps add `@anthropic-ai/sdk` + `openai` for AI.)

Also generate a JWT secret and paste it into `.env.local` as `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 2. Create a MongoDB Atlas database (free)
1. Sign up at https://www.mongodb.com/atlas and create a **free M0 cluster**.
2. Region: **Sydney (ap-southeast-2)** for Australian data residency.
3. **Database Access** → add a user + password.
4. **Network Access** → allow your IP (or `0.0.0.0/0` for dev).
5. **Connect → Drivers** → copy the connection string.

## 3. Configure environment
```bash
cp .env.local.example .env.local
```
Paste your connection string into `MONGODB_URI` in `.env.local`.

## 4. Run & verify
```bash
npm run dev
```
Open http://localhost:3000/api/health — you should see:
```json
{ "success": true, "db": "connected", "time": "..." }
```

## 5. Try the API
```bash
# Create a document
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{"type":"invoice","title":"Test invoice","totalAmount":2975.5}'

# List documents
curl http://localhost:3000/api/documents
```

## What exists now
| Route | Methods | Purpose |
|---|---|---|
| `/api/health` | GET | DB connection check |
| `/api/documents` | GET, POST | List / create documents |
| `/api/documents/:id` | GET, PATCH, DELETE | Read / update / delete a document |
| `/api/clients` | GET, POST | List / create clients |
| `/api/auth/register` | POST | Create account + set session cookie |
| `/api/auth/login` | POST | Sign in + set session cookie |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Current logged-in user |

Models: `lib/models/{User,Client,Document}.ts` · Connection: `lib/db.ts` · Auth: `lib/auth.ts`
Pages: `/signup`, `/login`. All `/(app)` routes redirect to `/login` when signed out.

## Auth flow to test
1. Open http://localhost:3000 → "Get Started Free" → **/signup**
2. Create an account → you're redirected to the dashboard (session cookie set)
3. Settings → **Sign out** → back to /login

## Next steps (in order)
1. **Wire the UI** — replace mock data in dashboard/documents/clients with `fetch('/api/...')`, scoped to the logged-in user.
2. **Real AI** — `/api/voice/transcribe` (Whisper) + `/api/documents/generate` (Claude).
3. **PDF export**, then **Stripe** subscriptions.
