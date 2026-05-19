# Cloudflare Setup

This site now expects a Cloudflare Pages Function at `/api/data` backed by a KV namespace binding named `MB_DATA`.

## Required bindings

In your Cloudflare Pages project:

1. Go to `Workers & Pages` > your project.
2. Open `Settings` > `Bindings`.
3. Add a `KV namespace` binding named `MB_DATA`.
4. Redeploy the project.

## Optional admin credentials

The admin write endpoint accepts HTTP Basic auth.

If you want to override the built-in defaults, add these environment variables in `Settings` > `Variables and Secrets`:

- `MB_ADMIN_USER`
- `MB_ADMIN_PASSWORD`

If you do not set them, the API uses:

- user: `matias`
- password: `brieba2024`

## Result

- `GET /api/data` returns the current site data.
- `POST /api/data` saves projects, clients, and config into KV.
- The frontend caches the last successful response in `localStorage`, but the source of truth is now KV.
