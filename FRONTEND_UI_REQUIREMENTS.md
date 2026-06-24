# Campfire Store — Frontend UI Requirements

**Audience:** AI coding agent scaffolding a new, deployable storefront SPA.  
**Companion asset:** `index.html` in this repository — visual and interaction reference for layout, spacing, colors, and component styling. Treat it as the design source of truth; translate its CSS tokens and patterns into the React app.

**Backend:** [Campfire Store API](https://campfire-store-api.onrender.com) (separate repo/service). Swagger: https://campfire-store-api.onrender.com/api/v1/api-docs/

---

## 1. Project goal

Build a **mobile-first outdoor gear storefront** that consumes the Campfire Store REST API. The UI is a demo shop (kayaks, bikes, camping, etc.) with catalog browsing, auth, cart, checkout, orders, server-backed wishlist, and dedicated product search.

Deliver a **production-ready Vite SPA** that can be deployed to **Netlify** with environment-based API configuration.

---

## 2. Recommended tech stack

| Layer        | Choice                                          | Notes                                                         |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------- |
| Build        | **Vite**                                        | Fast dev, Netlify-friendly static output                      |
| UI           | **React 18+** + **TypeScript**                  | Strict TS; functional components + hooks                      |
| Routing      | **React Router**                                | Client-side routes; protected account/cart/checkout/wishlist routes |
| Styling      | **Tailwind CSS v4** (or v3)                     | Map design tokens to `tailwind.config` / `@theme`             |
| Server state | **TanStack Query**                              | Products, categories, search, cart, orders, wishlist; cache + retries |
| Client state | **Zustand**                                     | Auth session, locale/currency prefs, active cart id                   |
| Icons        | **lucide-react**                                | Same icon set as `index.html`                                 |
| HTTP         | `fetch` or **axios**                            | Central API client with auth + query param helpers            |
| Forms        | Native controlled inputs or **React Hook Form** | Login, signup, checkout addresses                             |
| Deploy       | **Netlify**                                     | Static `dist/` + SPA fallback                                 |

**Do not** embed the Express API in this project. It is a standalone frontend repo.

---

## 3. Design reference (`index.html`)

Open `index.html` in a browser alongside this doc. Replicate:

- Sticky header with logo, categories mega-menu, search, locale pill, account, cart badge, mobile menu
- Home hero (orange), category row (emerald accents), featured products grid (orange accents), emerald promo strip, footer
- Interaction: categories mega-menu opens on hover (desktop) and click; closes on outside click / mouse leave
- Responsive grids and horizontal category scroll on small screens

**Exclude from production UI** (mockup-only): none — the design mockup reflects the intended production header.

---

## 4. Design tokens

Implement these as CSS variables and/or Tailwind theme extensions.

### 4.1 Typography

| Token                   | Value                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| `--font-sans`           | `'Inter', system-ui, sans-serif` — weights **400, 500, 600**      |
| `--font-display`        | `'Fraunces', Georgia, serif` — weights **600, 700** (opsz 9..144) |
| Base body               | `1rem`, `line-height: 1.5`                                        |
| Section headings (`h2`) | Fraunces, `1.5rem`, `letter-spacing: -0.02em`                     |
| Hero `h1`               | Fraunces, `clamp(2rem, 5vw, 3.25rem)`, `line-height: 1.08`        |
| Muted copy              | `0.9375rem` typical; labels/meta `0.75rem`–`0.875rem`             |

Load fonts via Google Fonts (same URL as `index.html`) or self-host.

### 4.2 Color palette

| Token                      | Hex       | Usage                                                              |
| -------------------------- | --------- | ------------------------------------------------------------------ |
| `--color-bg`               | `#fafafa` | Page and section backgrounds (neutral gray-white)                  |
| `--color-header-bg`        | `#1c1917` | Sticky header — dark charcoal                                       |
| `--color-header-border`    | `#292524` | Header and mega-menu borders on dark header                         |
| `--color-footer-bg`        | `#f0f0f0` | Footer — slightly darker than header                               |
| `--color-surface`          | `#ffffff` | Cards, mega-menu dropdown, inputs on tinted areas                  |
| `--color-surface-muted`    | `#f5f5f5` | Hovers, subtle fills (neutral gray — not warm beige)               |
| `--color-border`           | `#e5e5e5` | Borders                                                            |
| `--color-text`             | `#171717` | Primary text                                                       |
| `--color-text-muted`       | `#737373` | Secondary text                                                     |
| `--color-primary`          | `#ea580c` | Orange — hero, primary CTAs, header link hovers, featured products |
| `--color-primary-hover`    | `#c2410c` | Primary hover, product prices in featured section                  |
| `--color-primary-subtle`   | `#fff7ed` | Orange tinted backgrounds                                          |
| `--color-accent`           | `#f59e0b` | Amber accent in orange gradients                                   |
| `--color-secondary`        | `#047857` | Emerald — category section, promo banner, “View all” links         |
| `--color-secondary-hover`  | `#065f46` | Emerald hover                                                      |
| `--color-secondary-subtle` | `#e8f7f0` | Green tinted backgrounds                                           |
| `--color-secondary-muted`  | `#d1ebe0` | Green borders/chips                                                |

**Neutral shell layering:** page `#fafafa` → dark header `#1c1917` → footer `#f0f0f0`. Header uses light-on-dark text (`#f5f5f4`) and amber hover accents (`#fdba74`) for nav links.

Supporting oranges for hero borders/gradients: `#fed7aa`, `#fffbeb`, `#fde68a`, `#fdba74`.

Promo gradient (emerald only): `135deg, #064e3b 0%, #047857 48%, #065f46 100%`.

### 4.3 Color usage rules (important)

1. **Orange** (`primary`): hero, header nav hovers, primary buttons, cart badge, featured-product accents, product-card hover border, default active filter chips in product sections.
2. **Emerald** (`secondary`): “Shop by category” section (icons, “View all” pill), category mega-menu footer (“View all categories”), promo strip, footer link hovers.
3. **Do not mix orange and green in a single gradient.** Orange gradients use amber/yellow; green gradients use darker emerald shades only.
4. **“Under $500” / forest chip** in featured products: emerald styling only (`.chip.is-forest` pattern in mockup).
5. Category section active chips use emerald; product listing active chips use orange.

### 4.4 Layout & spacing

| Token             | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| `--max-width`     | `72rem` — content container max width                   |
| Container         | `width: min(100% - 2rem, 72rem); margin-inline: auto`   |
| `--header-height` | `4.75rem`                                               |
| `--radius-sm`     | `0.5rem`                                                |
| `--radius-md`     | `0.75rem`                                               |
| `--radius-lg`     | `1rem`                                                  |
| `--shadow-sm`     | `0 1px 2px rgb(0 0 0 / 6%)`                             |
| `--shadow-md`     | `0 10px 28px rgb(0 0 0 / 8%)`                           |
| Section padding   | `1.25rem 0 2rem` typical; band sections slightly taller |

### 4.5 Component sizes (match mockup)

| Element           | Size                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| Header logo image | `height: 3rem`, `transform: translateY(-0.4rem)`                                       |
| Icon buttons      | `2.5rem` circle                                                                        |
| Cart badge        | min `1.125rem`, font `0.6875rem`, background primary orange                            |
| Search field      | pill shape, `max-width: 22rem` in header                                               |
| Buttons (`.btn`)  | pill (`border-radius: 999px`), padding `0.75rem 1.125rem`, font `0.9375rem` weight 600 |
| Product grid      | 2 cols mobile → **4 cols** from `768px`                                                |
| Mega-menu grid    | 2 cols mobile → **3 cols** from `768px`                                                |
| Category row      | horizontal scroll, `grid-auto-columns: minmax(8.5rem, 1fr)`                            |
| Product media     | `aspect-ratio: 1`, `object-fit: contain`                                               |

### 4.6 Breakpoints

| Breakpoint | Behavior                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| `< 768px`  | Hide desktop nav, search, locale pill; show hamburger; 2-col product grid       |
| `≥ 768px`  | Show nav, search, locale; 3-col mega-menu; 4-col products; footer 4-column grid |

### 4.7 Header navigation rules

- **No “Home” text link.** The **logo** is the home link (`/`).
- Desktop nav: **Categories** trigger only (mega-menu).
- Logo: link to `/`, `aria-label="Campfire Store home"`.
- Sticky header: `background: rgb(28 25 23 / 96%)`, `border-bottom: 1px solid var(--color-header-border)`, light text and `campfire_logo_light.png`

---

## 5. Brand assets

Bundle these files in the frontend `public/` directory (shipped with the UI project — do not fetch from the API):

| Asset              | Filename                 | Usage                                                                                 |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------- |
| Logo (light bg)    | `campfire_logo_dark.png`  | Footer on light/gray backgrounds                                                    |
| Logo (dark bg)     | `campfire_logo_light.png` | **Header** (default dark header)                                                  |
| Favicon            | `favicon.ico`            | Site favicon — reference in `index.html` as `<link rel="icon" href="/favicon.ico" />` |

Header uses `campfire_logo_light.png` on the dark header. Footer uses `campfire_logo_dark.png` on the light gray footer background.

Product images are **not** bundled in the frontend — they are served from the API host (see §7).

---

## 6. API integration

### 6.1 Base URL

```
Production: https://campfire-store-api.onrender.com/api/v1
Local dev:  http://localhost:3000/api/v1
```

Configure via env var: `VITE_API_BASE_URL`.

Static files (product images, user photos):

```
{VITE_API_ORIGIN}/img/products/small/...
```

Where `VITE_API_ORIGIN` is the API origin without `/api/v1` (e.g. `https://campfire-store-api.onrender.com`). Image paths in JSON are relative (e.g. `img/products/small/product-….jpg`).

### 6.2 Global query parameters

Append to catalog/cart/order requests as needed:

| Param           | Purpose                             |
| --------------- | ----------------------------------- |
| `language`      | `en` or `de`                        |
| `currency`      | `USD` or `EUR`                      |
| `page`, `limit` | Pagination                          |
| `sort`          | e.g. `-createdAt`, `priceI18n.USD`  |
| `filter`        | URL-encoded JSON Mongo-style filter |
| `fields`        | Sparse field selection              |

Language/currency middleware runs on the API; persist user choice in Zustand + `localStorage`.

### 6.3 Authentication

| Endpoint        | Method | Body                                           | Response          |
| --------------- | ------ | ---------------------------------------------- | ----------------- |
| `/users/signup` | POST   | `name`, `email`, `password`, `passwordConfirm` | JWT + user        |
| `/users/login`  | POST   | `email`, `password`                            | JWT + user        |
| `/users/logout` | GET    | —                                              | Invalidates token |

Protected routes: `Authorization: Bearer <token>`.

**Demo account** (seed data): `alex.chen@explorernet.net` / `test1234` — has order history; cart may be empty until items are added.

Store JWT in memory + `sessionStorage` or `localStorage` (document choice; prefer `sessionStorage` for demo security). Redirect unauthenticated users from protected routes to login with `returnUrl`.

### 6.4 Key endpoints

| Resource     | Endpoints                                                                      |
| ------------ | ------------------------------------------------------------------------------ |
| Languages    | `GET /languages`                                                               |
| Currencies   | `GET /currencies`                                                              |
| Categories   | `GET /categories`, `GET /categories/:id`, `GET /categories/:id/products`       |
| Products     | `GET /products`, `GET /products/:id`                                           |
| **Search**   | `GET /search` — dedicated search endpoint (see §6.4.1)                         |
| User         | `GET /users/:id`, `PATCH /users/:id` (profile, addresses, photo)               |
| Carts        | `GET/POST /users/:id/carts`, `GET/PATCH/DELETE /users/:id/carts/:cartId`       |
| Cart entries | `GET/POST /users/:id/carts/:cartId/entries`, `PATCH/DELETE …/entries/:entryId` |
| **Wishlist** | User wishlist endpoints (see §6.4.2) — **API extension, in progress**          |
| Orders       | `GET/POST /users/:id/orders`, `GET /users/:id/orders/:orderId`                 |

**Place order:** `POST /users/:id/orders` with `{ "cartId": "…" }`.

#### 6.4.1 Search (`GET /search`)

Dedicated search endpoint — **do not** simulate search client-side or via the products `filter` param.

| Query param | Purpose |
|-------------|---------|
| `q` | Search query string (required for meaningful results) |
| `language` | `en` or `de` |
| `currency` | `USD` or `EUR` |
| `page`, `limit` | Pagination |
| `sort` | Optional sort field |

**Frontend usage:** header search submits to `/search?q=…`; the search results page calls `GET /search` with the same `q` plus locale/pagination params. Expect a product-list-shaped response (products + pagination metadata — confirm exact schema in Swagger once the endpoint ships).

#### 6.4.2 Wishlist (API extension)

Wishlist is **server-backed**, not `localStorage`. The API repo will add endpoints following the same nested-user pattern as carts and orders. Integrate against Swagger once published; expected shape:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/users/:id/wishlist` | `GET` | List wishlist items for the authenticated user |
| `/users/:id/wishlist` | `POST` | Add a product — body e.g. `{ "product": "<productId>" }` |
| `/users/:id/wishlist/:productId` | `DELETE` | Remove a product from the wishlist |

All wishlist routes require JWT (`Authorization: Bearer <token>`). Use TanStack Query for fetch/mutations; invalidate wishlist cache after add/remove.

### 6.5 API quirks (handle in frontend)

1. **Product list** may omit `descriptionI18n` — fetch `GET /products/:id` on the product detail page.
2. **Cart entries** may return product references as IDs only — batch-fetch or join product data for display.
3. **One active cart** per session is enforced server-side; create cart with `{ "currency": "USD" }` when user first adds to cart.
4. **Cold starts:** Render free tier may take 30–60s on first request after idle — show loading state; optional retry.
5. **CORS** is enabled on the API for browser clients.
6. **`GET /search` and wishlist routes** are API extensions — they may not be live on production yet. Stub types from Swagger when available; gate UI behind feature flags or graceful “unavailable” states only during early development if needed.

### 6.6 Category tree

Seed data has **6 root categories** with subcategories (see mega-menu in `index.html`):

- Kayaks → Touring, Whitewater, Inflatable
- Bicycles → Road, Gravel, Mountain
- Camping → Tents
- Accessories → Backpacks
- Clothing → Hiking pants
- Ski → All mountain

Build mega-menu and category pages from `GET /categories` (use `parentCategory` / `subCategories` virtual).

---

## 7. Routing & pages

| Route             | Page                                         | Auth                                    |
| ----------------- | -------------------------------------------- | --------------------------------------- |
| `/`               | Home                                         | Public                                  |
| `/categories`     | All categories                               | Public                                  |
| `/categories/:id` | Category product listing                     | Public                                  |
| `/products`       | All products (optional; can merge with home) | Public                                  |
| `/products/:id`   | Product detail                               | Public                                  |
| `/search`         | Search results (`q` query)                   | Public                                  |
| `/login`          | Login                                        | Public                                  |
| `/signup`         | Sign up                                      | Public                                  |
| `/account`        | Profile & addresses                          | Protected                               |
| `/cart`           | Shopping cart                                | Protected                               |
| `/checkout`       | Checkout (review + place order)              | Protected                               |
| `/orders`         | Order history list                           | Protected                               |
| `/orders/:id`     | Order detail                                 | Protected                               |
| `/wishlist`       | Saved products                               | Protected                               |

Use a shared **AppLayout** (header + footer) for all pages except optionally login/signup (still include minimal header with logo).

---

## 8. Page specifications

### 8.1 Header (global)

- Logo → `/`
- Categories → mega-menu (API-driven tree)
- Search input → `/search?q=…` — results loaded via `GET /search` (see §6.4.1)
- Locale pill → toggle language + currency (modal or dropdown); refetch queries on change
- Account icon → `/account` if logged in, else `/login`
- Cart icon → `/cart` with badge count from active cart entries
- Mobile: hamburger → drawer with categories, account, cart links

### 8.2 Footer (global)

Match `index.html` footer grid. Background: `var(--color-footer-bg)` (`#f0f0f0`).

- Brand blurb + small logo
- **Shop** links (categories)
- **Account** links (sign in, cart, orders, profile)
- **API** links (Swagger docs external, optional GitHub)
- Bottom bar: copyright + short tech note

### 8.3 Home (`/`)

Sections (in order):

1. **Hero** — orange card, eyebrow, headline, subcopy, primary CTA (“Shop bestsellers” → `/products` or featured), secondary CTA (“Browse categories” → `/categories`), stat tiles (can show live counts from API).
2. **Shop by category** — horizontal scroll cards, emerald icons, “View all” → `/categories`.
3. **Featured products** — toolbar chips (manufacturer filters from API data, “Under $500” emerald chip), sort select, product card grid.
4. **Promo strip** — emerald gradient; mention demo checkout with test account.

Product card: image, manufacturer, optional badge, name, price + currency.

### 8.4 Category listing (`/categories`, `/categories/:id`)

- `/categories`: grid of root + subcategories
- `/categories/:id`: breadcrumb, category title, same toolbar/grid as home products, pagination
- Root category id returns products from all child leaf categories (API behavior)

### 8.5 Product detail (`/products/:id`)

- Image gallery (thumbnails + main; use `images[].small.url` and larger sizes if present)
- Name, manufacturer, price (respect currency), full description (`descriptionI18n`)
- Add to cart (qty stepper), Add to wishlist (heart — requires login; persists via wishlist API)
- Breadcrumb via category

### 8.6 Account (`/account`)

- View/edit name, email (read-only if API disallows), delivery/billing addresses
- Optional profile photo upload (`PATCH` multipart)
- Links to orders, wishlist, logout
- Tabbed or section layout; keep consistent with design system

### 8.7 Cart (`/cart`)

- Line items: image, name, unit price, quantity controls, line total, remove
- Subtotal; currency from cart
- Empty state with CTA to shop
- “Proceed to checkout” → `/checkout`
- Create cart on first add if none exists

### 8.8 Checkout (`/checkout`)

- Review cart summary
- Select delivery address (from user profile or inline form if API supports PATCH)
- Place order button → `POST /users/:id/orders`
- Success → order confirmation + link to `/orders/:id`
- Handle API errors gracefully

### 8.9 Orders (`/orders`, `/orders/:id`)

- List: date, status, total, currency, item count
- Detail: line items, addresses, totals
- Demo user has existing orders for testing

### 8.10 Search (`/search`)

- Driven by `q` query param from the URL (e.g. `/search?q=kayak`)
- Call `GET /search` with `q`, `language`, `currency`, pagination, and optional `sort`
- Product grid matching category/listing pages; empty state when no results
- Show the query in the page heading; preserve `q` in the header search input

### 8.11 Wishlist (`/wishlist`)

**Server-backed** via the wishlist API (§6.4.2) — not `localStorage`.

- Protected route; redirect to login if unauthenticated
- Load wishlist with `GET /users/:id/wishlist`
- Grid matching product cards; remove via `DELETE`; “Add to cart” per item
- Heart toggle on product cards and detail page — `POST` to add, `DELETE` to remove; optimistic UI optional but must reconcile with server state
- Empty state with CTA to browse products

---

## 9. Suggested project structure

```
campfire-store-ui/
├── public/
│   └── img/                 # logo assets
├── src/
│   ├── api/                 # client, endpoints, types
│   ├── components/
│   │   ├── layout/          # Header, Footer, Container, MegaMenu
│   │   ├── product/         # ProductCard, ProductGrid, Price
│   │   └── ui/              # Button, Chip, Badge, Input
│   ├── hooks/
│   ├── pages/
│   ├── store/               # Zustand slices
│   ├── lib/                 # formatPrice, imageUrl helpers
│   ├── App.tsx
│   └── main.tsx
├── index.html               # Vite entry (not the design mockup)
├── tailwind.config.ts
├── netlify.toml
├── .env.example
└── package.json
```

---

## 10. Implementation phases

Build incrementally; each phase should compile and be deployable.

| Phase | Scope                                                                        | Done when                                  |
| ----- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| **0** | Scaffold Vite+React+TS+Tailwind, tokens, Netlify config, API client          | `npm run build` succeeds                   |
| **1** | AppLayout: **Header + Footer** (static structure matching mockup)            | Navigable shell on all routes              |
| **2** | **Home** body: hero, categories row, featured products, promo (wired to API) | `/` loads live data                        |
| **3** | Category pages + mega-menu from API                                          | `/categories/*` works                      |
| **4** | **Product detail** page                                                      | `/products/:id` full description + gallery |
| **5** | **Auth** (login/signup/logout) + **Account** page                            | JWT flow works with demo user              |
| **6** | **Cart** page + add-to-cart                                                  | Cart CRUD against API                      |
| **7** | **Checkout** + **Orders** list/detail                                        | End-to-end purchase                        |
| **8** | **Search** (`GET /search`) + **Wishlist** (API) + polish (loading, errors, 404) | Feature-complete demo                      |

---

## 11. Netlify deployment

### 11.1 Build settings

| Setting           | Value           |
| ----------------- | --------------- |
| Build command     | `npm run build` |
| Publish directory | `dist`          |
| Node version      | 20+             |

### 11.2 SPA routing

Add `public/_redirects`:

```
/*    /index.html   200
```

Or in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 11.3 Environment variables (Netlify UI)

| Variable            | Example                                          |
| ------------------- | ------------------------------------------------ |
| `VITE_API_BASE_URL` | `https://campfire-store-api.onrender.com/api/v1` |
| `VITE_API_ORIGIN`   | `https://campfire-store-api.onrender.com`        |

### 11.4 `.env.example`

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_ORIGIN=http://localhost:3000
```

---

## 12. Quality bar

- **Mobile-first** responsive layout matching mockup breakpoints
- **Accessible:** semantic HTML, keyboard mega-menu, `aria-expanded`, focus states, alt text on images
- **Loading & error UI** for all API calls (skeleton cards, toast or inline errors)
- **TypeScript** types for API responses (generate from Swagger optionally)
- **No secrets** in the repo; env vars only
- **ESLint + Prettier** recommended
- Optional: minimal smoke test (`vitest` + one render test)

---

## 13. Out of scope (v1)

- Admin product/category management
- Payment gateway (orders are placed directly via API)
- Server-side rendering

---

## 14. Agent checklist before handoff

- [ ] Design tokens match §4 and visual check against `index.html`
- [ ] Logo is home link; no separate Home nav item
- [ ] API base URL from env; images prefixed with API origin
- [ ] `language` and `currency` query params on catalog requests
- [ ] JWT attached to protected routes
- [ ] Search uses `GET /search` (not client-side filtering)
- [ ] Wishlist uses API endpoints (not `localStorage`)
- [ ] `npm run build` produces `dist/` suitable for Netlify
- [ ] README with local setup, env vars, and Netlify deploy steps

---

_Generated for the Campfire Store API companion frontend. API repo: campfire-store-api._
