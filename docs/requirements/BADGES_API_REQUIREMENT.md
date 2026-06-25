# Feature requirement: Product badges (Badge collection)

**Target repo:** `campfire-store-api`  
**Stack:** Node.js 20, Express 4, Mongoose 8, MongoDB  
**Consumer:** `campfire-store` frontend — renders badge text from API responses; layout/CSS rules only  
**Reference implementation:** **Titles** (`Title` model, `/titles` routes, address `title` ref)  
**Version:** V1

---

## 1. Goal

Add a **manageable `Badge` collection** and allow products to reference badges, following the same patterns as **Titles** (salutation labels used on user addresses).

Badges are **reference data** (`code` + `nameI18n`), assigned to products by ObjectId. Product read endpoints **populate** badge references (like `address.title` is populated on user reads).

The frontend must **not** invent badge labels or business rules. It renders populated `nameI18n` (already scoped to session `language` by `DocumentSanitizer`) and applies only presentation rules (sort by `priority`, max visible count, map `style` → CSS class).

**Unchanged:** `isFeatured` / `featureOrder` on products (homepage featured row).

---

## 2. Confirmed product decisions

| Topic | Decision |
| ----- | -------- |
| Model pattern | Mirror **Title** — separate collection, `code` + `nameI18n` |
| Badge CRUD | Admin-only for write; **public GET** (same as `/titles`) |
| Product assignment | Product `POST` / `PATCH` whitelist only |
| Inactive badges | Omit from populated product `badges[]` on read |
| Auto badges | Manual only in V1 |
| Visual style | Enum: `primary` \| `forest` \| `neutral` |
| Delete policy | **Block delete** if badge is assigned to any product |

---

## 3. Existing API patterns to follow

Study these files before implementing:

| Concern | Reference files |
| ------- | ---------------- |
| Title model | `models/titleModel.js` |
| Title CRUD | `controllers/titleController.js` |
| Title routes + Swagger JSDoc | `routers/titleRouter.js` |
| Reference on parent doc | `models/schemes/addressSchema.js` (`title: ObjectId ref Title`) |
| Populate on read | `models/userModel.js` pre(`/^find/`) populate `deliveryAddresses.title` |
| Generic CRUD | `controllers/controllerFactory.js` |
| i18n text fields | `models/schemes/i18nTextSchema.js` + `utils/config.js` `allowedLanguages` |
| Ref validation | `models/middleware/validateRefId.js` (used on `product.category`) |
| Response sanitization | `utils/documentSanitizer.js` (strips non-session languages from `*i18n*` fields) |
| Product list/detail | `controllers/productController.js`, `models/productModel.js` |
| App mount | `app.js` → `/api/v1/...` |
| Swagger | `swagger/swaggerConfig.js`, `swagger/components.yaml`, `swagger/parameters.yaml` |
| Seed data | `dev-tools/data/titles.json`, `dev-tools/data/db-seed.js` |

### 3.1 How Titles work today (template for Badges)

**`Title` schema:**
- `code` — unique string slug (2–16 chars)
- `nameI18n` — required, via `i18nTextSchema` (max 8 chars per language in Title; **badges need a longer limit** — see §4.1)
- `createdAt` / `updatedAt` — `select: false`

**`/api/v1/titles`:**
- `GET /` and `GET /:id` — **public**, support `language`, pagination, sort, fields (via `controllerFactory.getAll` / `getOne`)
- `POST /`, `PATCH /:id`, `DELETE /:id` — `authController.protect` + `restrictTo('admin')`
- Create/update body whitelist: `['code', 'nameI18n']`

**Usage on another document:**
- `addressSchema.title` → `ObjectId ref 'Title'`
- User `pre(/^find/)` populates nested `title` with `select: '_id code nameI18n'`
- API returns populated object; `DocumentSanitizer` leaves only `nameI18n[sessionLanguage]`

**Badges should follow this same architecture.**

---

## 4. Data model

### 4.1 `Badge` model — `models/badgeModel.js`

