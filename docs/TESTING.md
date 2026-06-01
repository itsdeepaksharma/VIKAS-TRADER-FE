# Vikas Trader — testing before PR

## Frontend (`VIKAS-TRADER-FE`)

```bash
npm ci
npm run check          # lint + typecheck + production build
npm run format:check   # optional style gate
```

### Manual smoke test

1. Start API: `docker compose up -d postgres backend` (repo root).
2. Start FE: `npm run dev`.
3. Login as `admin@vikastraders.com` / `VikasAdmin@2026`.
4. **Store:** home search suggestions, categories, product detail, cart, checkout, orders + order detail, wishlist, profile settings/address, notifications bell.
5. **Admin:** dashboard stats, categories/products CRUD, orders status update, users list.
6. **Auth:** signup, forgot-password flow (demo — no email sent).

## Backend (`VIKAS-TRADER-BE`)

```bash
docker compose exec backend pytest -q
docker compose exec backend ruff check app
```

Tests use a unique email per run for registration to avoid 409 conflicts on repeated runs.
