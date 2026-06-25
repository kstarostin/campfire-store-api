/**
 * Escapes user input for safe use inside a RegExp.
 * @param {string} value
 * @returns {string}
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds $or conditions for a single search term.
 * @param {RegExp} regex
 * @param {import('mongoose').Types.ObjectId[]} categoryIds
 * @returns {object[]}
 */
function buildTermOrConditions(regex, categoryIds) {
  const conditions = [
    { name: regex },
    { manufacturer: regex },
    { 'descriptionI18n.en': regex },
    { 'descriptionI18n.de': regex },
  ];

  if (categoryIds.length > 0) {
    conditions.push({ category: { $in: categoryIds } });
  }

  return conditions;
}

/**
 * Finds categories whose localized names or code match the term.
 * @param {RegExp} regex
 * @returns {Promise<import('mongoose').Types.ObjectId[]>}
 */
async function findMatchingCategoryIds(regex, Category) {
  const matchingCategories = await Category.find({
    $or: [
      { 'nameI18n.en': regex },
      { 'nameI18n.de': regex },
      { code: regex },
    ],
  })
    .select('_id')
    .lean();

  return matchingCategories.map((category) => category._id);
}

/**
 * Builds a MongoDB filter for free-text product search.
 * Multiple whitespace-separated terms are combined with AND — each term must
 * match at least one of: product name, manufacturer, description (en/de),
 * or category name/code.
 *
 * @param {string} query
 * @param {import('mongoose').Model} Category
 * @returns {Promise<object>}
 */
async function buildProductSearchFilter(query, Category) {
  const trimmed = query.trim();

  if (!trimmed) {
    return { _id: { $in: [] } };
  }

  const terms = trimmed.split(/\s+/).filter(Boolean).slice(0, 8);

  const termFilters = await Promise.all(
    terms.map(async (term) => {
      const regex = new RegExp(escapeRegex(term), 'i');
      const categoryIds = await findMatchingCategoryIds(regex, Category);

      return { $or: buildTermOrConditions(regex, categoryIds) };
    }),
  );

  if (termFilters.length === 1) {
    return termFilters[0];
  }

  return { $and: termFilters };
}

module.exports = {
  escapeRegex,
  buildProductSearchFilter,
};
