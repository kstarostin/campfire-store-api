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
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - $ref: '#/parameters/profuctFilter'
   *     responses:
   *       200:
   *         description: Lists of found product documents and applicable filters.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/productsSchema'
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
   *     description: Create a new product.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
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
   *         description: Created product document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/productSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get product
   *     description: Get an existing product by provided <code>id</code>.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found product document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/productSchema'
   */
  .get(productController.getProduct)
  /**
   * @swagger
   * /products/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Products]
   *     summary: Update product or upload images
   *     description: Update an existing product by provided <code>id</code> Alternatively, this endpoint can be used to upload product images. Allowed image format is <code>.webp</code>. Recommended minimum image size is 2000x2000.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
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
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *     responses:
   *       200:
   *         description: Updated product document.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/productSchema'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.validateExistence,
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct,
  )
  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Products]
   *     summary: Delete product
   *     description: Delete an existing product by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct,
  );

router
  .route('/:id/images/:imageId')
  /**
   * @swagger
   * /products/{id}/images/{imageId}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Products]
   *     summary: Delete product image
   *     description: Delete a product image by provided product <code>id</code> and image <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/productId'
   *       - $ref: '#/parameters/imageId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProductImage,
  );

module.exports = router;
