# Vinhound — Platform Starter (AI + Monetization)

Next.js 14 app for **Vinhound**, a car-search concierge. Users submit structured or free-text car requests; leads are saved, normalized via OpenAI, alerted via Twilio, and monetized via Stripe credits.

> **Canonical repo:** `isaaclfeldman/thevinhound`
> Note: an older `isaaclfeldman/vinhound` repo exists on GitHub. This one (`thevinhound`, matching the domain) is the live codebase. Consider archiving the other.

## Stack
Next.js 14 · React 18 · TypeScript · TailwindCSS · better-sqlite3 · Stripe · OpenAI · Twilio

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

## Deploy
Vercel. Upload as a new deployment into the existing project.

## Environment variables
```
OPENAI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_10
STRIPE_PRICE_25
STRIPE_PRICE_100
PUBLIC_URL
AIRTABLE_TOKEN
AIRTABLE_BASE
AIRTABLE_TABLE
TWILIO_SID
TWILIO_AUTH
TWILIO_FROM
ALERT_TO
```

## Cross-device workflow
Clone on any machine (e.g. MacBook) via `git clone https://github.com/isaaclfeldman/thevinhound.git`. Commit and push before switching devices so nothing lives only locally. Don't commit `.env` — copy it to each machine manually.

## Layout caveat
Imports reference `@/lib/db` and `@/styles/globals.css`, but source files currently sit at the repo root. Before `next build` will succeed, move files into standard Next.js directories (`pages/`, `pages/api/`, `lib/`, `styles/`) or configure `tsconfig` path aliases to match the current flat layout.
