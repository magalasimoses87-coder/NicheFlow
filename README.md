# NicheFlow — Render version

NicheFlow is a niche-locked learning/search website. This version runs as a Node.js/Express web service on Render instead of Cloudflare Pages.

## What this version contains
- Existing NicheFlow responsive frontend
- Render-compatible Node.js/Express server
- `/api/health` health endpoint
- `/api/search` YouTube Data API integration
- Niche-locked YouTube search
- PostgreSQL schema and connection support
- Basic email/password registration and login API
- JWT-based authentication foundation
- Learning-path persistence API
- PayPal webhook endpoint scaffold
- No Cloudflare/Wrangler dependency

## Render settings
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: `/`
- Plan: Free for testing

Render web services must listen on `0.0.0.0` and the `PORT` supplied by Render; the server does this automatically.

## Environment variables
Required for search:
- `YOUTUBE_API_KEY` — your Google/YouTube Data API v3 key

Required for authentication in production:
- `JWT_SECRET` — long random secret

For database features:
- `DATABASE_URL` — Render Postgres internal connection string

PayPal will later use server-side secrets such as:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_PLAN_ID`

Never put private secrets in browser JavaScript or commit them to GitHub.

## PostgreSQL
The server automatically creates the tables in `schema.postgres.sql` when `DATABASE_URL` is present.

For a free test database, Render currently offers Free Postgres, but Render states that Free Postgres is limited to 1 GB and expires after 30 days. It is suitable for testing, not permanent production storage.

## Run locally
```bash
npm install
set YOUTUBE_API_KEY=your_key
set JWT_SECRET=change_me
npm start
```
Then open `http://localhost:10000`.

## Production roadmap
1. YouTube search and embeds
2. PostgreSQL users/subscriptions/learning paths
3. Authentication UI
4. PayPal subscription verification/webhooks
5. Article/document ingestion and source links
6. Admin/editor and analytics
7. Additional providers only through permitted APIs/embeds
