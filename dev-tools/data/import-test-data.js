const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { performImport, performDelete, recreateTestData } = require('./db-seed');

const getDbUri = () =>
  process.env.DATABASE.replace(
    '<USERNAME>',
    process.env.DATABASE_USERNAME,
  ).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const runCli = async () => {
  dotenv.config({ path: './config.env' });

  await mongoose.connect(getDbUri());
  console.log('DB connection successful!');

  try {
    const command = process.argv[2];

    if (command === '--import' || command === '--i') {
      await performImport();
    } else if (command === '--delete' || command === '--d') {
      await performDelete();
    } else if (command === '--recreate' || command === '--r') {
      await recreateTestData();
    } else {
      console.log(
        'Usage: node import-test-data.js [--import|--delete|--recreate]',
      );
      process.exitCode = 1;
      return;
    }
  } catch (err) {
    console.log(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  runCli();
}