Mirror `titleModel.js` structure. Add badge-specific fields.

```js
{
  createdAt: Date,      // select: false
  updatedAt: Date,      // select: false
  code: String,         // required, unique, 2–16 chars (same rules as Title)
  nameI18n: {           // required, i18nTextSchema
    en: String,
    de: String
  },
  style: String,        // enum: 'primary' | 'forest' | 'neutral', default 'primary'
  active: Boolean       // default true
}
```

**`nameI18n` maxlength:** use **24** characters per language (Title uses 8 for “Mr.” / “Frau”; badge labels like “Bestseller” need more room).

**Indexes:**
- `{ code: 1 }` unique
- `{ active: 1 }`

**Style enum:** add `allowedBadgeStyles` to `utils/config.js` (same pattern as `allowedUserRoles`).

**No `sortOrder` on Badge in V1** — list sort can use `code` or `createdAt` via existing `APIFeatures` query params (Titles have no `sortOrder` either).

---

### 4.2 Product badge assignment — subdocument schema

Create `models/schemes/productBadgeSchema.js` (parallel to `addressSchema.js` embedding a ref):

```js
{
  badge: {
    type: ObjectId,
    ref: 'Badge',
    required: true
  },
  priority: {
    type: Number,
    required: true,
    min: 1
  }
}
```

**Validate** `badge` ref with `validateRefId` against `Badge` model (same pattern as `product.category` → `Category`).

---

### 4.3 `Product` model changes — `models/productModel.js`

Add to product schema (alongside existing `isFeatured`, `featureOrder`):

```js
badges: [productBadgeSchema]   // default []
```

**Rules:**
- No duplicate `badge` ObjectId on the same product
- On save/update: reject assignments to non-existent or **inactive** badges (validator or controller check)

**Query middleware** — extend existing `productSchema.pre('find', …)`:

```js
.populate({
  path: 'badges.badge',
  select: '_id code nameI18n style active',
})
```

**Post-populate / pre-response filtering (product reads):**
- Remove assignment entries where populated `badge` is `null` (orphan ref) or `active === false`
- Sort assignments by `priority` ascending before response

Implement filtering in a shared helper (e.g. `utils/productBadgeUtils.js`) called from `productController.getAllProducts`, `factory.getOne`, and category products handler — **do not duplicate logic in three places**.

**Index (optional):**
- `{ 'badges.badge': 1 }` — supports delete-guard count query

---

## 5. API surface

### 5.1 Badge routes — `routers/badgeRouter.js`

Clone `routers/titleRouter.js` structure. Mount in `app.js`:

```js
app.use(`${apiPath}/badges`, badgeRouter);
```

| Method | Path | Auth | Handler |
| ------ | ---- | ---- | ------- |
| `GET` | `/badges` | Public | `badgeController.getAllBadges` |
| `POST` | `/badges` | Admin | `badgeController.createBadge` |
| `GET` | `/badges/:id` | Public | `badgeController.getBadge` |
| `PATCH` | `/badges/:id` | Admin | `badgeController.updateBadge` |
| `DELETE` | `/badges/:id` | Admin | `badgeController.deleteBadge` |

**Controller** — `controllers/badgeController.js` (mirror `titleController.js`):

```js
exports.getAllBadges = factory.getAll(Badge, { defaultLimit: 25, maxLimit: 100 });
exports.getBadge = factory.getOne(Badge);
exports.createBadge = factory.createOne(Badge, ['code', 'nameI18n', 'style', 'active']);
exports.updateBadge = factory.updateOne(Badge, ['code', 'nameI18n', 'style', 'active']);
exports.deleteBadge = factory.deleteOne(Badge); // wrap with assignment guard — see §5.3
```

Swagger JSDoc: copy Title tag/block pattern; tag name `Badges`.

---

### 5.2 Product assignment — existing product routes

Add `badges` to whitelists in `controllers/productController.js`:

**`createProduct`** (`factory.createOne` whitelist):

