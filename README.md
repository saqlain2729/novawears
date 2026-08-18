# NOVAWEARS — E-Commerce Platform

A production-ready storefront + admin dashboard for NOVAWEARS, built with
Next.js 15 (App Router), TypeScript, Tailwind CSS, and libSQL (SQLite-compatible,
via [Turso](https://turso.tech) in production) through Drizzle ORM. Deploys
cleanly to Vercel.

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
| `DATABASE_URL` / `DATABASE_AUTH_TOKEN` | **Yes, in production (Vercel)** | Remote Turso (libSQL) database connection |
| `DATABASE_PATH` | No (has default) | Local SQLite file, used only when `DATABASE_URL` is unset |
| `JWT_SECRET` | **Yes, in production** | Signs admin session cookies |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used once, at seed time | Creates your first admin login |
| `BLOB_READ_WRITE_TOKEN` | **Yes, in production**, for admin image uploads | Vercel Blob storage for product photos |
| `RESEND_API_KEY` / `EMAIL_FROM` | No (emails skip if unset) | Order + contact email notifications |

The **WhatsApp number** and **business email shown to customers** are *not*
env vars — they live in the database and are editable from
`/admin/settings`, per the brief's requirement that business changes
shouldn't need a code edit.

---

## 4. Deployment (Vercel)

Vercel's serverless functions have a **read-only, ephemeral filesystem**
(other than `/tmp`, which is wiped on every cold start), so a local SQLite
file cannot be the production database, and locally-written uploads cannot
be the production image store. This project is set up so both live outside
the app instead:

- **Database**: [Turso](https://turso.tech) — a hosted libSQL (SQLite-
  compatible) database, reached over HTTP. The schema and Drizzle queries
  are unchanged from plain SQLite; only the connection layer differs.
- **Product image uploads**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).

### Step 1 — Create a Turso database
```bash
# Install the Turso CLI, then:
turso auth login
turso db create novawears
turso db show novawears --url            # → DATABASE_URL
turso db tokens create novawears         # → DATABASE_AUTH_TOKEN
```

### Step 2 — Run migrations + seed against that database
Locally, with `DATABASE_URL` / `DATABASE_AUTH_TOKEN` set in `.env.local` to
the values from Step 1:
```bash
npm run db:setup
```
This creates the tables and your first admin account on the remote database
directly — no separate migration step is needed at deploy time.

### Step 3 — Deploy to Vercel
1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Vercel, **Add New Project** → import the repo. Vercel auto-detects
   Next.js; leave the build command as `next build`.
3. In **Storage** → **Create Database** → **Blob**, create and attach a
   Blob store to the project (this sets `BLOB_READ_WRITE_TOKEN`
   automatically).
4. In **Settings → Environment Variables**, add: `DATABASE_URL`,
   `DATABASE_AUTH_TOKEN`, `JWT_SECRET`, and (optionally) `RESEND_API_KEY` /
   `EMAIL_FROM`. Don't set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in
   Vercel — those are only used once, locally, by the seed script in Step 2.
5. Deploy.

Never commit `.env.local` — it's already in `.gitignore`.

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
