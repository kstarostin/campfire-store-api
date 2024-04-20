const swaggerJSDoc = require('swagger-jsdoc');
const mongooseToSwagger = require('mongoose-to-swagger');

const packageJson = require('../package.json');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

const basePath = '/';
const apiPath = `${basePath}api/v1`;

// Swagger document
const document = swaggerJSDoc({
  definition: {
    swagger: '2.0',
    info: {
      title: 'Campfire Store API',
      description: `${packageJson.description}`,
      version: `${packageJson.version}`,
    },
    basePath: apiPath,
    definitions: {
      Category: mongooseToSwagger(Category),
      Product: mongooseToSwagger(Product),
      User: mongooseToSwagger(User),
      Cart: mongooseToSwagger(Cart),
      Order: mongooseToSwagger(Order),
    },
  },
  apis: ['./routers/*.js', './swagger/parameters.yaml'],
});

// Swagger options
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customCssUrl: '../../../css/swagger-ui-theme.css',
  customSiteTitle: 'Campfire | Store API',
  customfavIcon: '../../../img/favicon.ico',
};

module.exports = {
  document,
  options,
};
