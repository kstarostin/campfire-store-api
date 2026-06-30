const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { recreateTestData } = require('../dev-tools/data/db-seed');

dotenv.config({ path: './config.env' });

const getDbUri = () =>
  process.env.DATABASE.replace('<USERNAME>', process.env.DATABASE_USERNAME).replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
  );

beforeAll(async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in config.env before running tests.');
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(getDbUri(), {
      serverSelectionTimeoutMS: 15000,
    });
  }

  await recreateTestData();
});

afterAll(async () => {
  await recreateTestData();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});
