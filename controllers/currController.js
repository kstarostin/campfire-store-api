const Currency = require('../models/currencyModel');
const catchAsync = require('../utils/catchAsync');
const DocumentSanitizer = require('../utils/documentSanitizer');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCurrencies = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Currency.find(), req.query)
    .sort()
    .limitFields();
  const documents = (await features.dbQuery).map((document) =>
    new DocumentSanitizer(req.language, req.currency, 2).sanitize(document),
  );
  res.status(200).json({
    status: 'success',
    data: {
      documents,
    },
  });
});
