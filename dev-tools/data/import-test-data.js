const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<USERNAME>',
  process.env.DATABASE_USERNAME,
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'),
);
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    console.log('Creating categories...');
    await Category.create(categories);
    console.log('Creating products...');
    await Product.create(products);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    console.log('Deleteing products...');
    await Product.deleteMany();
    console.log('Deleteing categories...');
    await Category.deleteMany();
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
