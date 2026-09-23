#!/usr/bin/env node
/**
 * Download or convert a source image into category large/small WebP derivatives
 * and patch dev-tools/data/categories.json.
 *
 * Usage:
 *   node dev-tools/process-category-image.js <category-code> [options]
 *
 * Options:
 *   --source <path>     Local image file (default: first image in staging folder)
 *   --url <https://…>   Download source from URL
 *   --alt-en <text>     English alt text for both sizes
 *   --alt-de <text>     German alt text for both sizes
 *   --dry-run           Preview without writing
 *
 * Staging (optional): dev-tools/image-staging/categories/<code>/*
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const sharp = require('sharp');
const categoryCopy = require('./data/category-copy');

const repoRoot = path.join(__dirname, '..');
const categoriesPath = path.join(__dirname, 'data/categories.json');
const stagingRoot = path.join(__dirname, 'image-staging/categories');
const outputRoot = path.join(repoRoot, 'public/img/categories');

const SIZES = {
  large: { width: 1920, height: 1080 },
  small: { width: 800, height: 600 },
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const code = args.find((arg) => !arg.startsWith('--'));
  if (!code) {
    console.error('Usage: node dev-tools/process-category-image.js <category-code> [--source path | --url https://…]');
    process.exit(1);
  }

  const getFlagValue = (flag) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    code,
    source: getFlagValue('--source'),
    url: getFlagValue('--url'),
    altEn: getFlagValue('--alt-en'),
    altDe: getFlagValue('--alt-de'),
    dryRun: args.includes('--dry-run'),
  };
};

const downloadFile = (url, destPath) =>
  new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const requestOptions = {
      headers: {
        'User-Agent': 'CampfireStoreCategoryImageBot/1.0',
        Accept: 'image/*,*/*',
      },
    };
    client
      .get(url, requestOptions, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed (${response.statusCode}): ${url}`));
          return;
        }
        const file = fs.createWriteStream(destPath);
        response.pipe(file);
        file.on('finish', () => file.close(() => resolve(destPath)));
        file.on('error', reject);
      })
      .on('error', reject);
  });

const findStagingSource = (code) => {
  const dir = path.join(stagingRoot, code);
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort();
  return files.length ? path.join(dir, files[0]) : null;
};

const resolveSourcePath = async ({ code, source, url }) => {
  if (source) {
    if (!fs.existsSync(source)) {
      throw new Error(`Source file not found: ${source}`);
    }
    return source;
  }

  if (url) {
    const tempDir = path.join(stagingRoot, code);
    fs.mkdirSync(tempDir, { recursive: true });
    const tempPath = path.join(tempDir, `download-${Date.now()}.jpg`);
    await downloadFile(url, tempPath);
    return tempPath;
  }

  const staged = findStagingSource(code);
  if (!staged) {
    throw new Error(
      `No source image. Pass --source, --url, or drop a file in ${path.join('dev-tools/image-staging/categories', code)}/`,
    );
  }
  return staged;
};

const writeVariant = async (inputPath, code, variant, dryRun) => {
  const { width, height } = SIZES[variant];
  const filename = `${code}.webp`;
  const outputDir = path.join(outputRoot, variant);
  const outputPath = path.join(outputDir, filename);
  const publicUrl = `/img/categories/${variant}/${filename}`;

  if (dryRun) {
    console.log(`  [dry-run] ${variant}: ${width}×${height} → ${outputPath}`);
    return { url: publicUrl, mimeType: 'image/webp' };
  }

  fs.mkdirSync(outputDir, { recursive: true });
  await sharp(inputPath)
    .rotate()
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .webp({ quality: 85 })
    .toFile(outputPath);

  console.log(`  ${variant}: ${publicUrl}`);
  return { url: publicUrl, mimeType: 'image/webp' };
};

const patchCategoriesJson = (code, imagePatch, dryRun) => {
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  const index = categories.findIndex((category) => category.code === code);
  if (index < 0) {
    throw new Error(`Category not found in categories.json: ${code}`);
  }

  categories[index].image = imagePatch;

  if (!dryRun) {
    fs.writeFileSync(categoriesPath, `${JSON.stringify(categories, null, 2)}\n`);
  }

  console.log(`Updated image for ${code} in categories.json`);
};

const main = async () => {
  const options = parseArgs();
  const sourcePath = await resolveSourcePath(options);

  console.log(`Processing ${options.code} from ${sourcePath}`);

  const altTextI18n = {};
  const copyAlt = categoryCopy[options.code]?.imageAltI18n;
  if (options.altEn || copyAlt?.en) altTextI18n.en = options.altEn ?? copyAlt.en;
  if (options.altDe || copyAlt?.de) altTextI18n.de = options.altDe ?? copyAlt.de;

  const withAlt = (sizeEntry) => (Object.keys(altTextI18n).length ? { ...sizeEntry, altTextI18n } : sizeEntry);

  const large = withAlt(await writeVariant(sourcePath, options.code, 'large', options.dryRun));
  const small = withAlt(await writeVariant(sourcePath, options.code, 'small', options.dryRun));

  patchCategoriesJson(options.code, { large, small }, options.dryRun);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
