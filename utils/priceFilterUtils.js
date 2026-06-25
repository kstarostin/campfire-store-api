/**
 * Round up to a shopper-friendly price ceiling for "Under X" chips.
 */
function roundPriceCeiling(value) {
  if (value <= 0) return 0;
  if (value <= 100) return Math.ceil(value / 10) * 10;
  if (value <= 500) return Math.ceil(value / 50) * 50;
  if (value <= 5000) return Math.ceil(value / 100) * 100;
  if (value <= 10000) return Math.ceil(value / 500) * 500;
  return Math.ceil(value / 1000) * 1000;
}

function buildPriceQuickFilters(prices) {
  const validPrices = prices.filter(
    (price) => typeof price === 'number' && Number.isFinite(price) && price > 0,
  );
  const total = validPrices.length;
  if (total < 2) return [];

  const maxMatches = Math.max(1, Math.floor(total * 0.25));
  const thresholds = [
    ...new Set(validPrices.map((price) => roundPriceCeiling(price))),
  ].sort((left, right) => left - right);

  const quickFilters = [];
  const usedThresholds = new Set();

  for (const threshold of thresholds) {
    if (usedThresholds.has(threshold)) continue;

    const count = validPrices.filter((price) => price < threshold).length;
    if (count >= 1 && count <= maxMatches) {
      quickFilters.push({ max: threshold, count });
      usedThresholds.add(threshold);
    }
  }

  return quickFilters.slice(0, 3);
}

/**
 * Remove client-applied catalog filters so quick-filter suggestions stay stable.
 */
function stripCatalogClientFilters(filter, currency) {
  if (!filter || typeof filter !== 'object') return {};

  const priceKey = `priceI18n.${currency}`;

  if (Array.isArray(filter.$and)) {
    const parts = filter.$and.filter(
      (part) => part && !part.manufacturer && !part[priceKey],
    );

    if (parts.length === 0) return {};
    if (parts.length === 1) return { ...parts[0] };
    return { $and: parts };
  }

  const scope = { ...filter };
  delete scope.manufacturer;
  delete scope[priceKey];
  return scope;
}

module.exports = {
  roundPriceCeiling,
  buildPriceQuickFilters,
  stripCatalogClientFilters,
};
