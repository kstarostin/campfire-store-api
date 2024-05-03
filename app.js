const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');

const AppError = require('./utils/appError');
const sessionHandler = require('./controllers/sessionController');
const errorHandler = require('./controllers/errorController');

// Routers
const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const currRouter = require('./routers/currRouter');
const langRouter = require('./routers/langRouter');
const productRouter = require('./routers/productRouter');
const titleRouter = require('./routers/titleRouter');
const userRouter = require('./routers/userRouter');
// const cartRouter = require('./routers/cartRouter');
const swaggerRedirectRouter = require('./routers/swaggerRedirectRouter');

const swaggerConfig = require('./swagger/swaggerConfig');

const app = express();

// GLOBAL MIDDLEWARES

// Activate CORS
app.use(cors());
// Activate CORS pre-flight requests
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// Set security HTTP headers
app.use(helmet());

// Limit requests from the same IP
if (process.env.NODE_ENV !== 'development') {
  const periodMinutes = 60;
  const limiter = rateLimit({
    max: 100,
    windowMs: periodMinutes * 60 * 1000,
    message: `Too many requests from this IP. Please try again in ${periodMinutes} minutes.`,
  });
  app.use('/api', limiter);
}

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// ROUTES
const basePath = '/';
const apiPath = `${basePath}api/v1`;

// Swagger routes
app.use(
  `${apiPath}/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig.document, swaggerConfig.options),
);
app.use(basePath, swaggerRedirectRouter);

// Handles request language and currency parameters in the session
app.use(sessionHandler.handleLanguage, sessionHandler.handleCurrency);

// App routes
app.use(`${apiPath}/categories`, categoryRouter);
app.use(`${apiPath}/currencies`, currRouter);
app.use(`${apiPath}/languages`, langRouter);
app.use(`${apiPath}/products`, productRouter);
app.use(`${apiPath}/titles`, titleRouter);
app.use(`${apiPath}/users`, authRouter);
app.use(`${apiPath}/users`, userRouter);
// app.use(`${apiPath}/users`, cartRouter);

// ERROR HANDLERS
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling
app.use(errorHandler);

module.exports = app;
