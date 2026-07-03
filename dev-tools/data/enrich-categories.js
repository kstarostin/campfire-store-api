const fs = require('fs');
const path = require('path');
const categoryCopy = require('./category-copy');

const categoriesPath = path.join(__dirname, 'categories.json');
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

let enrichedCount = 0;

const enriched = categories.map((category) => {
  const copy = categoryCopy[category.code];
  if (!copy) {
    return category;
  }

  enrichedCount += 1;
  const next = { ...category };

  if (copy.titleI18n) {
    next.titleI18n = copy.titleI18n;
  }
  if (copy.descriptionI18n) {
    next.descriptionI18n = copy.descriptionI18n;
  }
  if (copy.image) {
    next.image = copy.image;
  }

  return next;
});

fs.writeFileSync(categoriesPath, `${JSON.stringify(enriched, null, 2)}\n`);
console.log(`Enriched ${enrichedCount} categories in categories.json`);
