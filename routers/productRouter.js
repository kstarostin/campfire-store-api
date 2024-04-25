const express = require('express');

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */
router
  .route('/')
  /**
   * @swagger
   * /products:
   *   get:
   *     tags: [Products]
   *     summary: Get products
   *     description: Get list of products. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *     responses:
   *       200:
   *         description: List of found products.
   */
  .get(productController.getAllProducts)
  /**
   * @swagger
   * /products:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Products]
   *     summary: Create product
   *     description: Create a new product.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing product payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Product'
   *     responses:
   *       201:
   *         description: Created product.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Product'
   */
  .post(authController.protect, productController.createProduct);

router
  .route('/:id')
  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get product
   *     description: Get an existing product by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found product, if exists.
   */
  .get(productController.getProduct)
  /**
   * @swagger
   * /products/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Products]
   *     summary: Update product
   *     description: Update an existing product by provided ID.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing product payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Product'
   *     responses:
   *       200:
   *         description: Updated product.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Product'
   */
  .patch(authController.protect, productController.updateProduct)
  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Products]
   *     summary: Delete product
   *     description: Delete an existing product by provided ID.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(authController.protect, productController.deleteProduct);

module.exports = router;
