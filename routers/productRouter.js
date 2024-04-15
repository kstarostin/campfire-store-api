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
   *     description: Get list of multiple items of the type product. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 50
   *           default: 25
   *         description: Maximal number of results per page. Default value is 25, maximal is 50.
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Current page number.
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *         description: Comma-separated sorting parameters.
   *       - in: query
   *         name: fields
   *         schema:
   *           type: string
   *         description: Comma-separated set of returned fields.
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
   *     description: Create a new item of the type product by provided ID.
   *     parameters:
   *       - name: name
   *         description: Product name.
   *         in: formData
   *         required: true
   *         type: string
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Created product.
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
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to search for.
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
   *     description: Update an product by provided ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to search for.
   *       - name: name
   *         description: Product name.
   *         in: formData
   *         required: true
   *         type: string
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Updated product.
   */
  .patch(productController.updateProduct)
  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Delete product
   *     description: Delete an existing product by provided ID.
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to search for.
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(productController.deleteProduct);

module.exports = router;
