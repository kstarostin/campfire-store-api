const catchAsync = require('../utils/catchAsync');
const { allowedCurrencies } = require('../utils/config');

exports.getAllCurrencies = catchAsync(async (req, res, next) => {
  const currencies = allowedCurrencies.map((currency) => ({ code: currency }));
  res.status(200).json({
    status: 'success',
    data: {
      documents: currencies,
    },
  });
});
