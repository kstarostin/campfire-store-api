# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Express + MongoDB REST API for the Campfire demo store. CommonJS, no TypeScript, no build step. The storefront that consumes it lives in the sibling repo `campfire-store`.

Node is pinned to 24 via `.nvmrc`; `engines` declares a floor of `>=22`.

## Commands

```bash
npm start              # nodemon, development
npm run start:prod     # cross-env NODE_ENV=production, port 80
npx eslint .           # no lint script is defined in package.json
```

Data seeding (all read `config.env`):

```bash
node dev-tools/data/import-test-data.js --import     # also --delete, --recreate
npm run product:id         # generate a new product id
npm run product:images     # process files staged in dev-tools/image-staging
npm run product:enrich     # backfill product metadata
npm run category:enrich
npm run category:images
```

### Tests

```bash
npm test                                    # jest --runInBand --forceExit
npx jest tests/priceFilterUtils.test.js     # single file
npx jest -t "pagination"                    # single test by name
```

**`npm test` connects to the database in `config.env` and calls `recreateTestData()` in both `beforeAll` and `afterAll`** (`tests/setup.js`) — it wipes and reseeds whatever that URI points at. Never run it against anything but a scratch database. It also refuses to start without `JWT_SECRET`.

## Configuration

Config comes from **`config.env`** (not `.env`), loaded by `server.js` and `tests/setup.js`. Copy `config.env.template`. The `DATABASE` URI must include the database name in the path — without it Mongoose silently connects to `test` and everything looks empty.

## Architecture

### Localization by response sanitization

This is the central idea and it shapes every model and controller.

Documents store **all** locales inline. `models/schemes/i18nTextSchema.js` and `i18nPriceSchema.js` are _factory functions_ that generate a sub-schema with one key per configured language/currency, so `nameI18n` is `{en, de}` and `priceI18n` is `{USD, EUR}`.

On the way out, `utils/documentSanitizer.js` walks each response document to a fixed depth (8 for lists, 7 for single documents) and deletes every locale except the session's. `controllers/sessionController.js` (`handleLanguage`/`handleCurrency`, registered globally in `app.js`) sets `req.language`/`req.currency` from the `?language=` and `?currency=` query params, falling back to defaults.

Consequences worth knowing:

- Adding a language or currency means editing **`utils/config.js` only** — schemas and the sanitizer both derive from `allowedLanguages`/`allowedCurrencies`.
- The sanitizer reaches into Mongoose internals (`document._doc`, `document.$$populatedVirtuals`). Changes to populate or `.lean()` behaviour can silently break it.
- Nesting deeper than the max level will leak untranslated locales into responses.

`utils/config.js` is the single source of truth for locales, order statuses, user roles, badge styles, allowed image MIME types, and the image dimension map.

### Generic CRUD layer

Most controllers are thin wrappers over `controllers/controllerFactory.js` (`getAll`/`getOne`/`createOne`/`updateOne`/`deleteOne`), combined with `utils/apiFeatures.js` which implements the query-parameter contract: `?page=`, `?limit=`, `?sort=`, `?fields=`, and `?filter=` (a JSON string passed through to a Mongo query, so operators like `$regex`/`$gte`/`$in` work).

Write operations run `utils/requestBodySanitizer.js` against an explicit whitelist passed at the call site — fields not whitelisted are dropped, which is how mass-assignment is prevented. When adding a writable field, update that whitelist or the field will be silently ignored.

**Response envelopes are not uniform.** Match the existing shape when adding endpoints:

| Operation              | Shape                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `getAll`               | `{status, resultsFound, resultsPerPage, resultsTotal, currentPage, pages, data: {documents}}` |
| `getOne` / `updateOne` | `{status, data: {document}}`                                                                  |
| `createOne`            | `{status, data: {data}}` — note the doubled key                                               |

### Nested resources under users

Carts, orders and wishlists are not top-level routes. `routers/userRouter.js` mounts them as `/users/:userId/carts`, `/orders`, `/wishlists`, each with `mergeParams`, and entry routers nest one level deeper again.

`controllerFactory`'s private `getIdConditionsForMany`/`getIdConditionsForOne` translate whichever of `userId`/`cartId`/`orderId`/`wishlistId`/`entryId` are present into a Mongo filter. That is why the same factory functions work at every nesting level — and why adding a new nested resource means teaching those two helpers about its param name.

`sessionController` also exposes `handleUserId*` middlewares that resolve a `:userId` given as **either an ObjectId or an email**, and verify the child document actually belongs to that user.

### Cart / order model hierarchy

`GenericOrder` is the base model; `Cart` and `Order` are Mongoose **discriminators** on it (`discriminatorKey: 'kind'`), so they share one collection. Line items for both live in a single `GenericOrderEntry` model pointing back via `parent`.

`genericOrderSchema.methods.recalculate()` sums entry prices into `total` and saves — call it after any entry mutation. A `pre('findOneAndDelete')` hook cascades entry deletion.

Wishlists are deliberately _not_ part of this hierarchy: separate `Wishlist` + `WishlistEntry` models, with a unique compound index on `{parent, product}`.

### Auth

JWT. `authController.protect` reads the token from an `Authorization: Bearer` header **or** a `jwt` cookie, verifies the user still exists and has not changed their password since the token was issued, then populates `req.user`.

`authController.restrictTo(...roles)` gates by role, where the pseudo-role **`'me'`** means "the authenticated user acting on their own resource" — so `restrictTo('admin', 'me')` is the common pattern for user-owned endpoints. `routers/userRouter.js` applies `protect` to the whole router at the top.

### Categories

A self-referencing tree via `parentCategory`, with a `subCategories` virtual and a `root` virtual. `categoryController.resolveCategoryParam` accepts **either an ObjectId or the unique `code`** in the path and normalizes `req.params.id` before downstream handlers — so `/categories/tents` and `/categories/<oid>` both work.

`productController.handleCategoryId` expands a root category into its children so catalog listings include descendants.

Catalog filter facets (manufacturer list, price min/max, price quick-filter buckets) are built by `aggregateFilters` in `productController.js` via aggregation pipelines against `priceI18n.<currency>`, and returned alongside the documents.

### Images

`utils/imagePathBuilder.js` is a fluent builder producing the canonical path `/img/{resource}s/{size}/{name}_{dimension}.{format}`, where sizes and their pixel dimensions come from `imageDimensionsMap` in `utils/config.js`. Uploads go through multer (memory storage) then sharp resizing in `utils/fileUtils.js`. Files are served statically from `public/`.

### Swagger

Docs are generated from **JSDoc `@swagger` comments inline in the router files**, assembled by `swagger/swaggerConfig.js`, served at `/api/v1/api-docs` (and `/` redirects there). New endpoints need their annotation block in the router or they will not appear.

## Middleware order

`app.js` registers the global chain in a deliberate order: CORS → static → helmet → rate limit (`/api` only, 100/hour/IP, skippable via `RATE_LIMIT_ALLOW_LIST`) → body parsers (10kb) → cookie-parser → xss → hpp → compression → mongo-sanitize → language/currency session handlers → routes → `app.all('*')` 404 → `controllers/errorController.js`.

## Known upgrade blocker

`express-mongo-sanitize@2.2.0` (unmaintained since 2022) assigns `req.query = ...` at `node_modules/express-mongo-sanitize/index.js:113`. In Express 5 `req.query` is getter-only, so this throws on every request. Migrating to Express 5 requires replacing it (`@exortek/express-mongo-sanitize` is the maintained drop-in) and updating the two bare `'*'` wildcard routes in `app.js` to the new syntax.
