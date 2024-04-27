const sharp = require('sharp');
const ImagePathBuilder = require('./imagePathBuilder');
const { imageDimensionsMap } = require('./config');
const AppError = require('./appError');

exports.createImageFile = async (options) => {
  // Build path for an image
  const imagePath = new ImagePathBuilder()
    .for(options.resource)
    .size(options.sizeName)
    .name(options.name)
    .format(options.format)
    .build();

  // Configure output
  let sharpBuilder = sharp(options.file.buffer)
    .flatten({ background: '#ffffff' })
    .toFormat(options.format);

  if (options.sizeName !== 'original') {
    // Get image side size by its name
    const size = +imageDimensionsMap.get(options.sizeName);
    sharpBuilder = sharpBuilder.resize(size, size);
  }

  if (options.format === 'jpeg') {
    const quality =
      options.sizeName === 'thumbnail' || options.sizeName === 'small'
        ? 90
        : 75;
    sharpBuilder = sharpBuilder.jpeg({ mozjpeg: true, quality });
  } else if (options.format === 'webp') {
    sharpBuilder = sharpBuilder.webp({ mozjpeg: true, quality: 75, effort: 6 });
  } else {
    return new AppError('Unsupported image file format.', 400);
  }

  // Create the file
  await sharpBuilder.toFile(`public/${imagePath}`);
  return imagePath;
};
