const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const DocumentSanitizer = require('../utils/documentSanitizer');
const { normalizeProductBadges } = require('../utils/productBadgeUtils');
const { buildProductSearchFilter } = require('../utils/searchQueryUtils');
const AppError = require('../utils/appError');
const { aggregateFilters } = require('./productController');

const MAX_QUERY_LENGTH = 128;

const emptySearchResponse = (limit = 25, page = 1) => ({
  status: 'success',
  resultsFound: 0,
  resultsPerPage: limit,
  resultsTotal: 0,
  currentPage: page,
  pages: 1,
  query: '',
  data: {
    filters: [],
    documents: [],
  },
});

/**
 * Free-text product search across name, description, manufacturer, and category.
 * Response shape matches GET /products list responses for UI reuse.
 */
exports.searchProducts = catchAsync(async (req, res, next) => {
  const rawQuery = typeof req.query.q === 'string' ? req.query.q : '';
  const query = rawQuery.trim();
  const page = req.query.page * 1 || 1;
  const defaultLimit = 25;
  const maxLimit = 50;
  let limit = req.query.limit * 1 || defaultLimit;
  if (limit > maxLimit) {
    limit = maxLimit;
  }

  if (!query) {
    return res.status(200).json(emptySearchResponse(limit, page));
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return next(
      new AppError(
        `Search query must be ${MAX_QUERY_LENGTH} characters or fewer.`,
        400,
      ),
    );
  }

  const searchFilter = await buildProductSearchFilter(query, Category);

  const features = new APIFeatures(
    Product.find(searchFilter).select('-descriptionI18n'),
    req.query,
  )
    .paginate({ defaultLimit: 25, maxLimit: 50 })
    .sort()
    .limitFields()
    .filter(searchFilter);

  const totalCount = await Product.countDocuments(features.resultFilter);
  const documents = (await features.dbQuery).map((document) =>
    normalizeProductBadges(
      new DocumentSanitizer(req.language, req.currency, 8).sanitize(document),
    ),
  );

  const numberOfPages =
    totalCount > 0 ? Math.ceil(totalCount / features.limit) : 1;

  res.status(200).json({
    status: 'success',
    resultsFound: documents.length,
    resultsPerPage: features.limit,
    resultsTotal: totalCount,
    currentPage: features.page,
    pages: numberOfPages,
    query,
    data: {
      filters: await aggregateFilters(req, features.resultFilter),
      documents,
    },
  });
});
