const fs = require('fs');
const path = require('path');
const Title = require('../../models/titleModel');
const User = require('../../models/userModel');
const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const Badge = require('../../models/badgeModel');
const Cart = require('../../models/cartModel');
const GenericOrderEntry = require('../../models/genericOrderEntryModel');
const Order = require('../../models/orderModel');
const Wishlist = require('../../models/wishlistModel');
const WishlistEntry = require('../../models/wishlistEntryModel');
const Currency = require('../../models/currencyModel');
const Language = require('../../models/languageModel');
const { allowedCurrencies, allowedLanguages } = require('../../utils/config');

const dataDir = __dirname;
const productsDir = path.join(dataDir, 'products');

const readJson = (filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));

const readProductFiles = () => {
  const files = fs
    .readdirSync(productsDir)
    .filter((name) => name.endsWith('.json'))
    .sort();

  return files.map((filename) => ({
    filename,
    products: readJson(path.join('products', filename)),
  }));
};

const seedData = {
  titles: readJson('titles.json'),
  users: readJson('users.json'),
  categories: readJson('categories.json'),
  badges: readJson('badges.json'),
  productFiles: readProductFiles(),
  carts: readJson('carts.json'),
  cartEntries: readJson('cartEntries.json'),
  wishlists: readJson('wishlists.json'),
  wishlistEntries: readJson('wishlistEntries.json'),
  orders: readJson('orders.json'),
  orderEntries: readJson('orderEntries.json'),
  currencies: readJson('currencies.json').filter((currency) =>
    allowedCurrencies.includes(currency.code),
  ),
  languages: readJson('languages.json').filter((language) =>
    allowedLanguages.includes(language.code),
  ),
};

const performImport = async () => {
  console.log('Creating currencies...');
  await Currency.create(seedData.currencies);

  console.log('Creating languages...');
  await Language.create(seedData.languages);

  console.log('Creating titles...');
  await Title.create(seedData.titles);

  console.log('Creating users...');
  await User.create(seedData.users, { validateBeforeSave: false });

  console.log('Creating categories...');
  await Category.create(seedData.categories);

  console.log('Creating badges...');
  await Badge.create(seedData.badges);

  console.log('Creating products...');
  let productCount = 0;
  for (const { filename, products } of seedData.productFiles) {
    if (!products.length) {
      console.log(`  Skipping empty ${filename}`);
      continue;
    }
    await Product.create(products);
    productCount += products.length;
    console.log(`  ${filename}: ${products.length}`);
  }
  console.log(`  Total products: ${productCount}`);

  console.log('Creating carts...');
  await Cart.create(seedData.carts);

  console.log('Creating cart entries...');
  await GenericOrderEntry.create(seedData.cartEntries);

  console.log('Creating wishlists...');
  await Wishlist.create(seedData.wishlists);

  console.log('Creating wishlist entries...');
  await WishlistEntry.create(seedData.wishlistEntries);

  console.log('Creating orders...');
  await Order.create(seedData.orders);

  console.log('Creating order entries...');
  await GenericOrderEntry.create(seedData.orderEntries);

  console.log('Data successfully loaded!');
};

const performDelete = async () => {
  console.log('Deleteing wishlist entries...');
  await WishlistEntry.deleteMany();
  console.log('Deleteing wishlists...');
  await Wishlist.deleteMany();
  console.log('Deleteing cart and order entries...');
  await GenericOrderEntry.deleteMany();
  console.log('Deleteing orders...');
  await Order.deleteMany();
  console.log('Deleteing carts...');
  await Cart.deleteMany();
  console.log('Deleteing products...');
  await Product.deleteMany();
  console.log('Deleteing badges...');
  await Badge.deleteMany();
  console.log('Deleteing categories...');
  await Category.deleteMany();
  console.log('Deleteing users...');
  await User.deleteMany();
  console.log('Deleteing titles...');
  await Title.deleteMany();
  console.log('Deleteing currencies...');
  await Currency.deleteMany();
  console.log('Deleteing languages...');
  await Language.deleteMany();
  console.log('Data successfully deleted!');
};

const recreateTestData = async () => {
  await performDelete();
  await performImport();
};

module.exports = {
  performImport,
  performDelete,
  recreateTestData,
};
