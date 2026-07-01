# Product expansion workflow

Step-by-step process for adding SKUs during Phase 2. See also:

- [CATALOG_PRODUCT_EXPANSION_PLAN.md](../docs/CATALOG_PRODUCT_EXPANSION_PLAN.md)
- [CATALOG_PRODUCT_IMAGE_SOURCES.md](../docs/CATALOG_PRODUCT_IMAGE_SOURCES.md)

## Roles

| Step | Who |
|------|-----|
| Product stub (JSON without images) | Agent — **creates** `dev-tools/image-staging/{product-id}/` |
| Review PDP + download source image | You — drop **any filename** into that folder |
| Crop/convert derivatives + wire `images[]` | Agent (`process-staged-images.js`) |
| Confirm or skip | You |
| Cleanup staging | Agent — **delete** `image-staging/{product-id}/` after success **or** on skip |

## 1. Staging folder

The agent creates an empty folder per product:

```text
dev-tools/image-staging/{product-id}/
```

Drop 1–5 source files there (any name; `.jpg`, `.jpeg`, `.png`, `.webp`). After successful processing or if the SKU is skipped, the folder is removed.

**Fit hints for the agent when processing:**

- Wide opaque studio shot → `--fit contain` (auto edge color pad)
- Transparent PNG → `--fit contain` (auto white flatten/pad)
- Square packshot → `--fit cover` (default)

## 2. Product ID

Generate a new MongoDB ObjectId:

```bash
npm run product:id
```

Keep the same `_id` for the life of the SKU (cart/order safe).

## 3. Product JSON stub

One file per leaf category: `dev-tools/data/products/{leaf-code}.json`

Stub shape (no `images` until staged):

```json
{
  "_id": "<product-id>",
  "name": "Model Name",
  "manufacturer": "Brand",
  "category": "<leaf category _id from category-map.json>",
  "priceI18n": { "EUR": 0, "USD": 0 },
  "descriptionI18n": { "en": "…", "de": "…" },
  "manufacturerUrl": "https://…"
}
```

After images are processed, add `taglineI18n`, `highlights` via `product-metadata.js` + `npm run product:enrich`.

## 4. Process staged images

When files are in the staging folder:

```bash
npm run product:images -- <product-id> \
  --fit contain \
  --product-file dev-tools/data/products/whitewater-kayaks.json
```

Options:

- `--fit cover` — center crop to square (default; good for packshots)
- `--fit contain` — letterbox to square; **auto-detects pad color** from image edges for opaque JPEGs/WebPs. Wide products (kayaks, skis) stay uncropped.
- **Transparent PNGs** — automatically flattened and padded with **white** (`#ffffff`).
- `--bg #d4d4d4` — override background for any format
- `--dry-run` — preview without writing files

This writes derivatives to `public/img/products/` and patches `images[]` on the product JSON.

## 5. Skip a product

If the PDP has no usable image:

1. Remove the stub from the category JSON file.
2. Agent deletes `dev-tools/image-staging/{product-id}/`.
3. Move to the next SKU.

## 6. Reseed locally

```bash
node dev-tools/data/import-test-data.js --recreate
```

## Category IDs

Quick lookup: `dev-tools/data/category-map.json` (generated from `categories.json`).
