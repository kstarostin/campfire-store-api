const fs = require('fs');
const path = require('path');
const Title = require('../../models/titleModel');
const User = require('../../models/userModel');
const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const Cart = require('../../models/cartModel');
const GenericOrderEntry = require('../../models/genericOrderEntryModel');
const Order = require('../../models/orderModel');
const Currency = require('../../models/currencyModel');
const Language = require('../../models/languageModel');
const { allowedCurrencies, allowedLanguages } = require('../../utils/config');

const dataDir = __dirname;

const readJson = (filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, filename), 'utf-8'));

const seedData = {
  titles: readJson('titles.json'),
  users: readJson('users.json'),
  categories: readJson('categories.json'),
  backpacks: readJson('products/backpacks.json'),
  gravelBikes: readJson('products/gravel-bikes.json'),
  hikingPants: readJson('products/hiking-pants.json'),
  mountainBikes: readJson('products/mountain-bikes.json'),
  roadBikes: readJson('products/road-bikes.json'),
  ski: readJson('products/ski.json'),
  tents: readJson('products/tents.json'),
  touringKayaks: readJson('products/touring-kayaks.json'),
  carts: readJson('carts.json'),
  cartEntries: readJson('cartEntries.json'),
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

  console.log('Creating products...');
  await Product.create(seedData.backpacks);
  await Product.create(seedData.gravelBikes);
  await Product.create(seedData.hikingPants);
  await Product.create(seedData.mountainBikes);
  await Product.create(seedData.roadBikes);
  await Product.create(seedData.ski);
  await Product.create(seedData.tents);
  await Product.create(seedData.touringKayaks);

  console.log('Creating carts...');
  await Cart.create(seedData.carts);

  console.log('Creating cart entries...');
  await GenericOrderEntry.create(seedData.cartEntries);

  console.log('Creating orders...');
  await Order.create(seedData.orders);

  console.log('Creating order entries...');
  await GenericOrderEntry.create(seedData.orderEntries);

  console.log('Data successfully loaded!');
};

const performDelete = async () => {
  console.log('Deleteing cart and order entries...');
  await GenericOrderEntry.deleteMany();
  console.log('Deleteing orders...');
  await Order.deleteMany();
  console.log('Deleteing carts...');
  await Cart.deleteMany();
  console.log('Deleteing products...');
  await Product.deleteMany();
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
