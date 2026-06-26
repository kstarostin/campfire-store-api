const swaggerJSDoc = require('swagger-jsdoc');
const mongooseToSwagger = require('mongoose-to-swagger');

const packageJson = require('../package.json');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const GenericOrderEntry = require('../models/genericOrderEntryModel');
const Title = require('../models/titleModel');
const Badge = require('../models/badgeModel');

const basePath = '/';
const apiPath = `${basePath}api/v1`;

const storefrontUrl =
  process.env.STOREFRONT_URL || 'https://campfire-store.netlify.app';
const githubUrl =
  process.env.GITHUB || 'https://github.com/kstarostin/campfire-store-api';

const omitFields = ['_id', 'createdAt', 'updatedAt'];

// Swagger document
const document = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campfire Store API',
      description: [
        'REST API for <strong>Campfire Store</strong>, a demo outdoor gear shop — kayaks, bikes, camping, clothing, footwear, and more.',
        'Use it to list products and categories, manage carts and orders, and authenticate customers with JWT.',
        `<br><br><strong>Storefront:</strong> <a href="${storefrontUrl}" target="_blank" rel="noopener noreferrer">${storefrontUrl}</a>`,
        '<br><br>Protected routes require a Bearer token. Some endpoints are limited to admin users.',
        '<br><br>Demo project by Konstantin Starostin.',
      ].join(' '),
      version: `${packageJson.version}`,
    },
    externalDocs: {
      description: 'API source on GitHub',
      url: githubUrl,
    },
    servers: [{ url: apiPath }],
    definitions: {
      GenericOrderEntry: mongooseToSwagger(GenericOrderEntry, { omitFields }),
      Cart: mongooseToSwagger(Cart, { omitFields }),
      Category: mongooseToSwagger(Category, { omitFields }),
      Order: mongooseToSwagger(Order, { omitFields }),
      Product: mongooseToSwagger(Product, { omitFields }),
      Title: mongooseToSwagger(Title, { omitFields }),
      Badge: mongooseToSwagger(Badge, { omitFields }),
      User: mongooseToSwagger(User, {
        omitFields: [...omitFields, 'password', 'passwordChangedAt'],
      }),
    },
  },
  apis: [
    './routers/*.js',
    './swagger/parameters.yaml',
    './swagger/components.yaml',
  ],
});

// Swagger options
const options = {
  customCssUrl: [
    '../../../css/swagger-ui-theme-flattop.css',
    '../../../css/swagger-ui-general.css',
  ],
  customSiteTitle: 'Campfire | Store API',
  customfavIcon: '../../../img/favicon.ico',
};

module.exports = {
  document,
  options,
};