```js
'badges',
```

**`updateProduct`** (`sanitizerWhitelist`):

```js
'badges',
```

**Request body shape** (write):

```json
{
  "badges": [
    { "badge": "507f1f77bcf86cd799439011", "priority": 1 },
    { "badge": "507f191e810c19729de860ea", "priority": 2 }
  ]
}
```

**Validation on create/update:**
- Each `badge` is valid ObjectId referencing an **active** `Badge`
- Unique badge per product
- `priority` integer ≥ 1
- Replacing `badges` array on PATCH replaces entire assignment list (standard Mongoose array replace)

---

### 5.3 Delete guard — `DELETE /badges/:id`

Before delete, count products referencing this badge:

```js
Product.countDocuments({ 'badges.badge': badgeId })
```

If count > 0 → `409` with message indicating how many products reference it. Admin must unassign first.

(`deleteTitle` today has no such guard; badges **should** — product assignments are expected to be more numerous than address salutations.)

---

### 5.4 Product read responses (populated shape)

Apply badge population + filtering on:

- `GET /products` (`productController.getAllProducts`)
- `GET /products/:id` (`factory.getOne`)
- `GET /categories/:id/products` (same `getAllProducts` handler)

**Example product fragment** (`language=en`):

```json
{
  "_id": "...",
  "name": "Trail Runner Pro",
  "isFeatured": true,
  "featureOrder": 2,
  "badges": [
    {
      "priority": 1,
      "badge": {
        "_id": "...",
        "code": "bestseller",
        "nameI18n": { "en": "Bestseller" },
        "style": "primary"
      }
    },
    {
      "priority": 2,
      "badge": {
        "_id": "...",
        "code": "new",
        "nameI18n": { "en": "New" },
        "style": "forest"
      }
    }
  ]
}
```

**Notes:**
- Shape mirrors populated `address.title` on user reads — **no separate flattened DTO**
- `DocumentSanitizer` removes non-session `nameI18n` keys (existing behavior)
- Do **not** expose `active` on populated badge subdocs in product responses (inactive badges are already filtered out)
- `badges` array is sorted by `priority` ascending in API response
- List envelope unchanged: `{ status, resultsTotal, data: { documents, filters } }`

---

## 6. Swagger / docs

1. `swagger/swaggerConfig.js` — add `Badge` to `mongooseToSwagger` definitions:

   ```js
   const Badge = require('../models/badgeModel');
   // definitions: { Badge: mongooseToSwagger(Badge, { omitFields }), ... }
   ```

2. `swagger/components.yaml` — add `badgesSchema` / `badgeSchema` (copy `titlesSchema` / `titleSchema` pattern)

3. `swagger/parameters.yaml` — add `badgeId` parameter (copy `titleId`)

4. `routers/badgeRouter.js` — full Swagger JSDoc blocks (copy from `titleRouter.js`)

5. Regenerated `Product` definition will include `badges` after model update

---

## 7. Seed data

### 7.1 `dev-tools/data/badges.json`

```json
[
  {
    "_id": "662b497f11aed4312b44a010",
    "code": "bestseller",
    "nameI18n": { "en": "Bestseller", "de": "Bestseller" },
    "style": "primary",
    "active": true
  },
  {
    "_id": "662b497f11aed4312b44a011",
    "code": "new",
    "nameI18n": { "en": "New", "de": "Neu" },
    "style": "forest",
    "active": true
  }
]
```

### 7.2 `dev-tools/data/db-seed.js`

- Import `Badge` model
- `performImport`: `Badge.create(seedData.badges)` **before** products (products may reference badges)
- `performDelete`: `Badge.deleteMany()` **after** products

### 7.3 Sample product assignments

Assign 1–2 badges to a few seed products in product JSON files, e.g.:

```json
"badges": [
  { "badge": "662b497f11aed4312b44a010", "priority": 1 }
]
```

---

## 8. Config addition — `utils/config.js`

