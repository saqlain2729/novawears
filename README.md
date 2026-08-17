# NOVAWEARS — E-Commerce Platform

A production-ready storefront + admin dashboard for NOVAWEARS, built with
Next.js 14 (App Router), TypeScript, Tailwind CSS, and SQLite via Drizzle ORM.

This is a real, working codebase — not a mockup. Checkout writes to a real
database, decrements real inventory, and blocks overselling. The admin
dashboard is protected by real authentication.

---

## 1. What's included

- **Storefront**: homepage, category/shop browsing with filters, search,
  product detail pages, cart, checkout (Cash on Delivery), contact form,
  editable policy pages.
- **Admin dashboard** (`/admin`): overview stats, product management
  (create/edit/delete/hide), category management, order management with
  status updates and search/filter, customer list, store settings (store
  name, WhatsApp number, shipping fee, announcement bar text, etc. — all
  editable without touching code).
- **Backend**: Next.js API routes backed by a real SQLite database
  (Drizzle ORM). Checkout is server-validated — price and stock always come
  from the database, never the client, so prices can't be manipulated.
  Orders and inventory updates happen in a single atomic transaction.
- **WhatsApp integration**: "Order on WhatsApp" button on every product page,
  pre-filled with product/price/quantity. The number is stored in Settings
  (editable in `/admin/settings`), never hardcoded in a component.
- **Email notifications**: admin order alerts + customer confirmations via
  [Resend](https://resend.com). Skips gracefully (and logs why) if you
  haven't added an API key yet — it never fakes sending.
- 4 clearly-marked **DEMO products** — delete them from
  `/admin/products` once you've added your real catalog.

---

## 2. Local setup

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and set at minimum:
- `JWT_SECRET` — generate with `openssl rand -base64 48`
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — your first admin login

Then set up the database and start the dev server:

```bash
npm run db:setup   # creates tables + seeds categories, demo products, admin account
npm run dev
```

Visit `http://localhost:3000` for the storefront and
`http://localhost:3000/admin/login` for the dashboard (use the
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set above).

**Change your admin password after first login.** The current build creates
the account from env vars at seed time; there's no in-app "change password"
form yet — see section 6 for how to add one, or re-run
`npm run db:seed` with a new `SEED_ADMIN_PASSWORD` (it won't duplicate the
account if the email already exists, so delete the row from the `admins`
table first, or use a new `SEED_ADMIN_EMAIL`).

---

## 3. Environment variables

See `.env.example` for the full list with explanations. Summary:

| Variable | Required? | Purpose |
|---|---|---|
| `DATABASE_PATH` | No (has default) | SQLite file location |
| `JWT_SECRET` | **Yes, in production** | Signs admin session cookies |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used once, at seed time | Creates your first admin login |
| `RESEND_API_KEY` / `EMAIL_FROM` | No (emails skip if unset) | Order + contact email notifications |

The **WhatsApp number** and **business email shown to customers** are *not*
env vars — they live in the database and are editable from
`/admin/settings`, per the brief's requirement that business changes
shouldn't need a code edit.

---

## 4. Deployment

This app needs a **persistent filesystem** for the SQLite file, so it won't
work as-is on a fully serverless/edge platform (e.g. Vercel's default
serverless functions reset their filesystem between invocations). Two good
options:

### Option A — Railway / Render / Fly.io (recommended, easiest)
These platforms give you a persistent disk:
1. Push this repo to GitHub.
2. Create a new project from the repo on Railway/Render/Fly.
3. Add a persistent volume mounted at, e.g., `/data`, and set
   `DATABASE_PATH=/data/novawears.db`.
4. Set the env vars from section 3.
5. Set the build command to `npm run build` and start command to
   `npm run db:setup && npm run start` (only runs seed if tables don't
   exist yet — safe to leave in).

### Option B — Move to Postgres (for Vercel or any serverless host)
Swap SQLite for Postgres so the database lives outside the app's
filesystem:
1. Provision a Postgres database (e.g. Neon, Supabase, Railway Postgres).
2. Replace `better-sqlite3` with `postgres` + `drizzle-orm/postgres-js` in
   `src/db/index.ts`, and change the column types in `src/db/schema.ts`
   from `sqlite-core` to `pg-core` (Drizzle's docs have a straightforward
   migration guide — the schema shape stays the same).
3. Use `drizzle-kit` to generate and run migrations instead of the raw SQL
   in `src/db/migrate.ts`.
4. Deploy normally to Vercel.

Either way, don't forget to set `JWT_SECRET` and your Resend credentials as
environment variables in your hosting platform's dashboard — never commit
`.env.local`.

---

## 5. Connecting your own domain

Once deployed, point your domain's DNS at your hosting platform (each of
the platforms above has a "Custom Domain" section in their dashboard with
the exact records to add — usually a CNAME or A record).

---

## 6. What to build next

This is a genuine working skeleton, not a finished, polished storefront.
Before launch, you'll likely want to:

- Replace the 4 demo products and Unsplash placeholder images with your
  real catalog and product photography.
- Add an in-app "change admin password" form (currently password is only
  set via the seed script).
- Add pagination to `/shop` and `/admin/products` once your catalog grows
  past a page or two.
- Have a legal professional review the policy pages in
  `src/app/(storefront)/policies/[slug]/page.tsx` — they're reasonable
  starting points, clearly marked `PLACEHOLDER`, not legal advice.
- Consider adding image upload (the current admin product form takes image
  URLs — fine if you host photos elsewhere, e.g. Cloudinary/S3, but you may
  want direct upload).
- Tighten the visual/motion polish in the storefront — the animation system
  (scroll reveals, hover states, hero motion) is real and working, but
  there's room for another design pass once real product photography is in.

---

## 7. Project structure

```
src/
  app/
    (storefront)/     → public site: home, shop, product, cart, checkout, contact, policies
    admin/
      login/           → public admin login page
      (protected)/     → auth-gated: overview, products, orders, categories, customers, settings
    api/               → all backend routes (public + admin)
  components/          → shared UI (Header, Footer, ProductCard, CartDrawer, admin/*)
  context/             → CartContext (client-side cart, persisted to localStorage)
  db/                  → Drizzle schema, DB client, migration + seed scripts
  lib/                 → auth, email, whatsapp, settings, validation helpers
```
