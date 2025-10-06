# The Vinhound v3 — Static Site + Minimal Backend

Static HTML/CSS/JS plus a Vercel serverless function for lead capture.

## Files
- index.html, styles.css, script.js
- hero.jpg (hero image)
- api/lead.js — POST /api/lead
- vercel.json — enables serverless runtime for /api

## Optional environment variables (Vercel → Project → Settings → Environment Variables)
- NOTIFY_EMAIL — where to send lead notifications
- RESEND_API_KEY — email provider API key (optional)

Deploy: push to GitHub; Vercel redeploys. The form posts to /api/lead.
