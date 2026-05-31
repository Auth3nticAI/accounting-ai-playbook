# Accounting AI Playbook — Frontend

Frontend for the Accounting AI Playbook. A library of accounting pain points and the AI solutions that address them — built for solo AI-for-accounting consultants so prospect conversations can land on a real, priced, tech-stacked solution instead of pitching vapor.

CSE552 Mini Project 2 — Next.js frontend talking to a FastAPI + Postgres backend.

## Stack

- **Next.js 16** (App Router) with **TypeScript** and **Tailwind CSS v4**
- Talks to the [accounting-ai-playbook-api](https://github.com/Auth3nticAI/accounting-ai-playbook-api) backend
- Client-side fetching with `useEffect` + loading/error states
- Reusable types in [lib/types.ts](lib/types.ts)

## Pages

| Path | Purpose |
|---|---|
| `/` | Overview with playbook stats (counts by category, severity, maturity) |
| `/pain-points` | List of all pain points, filterable by category |
| `/pain-points/new` | Form to add a new pain point |
| `/pain-points/[id]` | Pain point detail + nested AI solutions + add-solution form |

CRUD coverage: pain points (Create on `/new`, Read on list/detail, Update severity on detail, Delete on detail), solutions (Create via toggle form, Read in detail, Delete per card).

## Run

```bash
# 1. Make sure the backend is running first (separate repo)
#    See: https://github.com/Auth3nticAI/accounting-ai-playbook-api

# 2. Install deps
npm install

# 3. Configure API URL (already in .env.local during dev)
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local

# 4. Dev server
npm run dev
```

Open http://localhost:3000.

## Environment

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend | `http://127.0.0.1:8000` |

`.env.local` is gitignored by default in Next.js.

## Notes

- The dev origin allowlist for Next 16 is configured in `next.config.ts` (`allowedDevOrigins: ['127.0.0.1']`) so the HMR WebSocket connects cleanly when the page is hit via IP instead of `localhost`.
- Dynamic route `params` are now async in Next 16, so `app/pain-points/[id]/page.tsx` uses React's `use()` to unwrap the promise.
