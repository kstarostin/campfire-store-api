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
const swaggerJSDoc = require('swagger-jsdoc');

const packageJson = require('./package.json');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const productRouter = require('./routers/productRouter');

const app = express();

// GLOBAL MIDDLEWARES

// Activate CORS
app.use(cors());
// Activate CORS pre-flight requests
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

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
const basePath = '/api/v1';
// Swagger documentation
const jsDocOptions = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'Campfire Store API',
      description: `${packageJson.description}`,
      version: `${packageJson.version}`,
    },
    basePath,
  },
  apis: ['./routers/*.js'],
};
const swaggerSpec = swaggerJSDoc(jsDocOptions);
app.use(`${basePath}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// App routes
app.use(`${basePath}/products`, productRouter);

// ERROR HANDLERS
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling
app.use(errorHandler);

module.exports = app;
