const express = require('express');

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
   *     tags: [Products]
   *     summary: Create product
   *     description: Create a new product.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - name: name
   *         description: Product name.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: price
   *         description: Product price.
   *         in: formData
   *         required: true
   *         type: number
   *       - name: manufacturer
   *         description: Product manufacturer.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: category
   *         description: Product category ID.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Created product.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Product'
   */
  .post(productController.createProduct);

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
   *     tags: [Products]
   *     summary: Update product
   *     description: Update an existing product by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - name: name
   *         description: Product name.
   *         in: formData
   *         type: string
   *       - name: price
   *         description: Product price.
   *         in: formData
   *         type: integer
   *       - name: manufacturer
   *         description: Product manufacturer.
   *         in: formData
   *         type: string
   *       - name: category
   *         description: Product category ID.
   *         in: formData
   *         type: string
   *     responses:
   *       200:
   *         description: Updated product.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Product'
   */
  .patch(productController.updateProduct)
  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Delete product
   *     description: Delete an existing product by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(productController.deleteProduct);

module.exports = router;
