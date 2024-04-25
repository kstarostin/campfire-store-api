const swaggerJSDoc = require('swagger-jsdoc');
const mongooseToSwagger = require('mongoose-to-swagger');

const packageJson = require('../package.json');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const GenericOrderEntry = require('../models/genericOrderEntryModel');

const basePath = '/';
const apiPath = `${basePath}api/v1`;

// Swagger document
const document = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campfire Store API',
      description: `API for Campfire online shop. It provides access to the shop's products, category system and simple user management, allows you to add products to the cart and place orders.<br><br>Protected resources require prior authorization. Some resources are restricted to users without an admin role.`,
      version: `${packageJson.version}`,
    },
    servers: [{ url: apiPath }],
    definitions: {
      Category: mongooseToSwagger(Category),
      Product: mongooseToSwagger(Product),
      User: mongooseToSwagger(User),
      Cart: mongooseToSwagger(Cart),
      Order: mongooseToSwagger(Order),
      GenericOrderEntry: mongooseToSwagger(GenericOrderEntry),
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
    '../../../css/swagger-ui-theme-flatop.css',
    '../../../css/swagger-ui-general.css',
  ],
  customSiteTitle: 'Campfire | Store API',
  customfavIcon: '../../../img/favicon.ico',
};

module.exports = {
  document,
  options,
};
