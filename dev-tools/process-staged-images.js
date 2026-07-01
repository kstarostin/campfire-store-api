#!/usr/bin/env node
/**
 * Convert images from dev-tools/image-staging/{productId}/ into product image
 * derivatives under public/img/products/ and optionally patch product JSON.
 *
 * Usage:
 *   node dev-tools/process-staged-images.js <productId> [options]
 *
 * Options:
 *   --fit cover|contain     Resize fit (default: cover — center crop to square)
 *   --bg <hex|auto>         Pad/flatten color (default: auto — white for transparent
 *                           PNGs; edge sample for opaque images with --fit contain)
 *   --product-file <path>   Patch images[] on matching product in JSON file
 *   --alt <text>            Alt text for all sizes (default: derived from product name)
 *   --dry-run               Print actions without writing files
 *
 * Staging folder may contain 1–5 source files (jpg, jpeg, png, webp). Files are
 * processed in alphabetical order as gallery indices 1..n.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { imageDimensionsMap } = require('../utils/config');

const repoRoot = path.join(__dirname, '..');
const stagingRoot = path.join(__dirname, 'image-staging');
const publicRoot = path.join(repoRoot, 'public');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const DEFAULT_BG = '#ffffff';
const PATCH_MAX = 16;
const BG_CHANNEL_TOLERANCE = 20;

const sizeOrder = ['thumbnail', 'small', 'medium', 'large', 'original'];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const productId = args.find((arg) => !arg.startsWith('--'));
  if (!productId) {
    console.error('Usage: node dev-tools/process-staged-images.js <productId> [options]');
    process.exit(1);
  }

  const getFlagValue = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    productId,
    fit: getFlagValue('--fit') ?? 'cover',
    bg: getFlagValue('--bg'),
    productFile: getFlagValue('--product-file'),
    altText: getFlagValue('--alt'),
    dryRun: args.includes('--dry-run'),
  };
};

const parseHexColor = (value) => {
  const match = /^#?([0-9a-f]{6})$/i.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid hex color "${value}". Use format #rrggbb.`);
  }

  const hex = match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`;

const averageRgb = (samples) => {
  const total = samples.reduce(
    (acc, sample) => ({
      r: acc.r + sample.r,
      g: acc.g + sample.g,
      b: acc.b + sample.b,
    }),
    { r: 0, g: 0, b: 0 },
  );

  return {
    r: total.r / samples.length,
    g: total.g / samples.length,
    b: total.b / samples.length,
  };
};

const colorDistance = (a, b) =>
  Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));

const samplePatchAverage = async (inputPath, left, top, patchSize) => {
  const { data, info } = await sharp(inputPath)
    .extract({ left, top, width: patchSize, height: patchSize })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = data.length / channels;

  for (let i = 0; i < data.length; i += channels) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return { r: r / pixels, g: g / pixels, b: b / pixels };
};

const detectBackgroundColor = async (inputPath) => {
  const { width, height } = await sharp(inputPath).metadata();
  const patch = Math.max(
    4,
    Math.min(PATCH_MAX, Math.floor(width * 0.04), Math.floor(height * 0.04)),
  );

  const regions = [
    { left: 0, top: 0 },
    { left: width - patch, top: 0 },
    { left: 0, top: height - patch },
    { left: width - patch, top: height - patch },
    { left: Math.floor((width - patch) / 2), top: 0 },
    { left: Math.floor((width - patch) / 2), top: height - patch },
    { left: 0, top: Math.floor((height - patch) / 2) },
    { left: width - patch, top: Math.floor((height - patch) / 2) },
  ];

  const samples = await Promise.all(
    regions.map((region) =>
      samplePatchAverage(inputPath, region.left, region.top, patch),
    ),
  );

  const average = averageRgb(samples);
  const consistent = samples.every(
    (sample) => colorDistance(sample, average) <= BG_CHANNEL_TOLERANCE,
  );

  if (!consistent) {
    const cornerAverage = averageRgb(samples.slice(0, 4));
    console.warn(
      `  Edge colors vary; using corner average ${rgbToHex(cornerAverage)}`,
    );
    return cornerAverage;
  }

  return average;
};

const resolveBackground = async ({ inputPath, fit, bgOption }) => {
  if (bgOption && bgOption !== 'auto') {
    return parseHexColor(bgOption);
  }

  const { hasAlpha } = await sharp(inputPath).metadata();
  if (hasAlpha) {
    return parseHexColor(DEFAULT_BG);
  }

  if (fit === 'cover') {
    return parseHexColor(DEFAULT_BG);
  }

  return detectBackgroundColor(inputPath);
};

const listStagingImages = (productId) => {
  const dir = path.join(stagingRoot, productId);
  if (!fs.existsSync(dir)) {
    throw new Error(`Staging folder not found: ${dir}`);
  }

  return fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => path.join(dir, name));
};

const buildImagePath = (sizeName, imageName, format) => {
  const dimensionToken = imageDimensionsMap.get(sizeName);
  return `/img/products/${sizeName}/${imageName}_${dimensionToken}.${format}`;
};

const writeDerivative = async ({
  inputPath,
  outputPath,
  sizeName,
  format,
  fit,
  background,
  dryRun,
}) => {
  const absOutput = path.join(publicRoot, outputPath);
  if (dryRun) {
    console.log(`  would write ${outputPath}`);
    return;
  }

  fs.mkdirSync(path.dirname(absOutput), { recursive: true });

  const bgHex = rgbToHex(background);
  let pipeline = sharp(inputPath).flatten({ background: bgHex });

  if (sizeName !== 'original') {
    const side = Number(imageDimensionsMap.get(sizeName));
    pipeline = pipeline.resize(side, side, {
      fit,
      position: 'centre',
      background,
    });
  }

  if (format === 'jpeg') {
    const quality =
      sizeName === 'thumbnail' || sizeName === 'small' ? 90 : 75;
    pipeline = pipeline.jpeg({ mozjpeg: true, quality });
  } else {
    pipeline = pipeline.webp({ quality: 75, effort: 6 });
  }

  await pipeline.toFile(absOutput);
};

const buildImageContainer = async ({
  productId,
  index,
  inputPath,
  altText,
  fit,
  bgOption,
  dryRun,
}) => {
  const background = await resolveBackground({ inputPath, fit, bgOption });
  const bgHex = rgbToHex(background);
  const { hasAlpha } = await sharp(inputPath).metadata();

  if (hasAlpha) {
    console.log(`  transparent PNG — flatten/pad with ${bgHex}`);
  } else if (fit === 'contain') {
    console.log(`  pad background: ${bgHex}`);
  }

  const imageName = `product-${productId}-${Date.now()}-${index}`;
  const container = {};

  for (const sizeName of sizeOrder) {
    const isWebp = sizeName === 'large' || sizeName === 'original';
    const format = isWebp ? 'webp' : 'jpeg';
    const url = buildImagePath(sizeName, imageName, format);
    const mimeType = isWebp ? 'image/webp' : 'image/jpeg';

    await writeDerivative({
      inputPath,
      outputPath: url,
      sizeName,
      format,
      fit,
      background,
      dryRun,
    });

    container[sizeName] = { url, altText, mimeType };
  }

  return container;
};

const patchProductFile = ({ productFile, productId, images, dryRun }) => {
  const absPath = path.isAbsolute(productFile)
    ? productFile
    : path.join(repoRoot, productFile);

  const products = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
  const index = products.findIndex((product) => product._id === productId);

  if (index < 0) {
    throw new Error(`Product ${productId} not found in ${productFile}`);
  }

  products[index].images = images;

  if (dryRun) {
    console.log(`Would update images[] for ${productId} in ${productFile}`);
    return;
  }

  fs.writeFileSync(absPath, `${JSON.stringify(products, null, 2)}\n`);
  console.log(`Updated images[] for ${productId} in ${productFile}`);
};

const resolveAltText = ({ productFile, productId, altText }) => {
  if (altText) return altText;

  if (productFile) {
    const absPath = path.isAbsolute(productFile)
      ? productFile
      : path.join(repoRoot, productFile);
    const products = JSON.parse(fs.readFileSync(absPath, 'utf-8'));
    const product = products.find((entry) => entry._id === productId);
    if (product?.name) {
      return `${product.name} photo`;
    }
  }

  return `Product ${productId} photo`;
};

const main = async () => {
  const options = parseArgs();
  const { productId, fit, bg, productFile, dryRun } = options;

  if (!['cover', 'contain'].includes(fit)) {
    throw new Error(`Unsupported fit "${fit}". Use cover or contain.`);
  }

  const sources = listStagingImages(productId);
  if (!sources.length) {
    throw new Error(`No image files found in ${path.join(stagingRoot, productId)}`);
  }

  const altText = resolveAltText(options);
  const images = [];

  console.log(
    `${dryRun ? '[dry-run] ' : ''}Processing ${sources.length} image(s) for ${productId} (fit: ${fit})`,
  );

  for (let i = 0; i < sources.length; i += 1) {
    const inputPath = sources[i];
    console.log(`  ${path.basename(inputPath)}`);
    const container = await buildImageContainer({
      productId,
      index: i + 1,
      inputPath,
      altText,
      fit,
      bgOption: bg,
      dryRun,
    });
    images.push(container);
  }

  const output = JSON.stringify(images, null, 2);
  console.log('\nimages[] JSON:\n');
  console.log(output);

  if (productFile) {
    patchProductFile({ productFile, productId, images, dryRun });
  }

  if (!dryRun) {
    const stagingDir = path.join(stagingRoot, productId);
    fs.rmSync(stagingDir, { recursive: true, force: true });
    console.log(`\nRemoved staging folder: ${stagingDir}`);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
