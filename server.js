const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<USERNAME>',
  process.env.DATABASE_USERNAME,
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception! Shutting down gracefully...');
  console.error(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection! Shutting down gracefully...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Signal from Heroku to shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received! Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
