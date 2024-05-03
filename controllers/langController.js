const catchAsync = require('../utils/catchAsync');
const { allowedLanguages } = require('../utils/config');

exports.getAllLanguages = catchAsync(async (req, res, next) => {
  const languages = allowedLanguages.map((lang) => ({ code: lang }));
  res.status(200).json({
    status: 'success',
    data: {
      documents: languages,
    },
  });
});
