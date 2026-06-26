#!/usr/bin/env node
/**
 * Enriches product seed JSON with manufacturerUrl, taglineI18n, and highlights.
 * Renames originalUrl -> manufacturerUrl.
 */
const fs = require('fs');
const path = require('path');
const metadataById = require('./product-metadata');

const productsDir = path.join(__dirname, 'products');
const files = fs
  .readdirSync(productsDir)
  .filter((name) => name.endsWith('.json'))
  .sort();

let updated = 0;
let missing = [];

for (const filename of files) {
  const filePath = path.join(productsDir, filename);
  const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const enriched = products.map((product) => {
    const meta = metadataById[product._id];
    if (!meta) {
      missing.push(`${filename}:${product._id}:${product.name}`);
    }

    const { originalUrl, ...rest } = product;
    const manufacturerUrl = product.manufacturerUrl ?? originalUrl;

    return {
      ...rest,
      ...(manufacturerUrl ? { manufacturerUrl } : {}),
      ...(meta?.taglineI18n ? { taglineI18n: meta.taglineI18n } : {}),
      ...(meta?.highlights ? { highlights: meta.highlights } : {}),
    };
  });

  fs.writeFileSync(filePath, `${JSON.stringify(enriched, null, 2)}\n`);
  updated += enriched.length;
}

if (missing.length) {
  console.error('Missing metadata for:');
  missing.forEach((line) => console.error(`  - ${line}`));
  process.exit(1);
}

console.log(`Enriched ${updated} products across ${files.length} files.`);
