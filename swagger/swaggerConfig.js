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

const basePath = '/';
const apiPath = `${basePath}api/v1`;

const omitFields = ['_id', 'createdAt', 'updatedAt'];

// Swagger document
const document = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campfire Store API',
      description: `Campfire Store API is a <strong>demo</strong> project of an API for an online store created by Konstantin Starostin.<br><br>It provides access to the shop's products, category system and simple user management, allows you to add products to the cart and place orders. Protected resources require prior authorization. Some resources are restricted to users without an admin role.<br><br>The source code and documentation are available on <a href="${process.env.GITHUB}" target="_blank">GitHub</a>.`,
      version: `${packageJson.version}`,
    },
    servers: [{ url: apiPath }],
    definitions: {
      GenericOrderEntry: mongooseToSwagger(GenericOrderEntry, { omitFields }),
      Cart: mongooseToSwagger(Cart, { omitFields }),
      Category: mongooseToSwagger(Category, { omitFields }),
      Order: mongooseToSwagger(Order, { omitFields }),
      Product: mongooseToSwagger(Product, { omitFields }),
      Title: mongooseToSwagger(Title, { omitFields }),
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
