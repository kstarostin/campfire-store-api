exports.allowedCurrencies = ['USD', 'EUR'];
exports.defaultCurrency = 'USD';

exports.allowedLanguages = ['en', 'de'];
exports.defaultLanguage = 'en';

exports.allowedOrderStatuses = ['open', 'progress', 'delivered'];
exports.defaultOrderStatus = 'open';

exports.allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

exports.allowedUserRoles = ['user', 'admin'];
exports.defaultUserRole = 'user';

/**
 * The map of image sizes. The key is an image size type, the value is an actual size in pixels of one side (assuming that the image is square).
 */
const createImageDimensionsMap = () => {
  const dimensionsMap = new Map();

  dimensionsMap.set('thumbnail', '200');
  dimensionsMap.set('small', '500');
  dimensionsMap.set('medium', '1000');
  dimensionsMap.set('large', '2000');
  dimensionsMap.set('original', 'original');

  return dimensionsMap;
};
exports.imageDimensionsMap = createImageDimensionsMap();
