# Cloudflare Setup

This project deploys with `wrangler deploy`, not Cloudflare Pages Functions.

## Current repo config

The repository already includes:

- `wrangler.jsonc` with the KV namespace binding `MB_DATA`
- `worker.js` serving static assets plus `/api/data`

KV namespace ID configured in repo:

- `b519979e323b4a50b7ea7d62b7705d73`

## What Cloudflare still needs

You do not need to keep fighting the UI binding modal if the deploy uses the repo config.

You only need:

1. The KV namespace to exist in Cloudflare.
2. A redeploy of the Worker/project.

## Optional admin credentials

The admin write endpoint accepts HTTP Basic auth.

If you want to override the built-in defaults, add these variables in Cloudflare:

- `MB_ADMIN_USER`
- `MB_ADMIN_PASSWORD`

Defaults used by the code:

- user: `matias`
- password: `brieba2024`

## Result

- `GET /api/data` returns the current site data
- `POST /api/data` saves projects, clients, and config into KV
- the frontend still caches the latest successful response in `localStorage`, but KV is now the source of truth
