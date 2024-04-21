const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'),
);
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
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
const importData = async () => {
  try {
    console.log('Creating users...');
    await User.create(users);
    console.log('Creating categories...');
    await Category.create(categories);
    console.log('Creating products...');
    await Product.create(products);
    console.log('Creating carts...');
    await Cart.create(carts);
    console.log('Creating cart entries...');
    await GenericOrderEntry.create(cartEntries);
    console.log('Creating orders...');
    await Order.create(orders);
    console.log('Creating order entries...');
    await GenericOrderEntry.create(orderEntries);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
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
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
