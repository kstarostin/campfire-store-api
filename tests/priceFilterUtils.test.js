const { buildPriceQuickFilters, roundPriceCeiling, stripCatalogClientFilters } = require('../utils/priceFilterUtils');

describe('priceFilterUtils', () => {
  test('roundPriceCeiling rounds to shopper-friendly values', () => {
    expect(roundPriceCeiling(84)).toBe(90);
    expect(roundPriceCeiling(420)).toBe(450);
    expect(roundPriceCeiling(2699)).toBe(2700);
    expect(roundPriceCeiling(4299)).toBe(4300);
  });

  test('buildPriceQuickFilters omits thresholds that match nothing', () => {
    const prices = [2699, 2799, 2999, 3199, 3999, 4299];
    const quickFilters = buildPriceQuickFilters(prices);
    const maxMatches = Math.max(1, Math.floor(prices.length * 0.25));

    expect(quickFilters.length).toBeGreaterThan(0);
    expect(quickFilters.every((filter) => filter.count >= 1)).toBe(true);
    expect(quickFilters.every((filter) => filter.count <= maxMatches)).toBe(true);
    expect(quickFilters.some((filter) => filter.max < 500)).toBe(false);
  });

  test('buildPriceQuickFilters returns suggestions for affordable catalogs', () => {
    const quickFilters = buildPriceQuickFilters([
      49, 59, 79, 89, 99, 120, 140, 180, 220, 260, 320, 380,
    ]);

    expect(quickFilters.length).toBeGreaterThan(0);
    expect(quickFilters[0].max).toBeLessThan(500);
  });

  test('stripCatalogClientFilters keeps category scope but removes price and manufacturer', () => {
    const scope = stripCatalogClientFilters(
      {
        category: { $in: ['abc'] },
        manufacturer: 'Canyon',
        'priceI18n.EUR': { $lt: 3000 },
      },
      'EUR',
    );

    expect(scope).toEqual({
      category: { $in: ['abc'] },
    });
  });
});
