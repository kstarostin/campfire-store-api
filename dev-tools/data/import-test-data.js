const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Title = require('../../models/titleModel');
const User = require('../../models/userModel');
const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const Cart = require('../../models/cartModel');
const GenericOrderEntry = require('../../models/genericOrderEntryModel');
const Order = require('../../models/orderModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<USERNAME>',
  process.env.DATABASE_USERNAME,
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILES
const titles = JSON.parse(fs.readFileSync(`${__dirname}/titles.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'),
);
const backpacks = JSON.parse(
  fs.readFileSync(`${__dirname}/products/backpacks.json`, 'utf-8'),
);
const hikingPants = JSON.parse(
  fs.readFileSync(`${__dirname}/products/hiking-pants.json`, 'utf-8'),
);
const mountainBikes = JSON.parse(
  fs.readFileSync(`${__dirname}/products/mountain-bikes.json`, 'utf-8'),
);
const ski = JSON.parse(
  fs.readFileSync(`${__dirname}/products/ski.json`, 'utf-8'),
);
const tents = JSON.parse(
  fs.readFileSync(`${__dirname}/products/tents.json`, 'utf-8'),
);
const touringKayaks = JSON.parse(
  fs.readFileSync(`${__dirname}/products/touring-kayaks.json`, 'utf-8'),
);
const carts = JSON.parse(fs.readFileSync(`${__dirname}/carts.json`, 'utf-8'));
const cartEntries = JSON.parse(
  fs.readFileSync(`${__dirname}/cartEntries.json`, 'utf-8'),
);
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'));
const orderEntries = JSON.parse(
  fs.readFileSync(`${__dirname}/orderEntries.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const performImport = async () => {
  console.log('Creating titles...');
  await Title.create(titles);

  console.log('Creating users...');
  await User.create(users, { validateBeforeSave: false });

  console.log('Creating categories...');
  await Category.create(categories);

  console.log('Creating products...');
  await Product.create(backpacks);
  await Product.create(hikingPants);
  await Product.create(mountainBikes);
  await Product.create(ski);
  await Product.create(tents);
  await Product.create(touringKayaks);

  console.log('Creating carts...');
  await Cart.create(carts);

  console.log('Creating cart entries...');
  await GenericOrderEntry.create(cartEntries);

  console.log('Creating orders...');
  await Order.create(orders);

  console.log('Creating order entries...');
  await GenericOrderEntry.create(orderEntries);

  console.log('Data successfully loaded!');
};

const importData = async () => {
  try {
    await performImport();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
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
  console.log('Data successfully deleted!');
};

const deleteData = async () => {
  try {
    await performDelete();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// RECREATE ALL DATA IN DB
const recreateData = async () => {
  try {
    await performDelete();
    await performImport();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import' || process.argv[2] === '--i') {
  importData();
} else if (process.argv[2] === '--delete' || process.argv[2] === '--d') {
  deleteData();
} else if (process.argv[2] === '--recreate' || process.argv[2] === '--r') {
  recreateData();
}
