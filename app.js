const express = require('express');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const productRouter = require('./routers/productRouter');

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// ROUTES
app.use('/api/v1/products', productRouter);

// ERROR HANDLERS
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
