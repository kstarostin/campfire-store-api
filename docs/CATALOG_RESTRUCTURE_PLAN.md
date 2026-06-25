# Campfire Store — Catalog restructure plan

**Status:** Draft for implementation  
**Scope:** Category tree only (Phase 1). Product assortment expansion follows in Phase 2.  
**Target catalog size (later):** ~450 products  
**Repos:** `campfire-store-api` (source of truth), `campfire-store` (consumer)

---

## 1. Goals

1. **Balance the storefront** — today bikes are ~55% of SKUs; camping, kayaks, clothing, and ski read as stubs.
2. **Clearer merchandising** — rename **Accessories → Bags & gear**; grow **Camping** and **Clothing** into real departments.
3. **Sport-specific accessories** — each root gets a dedicated `*-accessories` leaf where it makes sense.
4. **Stable product references** — keep existing category MongoDB `_id` values wherever possible so current products do not need re-linking in Phase 1.
5. **Code-based URLs** — category `code` is the public slug (`/categories/gravel-bikes`). Renaming `accessories` → `bags-and-gear` is a deliberate URL change (documented below).

---

## 2. Design principles (Options A + B)

| Principle | Decision |
|-----------|----------|
| Root depth | Keep **two levels** only: root → leaf. No third level (no “Men’s / Women’s” categories). |
| Rename | **Accessories** root becomes **Bags & gear** (`bags-and-gear`). |
| Cross-cutting gear | Backpacks, lighting, poles stay under **Bags & gear**. |
| Sport-specific gear | Paddles/PFDs → **kayak-accessories**; helmets/lights → **cycling-accessories**; lanterns/chairs → **camping-accessories**; poles/goggles → **ski-accessories**. |
| Footwear | New **Footwear** root (Option B) — too important to bury under Clothing. |
| Camping depth | Split into tents, sleep, kitchen, and camp accessories (Option A). |
| Clothing depth | Split pants, jackets, midlayers, shorts/tights; optional hats/gloves leaf. |
| Empty leaves | New leaves ship **empty** in Phase 1; populate in Phase 2. Exception: fill **whitewater-kayaks** and **inflatable-kayaks** early in Phase 2 (currently embarrassing in the grid). |
| Icons | Reuse existing API icon enum where possible; extend only if needed (see §6). |

---

## 3. Current tree (49 products)

```
Kayaks
├── touring-kayaks          1
├── whitewater-kayaks       0
└── inflatable-kayaks       0

Bicycles
├── road-bikes              6
├── gravel-bikes           10
└── mountain-bikes         11

Camping
└── tents                   1

Accessories                  ← rename
└── backpacks               9

Clothing
└── hiking-pants           10

Ski
└── all-mountain            1
```

---

## 4. Target tree (Phase 1 — categories only)

```
Kayaks                          [icon: sailboat]
├── touring-kayaks              existing
├── whitewater-kayaks           existing
├── inflatable-kayaks           existing
└── kayak-accessories           NEW — paddles, PFDs, sprayskirts, roof racks

Bicycles                        [icon: bike]
├── road-bikes                  existing
├── gravel-bikes                existing
├── mountain-bikes              existing
├── e-bikes                     NEW (optional 1b — add when ready for ~15 SKUs)
└── cycling-accessories         NEW — helmets, bike lights, bikepacking bags, locks

Camping                         [icon: tent]
├── tents                       existing
├── sleeping-bags               NEW
├── sleeping-pads               NEW
├── camp-kitchen                NEW — stoves, cookware, water filters
└── camping-accessories         NEW — lanterns, camp furniture, repair kits, tarps

Bags & gear                     [icon: backpack]  ← renamed from Accessories
├── backpacks                   existing (same _id, same parent _id)
├── lighting-tools              NEW — headlamps, flashlights (cross-sport)
└── trekking-poles              NEW — hiking poles (cross-sport)

Clothing                        [icon: shirt]
├── hiking-pants                existing
├── jackets-shells              NEW — hardshells, rain jackets, insulated shells
├── midlayers-fleece            NEW — fleece, down jackets, synthetic midlayers
├── shorts-tights               NEW — shorts, tights, running/trail bottoms
└── clothing-accessories        NEW — gloves, hats, beanies, belts

Footwear                        [icon: sport-shoe]  NEW ROOT
├── hiking-boots                NEW — waterproof hikers, backpacking boots
└── trail-runners               NEW — trail shoes, lightweight hikers

Ski                             [icon: mountain]
├── all-mountain                existing
├── piste-freeride-skis         NEW — carve / all-mountain / freeride skis (split later if SKU count grows)
├── ski-boots                   NEW
└── ski-accessories             NEW — poles, goggles, ski packs
```

