const swaggerJSDoc = require('swagger-jsdoc');
const mongooseToSwagger = require('mongoose-to-swagger');

const packageJson = require('../package.json');
const Product = require('../models/productModel');

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
      Product: mongooseToSwagger(Product),
    },
  },
  apis: ['./routers/*.js'],
});

// Swagger document
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