```js
exports.allowedBadgeStyles = ['primary', 'forest', 'neutral'];
exports.defaultBadgeStyle = 'primary';
```

Use in `badgeModel.js` enum validation (same pattern as `allowedUserRoles` on user model).

---

## 9. Tests — `tests/regression.test.js`

Add minimal regression cases:

- [ ] `GET /badges` returns seeded badges (public, no auth)
- [ ] `GET /products/:id` includes populated `badges[].badge.code` for a seeded product
- [ ] `POST /badges` without token → `401`
- [ ] `DELETE /badges/:id` when assigned to a product → `409`

Follow existing supertest patterns in the regression suite.

---

## 10. Acceptance criteria

- [ ] `models/badgeModel.js` with `code`, `nameI18n`, `style`, `active`
- [ ] `models/schemes/productBadgeSchema.js`
- [ ] `controllers/badgeController.js` using `controllerFactory`
- [ ] `routers/badgeRouter.js` + mounted in `app.js`
- [ ] Product schema has `badges[]`; ref validation on `badge` field
- [ ] Product reads populate and filter inactive/orphan badge assignments
- [ ] Product reads return `badges` sorted by `priority`
- [ ] `badges` on product create/update whitelists with validation
- [ ] `DELETE /badges/:id` blocked when products reference badge
- [ ] Seed: `badges.json` + `db-seed.js` updated; sample products assigned
- [ ] Swagger updated (model, routes, parameters, components)
- [ ] Regression tests added
- [ ] `isFeatured` / `featureOrder` behavior unchanged

---

## 11. Out of scope (V1)

- Rule-based badges (auto “new” from `createdAt`)
- Bulk assignment endpoint
- Assigning products from badge side
- Badge icons, links, custom colors beyond `style` enum
- Frontend `ProductCard` changes (separate task in `campfire-store`)
- Changing Title model or address behavior

---

## 12. Frontend contract (`campfire-store`)

After API ships, the storefront will consume populated badges **like titles on addresses** — no label key mapping.

**Expected TypeScript types:**

```ts
interface Badge {
  _id: string
  code: string
  nameI18n: Partial<Record<'en' | 'de', string>>
  style?: 'primary' | 'forest' | 'neutral'
}

interface ProductBadgeAssignment {
  priority: number
  badge: Badge
}

interface Product {
  // …
  badges?: ProductBadgeAssignment[]
}
```

**Display label:** read the single language value from `badge.nameI18n` after `DocumentSanitizer` (same approach as category names in `parseCategoryList`).

**Layout-only UI rules:**
- Sort by `priority` if needed (prefer API-pre-sorted)
- Show max 1–2 badges on card
- Map `badge.style` → CSS: `primary` (orange), `forest` (emerald), `neutral` (muted)

---

## 13. File checklist (implementation order)

1. `utils/config.js` — `allowedBadgeStyles`
2. `models/badgeModel.js`
3. `models/schemes/productBadgeSchema.js`
4. `models/productModel.js` — field + populate + validation
5. `utils/productBadgeUtils.js` — filter inactive, sort by priority
6. `controllers/badgeController.js`
7. `routers/badgeRouter.js`
8. `app.js` — mount router
9. `controllers/productController.js` — whitelist + call filter helper on reads
10. `dev-tools/data/badges.json` + `db-seed.js` + sample product JSON updates
11. `swagger/*` + `swaggerConfig.js`
12. `tests/regression.test.js`

---

## 14. Difference from initial draft (intentional changes)

| Initial draft | Revised (aligned with API) |
| ------------- | -------------------------- |
| `key` field | **`code`** (like Title) |
| `labelI18n` / flat `label` | **`nameI18n`** + `DocumentSanitizer` |
| Computed `badges[]` DTO | **Populated refs** `{ priority, badge: { _id, code, nameI18n, style } }` |
| Admin-only `GET /badges` | **Public GET** (like `/titles`) |
| Custom controllers | **`controllerFactory`** pattern |
| `sortOrder` on Badge | **Not in V1** (use query `sort` param) |