**Phase 1 category count:** 6 roots → **7 roots**; 9 leaves → **28 leaves** (+19 new, 0 removed).

---

## 5. Category change manifest

### 5.1 In-place updates (keep `_id`)

| `_id` | Old `code` | New `code` | `nameI18n.en` | `nameI18n.de` | `icon` |
|-------|------------|------------|---------------|---------------|--------|
| `661f9bf7adbbcb8a078d7a09` | `accessories` | `bags-and-gear` | Bags & gear | Rucksäcke & Ausrüstung | `backpack` |

> **URL impact:** `/categories/accessories` stops working. Storefront and bookmarks should use `/categories/bags-and-gear`. Optional: temporary API alias redirect (not required for demo).

All other existing categories: **no `_id` or `code` changes**.

### 5.2 New categories (generate new ObjectIds at implementation time)

Use `new ObjectId()` in a seed script or `dev-tools/generate-category-ids.js`. Record assigned IDs in `categories.json` once generated.

| `code` | Parent root `code` | `nameI18n.en` | `nameI18n.de` | `icon` | Priority |
|--------|-------------------|---------------|---------------|--------|----------|
| `kayak-accessories` | `kayaks` | Kayak accessories | Kajak-Zubehör | `sailboat` | P1 |
| `cycling-accessories` | `bicycles` | Cycling accessories | Fahrrad-Zubehör | `bike` | P1 |
| `e-bikes` | `bicycles` | E-bikes | E-Bikes | `bike` | P2 (optional) |
| `sleeping-bags` | `camping` | Sleeping bags | Schlafsäcke | `tent` | P1 |
| `sleeping-pads` | `camping` | Sleeping pads | Isomatten | `tent` | P1 |
| `camp-kitchen` | `camping` | Camp kitchen | Campingküche | `tent` | P1 |
| `camping-accessories` | `camping` | Camping accessories | Camping-Zubehör | `tent` | P1 |
| `lighting-tools` | `bags-and-gear` | Lighting & tools | Beleuchtung & Werkzeug | `backpack` | P1 |
| `trekking-poles` | `bags-and-gear` | Trekking poles | Trekkingstöcke | `backpack` | P2 |
| `jackets-shells` | `clothing` | Jackets & shells | Jacken & Hardshells | `shirt` | P1 |
| `midlayers-fleece` | `clothing` | Midlayers & fleece | Midlayer & Fleece | `shirt` | P1 |
| `shorts-tights` | `clothing` | Shorts & tights | Shorts & Tights | `shirt` | P1 |
| `clothing-accessories` | `clothing` | Clothing accessories | Bekleidungszubehör | `shirt` | P2 |
| `footwear` | — (root) | Footwear | Schuhe | `sport-shoe` | P1 |
| `hiking-boots` | `footwear` | Hiking boots | Wanderstiefel | `sport-shoe` | P1 |
| `trail-runners` | `footwear` | Trail runners | Trailschuhe | `sport-shoe` | P1 |
| `piste-freeride-skis` | `ski` | Piste & freeride skis | Pisten- & Freeride-Ski | `mountain` | P1 |
| `ski-boots` | `ski` | Ski boots | Skischuhe | `mountain` | P1 |
| `ski-accessories` | `ski` | Ski accessories | Ski-Zubehör | `mountain` | P1 |

**P1** = include in first category PR. **P2** = can follow immediately after without blocking product work.

---

## 6. Icon enum extension (Phase 1a — coordinated API + storefront)

Current allowed keys (`categoryIconUtils.js`): `sailboat`, `bike`, `tent`, `backpack`, `shirt`, `mountain`, `package`.

**Add for this restructure:**

| Key | Lucide component | Used by |
|-----|------------------|---------|
| `sport-shoe` | `SportShoe` | `footwear`, `hiking-boots`, `trail-runners` |

Update in sync:

- `campfire-store-api/utils/categoryIconUtils.js`
- `campfire-store/src/lib/categoryIcons.tsx`

Optional later (not required for Phase 1):

| Key | Lucide component | Used by |
|-----|------------------|---------|
| `flame` | `Flame` | `camp-kitchen` (if `tent` feels wrong on that leaf) |

---

## 7. Implementation phases — categories only

### Phase 1a — API category data

1. Edit `dev-tools/data/categories.json`:
   - Apply rename manifest (§5.1).
   - Append new categories (§5.2) with generated `_id` values.
2. Reseed or migrate:
   - **Dev:** `recreateTestData()` (destructive — acceptable locally).
   - **Prod:** targeted `updateOne` on renamed root + `insertMany` for new leaves (preserve product `category` refs).
3. No product JSON changes in this step.

**Files touched (API):**

- `dev-tools/data/categories.json`
- `utils/categoryIconUtils.js` — add `sport-shoe` to icon enum
- `tests/regression.test.js` (if any test hardcodes `accessories`)

