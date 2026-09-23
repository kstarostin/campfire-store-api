const path = require('path');
const express = require('express');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');

const AppError = require('./utils/appError');
const mongoSanitize = require('./utils/mongoSanitize');
const sessionHandler = require('./controllers/sessionController');
const errorHandler = require('./controllers/errorController');

// Routers
const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const currRouter = require('./routers/currRouter');
const langRouter = require('./routers/langRouter');
const productRouter = require('./routers/productRouter');
const searchRouter = require('./routers/searchRouter');
const titleRouter = require('./routers/titleRouter');
const badgeRouter = require('./routers/badgeRouter');
const userRouter = require('./routers/userRouter');
// const cartRouter = require('./routers/cartRouter');
const swaggerRedirectRouter = require('./routers/swaggerRedirectRouter');

const swaggerConfig = require('./swagger/swaggerConfig');

const app = express();

// Express 5 defaults the query parser to 'simple', which parses ?a[b]=1 as the
// flat key "a[b]" instead of a nested object. Keep the Express 4 'extended'
// behaviour so query handling is unchanged by the upgrade.
app.set('query parser', 'extended');

// GLOBAL MIDDLEWARES

// Activate CORS
app.use(cors());
// Activate CORS pre-flight requests
app.options('/*splat', cors());

// Serving static files
app.use(express.static(path.join(__dirname, '/public')));

// Set security HTTP headers
app.use(helmet());

// Limit requests from the same IP
const allowList = process.env.RATE_LIMIT_ALLOW_LIST
  ? process.env.RATE_LIMIT_ALLOW_LIST.split(',')
  : [];
const periodMinutes = 60;
const limiter = rateLimit({
  limit: 100,
  windowMs: periodMinutes * 60 * 1000,
  message: `Too many requests from this IP. Please try again in ${periodMinutes} minutes.`,
  skip: (req, res) => allowList.includes(req.ip),
});
app.use('/api', limiter);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Sanitize data against NoSQL query injection.
// ORDER MATTERS: this must run before xss(), which redefines req.query via
// Object.defineProperty({ writable: false }). Any sanitizer running afterwards
// that assigns to req.query throws "Cannot assign to read only property 'query'".
app.use(mongoSanitize());
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Handles request language and currency parameters in the session
app.use(sessionHandler.handleLanguage, sessionHandler.handleCurrency);

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

// App routes
app.use(`${apiPath}/categories`, categoryRouter);
app.use(`${apiPath}/currencies`, currRouter);
app.use(`${apiPath}/languages`, langRouter);
app.use(`${apiPath}/products`, productRouter);
app.use(`${apiPath}/search`, searchRouter);
app.use(`${apiPath}/titles`, titleRouter);
app.use(`${apiPath}/badges`, badgeRouter);
app.use(`${apiPath}/users`, authRouter);
app.use(`${apiPath}/users`, userRouter);
// app.use(`${apiPath}/users`, cartRouter);

// ERROR HANDLERS
app.all('/*splat', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling
app.use(errorHandler);

module.exports = app;