### Phase 1b — Storefront alignment

1. Remove or update `src/data/staticCategories.ts` if still referenced (prefer API-driven categories everywhere).
2. Verify `CategoriesPage` / `CategoryDetailPage` render 7 roots and new subcategory grids.
3. No i18n category names in frontend — names come from API `nameI18n`.

**Files touched (store):**

- `src/lib/categoryIcons.tsx` — map `sport-shoe` → `SportShoe`
- `src/data/staticCategories.ts` (update or delete)
- Any hardcoded links to `/categories/accessories` → `/categories/bags-and-gear`

### Phase 1c — Verification

- [ ] `GET /categories` returns 7 roots, correct `subCategories` counts.
- [ ] `GET /categories/bags-and-gear` resolves renamed root.
- [ ] `GET /categories/backpacks` still works; parent is bags-and-gear.
- [ ] All 9 existing product-bearing leaves still return the same product counts.
- [ ] New leaves return `total: 0` (empty catalog) without errors.
- [ ] Storefront category grid and subcategory pages match API tree.

---

## 8. Product assignment rules (Phase 2 preview — not in Phase 1)

When filling assortment (~450 SKUs), use this mapping. **No product moves in Phase 1.**

### 8.1 Keep in current leaf (no move)

| Leaf | Current SKUs | Notes |
|------|-------------|-------|
| `backpacks` | 9 | Stays under renamed `bags-and-gear` |
| `hiking-pants` | 10 | Keep true pants only |
| `road-bikes`, `gravel-bikes`, `mountain-bikes` | 27 | Bulk expansion in place |
| `touring-kayaks`, `all-mountain`, `tents` | 3 | Expand in place |

### 8.2 Reassign in Phase 2 (taxonomy cleanup)

| Product | From | To |
|---------|------|-----|
| Fjällräven Nikka Shorts Curved Women | `hiking-pants` | `shorts-tights` |
| Patagonia Women's Pack Out Tights | `hiking-pants` | `shorts-tights` |

### 8.3 Phase 2 priority fill order (by empty-leaf visibility)

1. **whitewater-kayaks**, **inflatable-kayaks** (~12–15 SKUs each)  
2. **sleeping-bags**, **tents** expansion (~20–25 each)  
3. **jackets-shells**, **hiking-boots** (~25–30 each)  
4. **kayak-accessories**, **camp-kitchen**, **cycling-accessories**  
5. Bike depth, ski expansion, remaining leaves  

Full SKU targets and real product lists: [CATALOG_PRODUCT_EXPANSION_PLAN.md](./CATALOG_PRODUCT_EXPANSION_PLAN.md).

### 8.4 Target SKU distribution (~450 total)

| Department | Target SKUs |
|------------|-------------|
| Bicycles (+ e-bikes when added) | 110–120 |
| Clothing (+ clothing-accessories) | 95–110 |
| Camping | 75–90 |
| Bags & gear | 50–60 |
| Footwear | 45–55 |
| Kayaks (+ kayak-accessories) | 35–45 |
| Ski | 35–45 |

---

## 9. Seed / migration checklist

```text
[ ] Generate ObjectIds for 19 new categories; commit in categories.json
[ ] Rename accessories → bags-and-gear (code + nameI18n only)
[ ] Run local reseed; confirm 49 products unchanged
[ ] Update regression tests for bags-and-gear code
[ ] Deploy API before or with storefront (category codes are API-driven)
[ ] Smoke-test category URLs for all 28 leaves
[ ] Document breaking URL: accessories → bags-and-gear
```

---

## 10. Open decisions (confirm before implementation)

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | Include `e-bikes` leaf in Phase 1a or wait? | **Wait (P2)** until bike expansion sprint — avoids another empty grid cell. |
| 2 | Include `trekking-poles` and `clothing-accessories` in Phase 1a? | **P2** — lower urgency than sleep, jackets, footwear. |
| 3 | Split `piste-freeride-skis` into two leaves later? | **Yes**, when ski SKU count &gt; ~25. |
| 4 | API redirect `accessories` → `bags-and-gear`? | **Skip** for demo; note in changelog. |
| 5 | Add `sport-shoe` icon in same PR? | **Yes** — coordinated API + UI change (§6). |

---

## 11. Related documents

| Document | When |
|----------|------|
| `CATALOG_PRODUCT_EXPANSION_PLAN.md` | Phase 2 — SKU targets, sprint order, real product seed lists, image pipeline |
| `FRONTEND_UI_REQUIREMENTS.md` (store) | Update category examples if they mention Accessories |

---

_Last updated: 2026-06-25. Category restructure only; product data unchanged until Phase 2._
