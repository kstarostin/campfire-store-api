const express = require('express');

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */
router
  .route('/')
  /**
   * @swagger
   * /categories:
   *   get:
   *     tags: [Categories]
   *     summary: Get categories
   *     description: Get list of categories. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/limit'
   *       - $ref: '#/parameters/page'
   *       - $ref: '#/parameters/sort'
   *       - $ref: '#/parameters/fields'
   *       - in: query
   *         name: filter
   *         description: JSON string with parameter names and values to filter by.<br><br>Supported query conditions&#58; <code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$in</code>, <code>$or</code>, <code>$regex</code>, etc. Find more at <a target="_blank" href="https://www.mongodb.com/docs/manual/reference/operator/query/">Query and Projection Operators</a>.<br><br>Supported value types&#58; <code>string</code>, <code>number</code>, <code>boolean</code>, <code>object</code>, <code>array</code>.<br><br>Example&#58; <code>{ "nameI18n.en"&#58; { "$regex"&#58; "kayaks", "$options"&#58; "i" } }</code>.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *     responses:
   *       200:
   *         description: List of found category documents.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Category'
   */
  .get(categoryController.getAllCategories)
  /**
   * @swagger
   * /categories:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Create category
   *     description: Create a new category.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing category payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Category'
   *     responses:
   *       201:
   *         description: Created category document.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: '#/definitions/Category'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.createCategory,
  );

router
  .route('/:id')
  /**
   * @swagger
   * /categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Get category
   *     description: Get an existing category by provided <code>id</code>.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *       - $ref: '#/parameters/language'
   *     responses:
   *       200:
   *         description: Found category document, if exists.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: '#/definitions/Category'
   */
  .get(categoryController.getCategory)
  /**
   * @swagger
   * /categories/{id}:
   *   patch:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Update category
   *     description: Update an existing category by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *       - $ref: '#/parameters/language'
   *     requestBody:
   *       description: A JSON object containing category payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Category'
   *     responses:
   *       200:
   *         description: Updated category document.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: '#/definitions/Category'
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.updateCategory,
  )
  /**
   * @swagger
   * /categories/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Delete category
   *     description: Delete an existing category by provided <code>id</code>.<br><br>This resource is protected and requires prior authorization.<br><br>This resource is restricted to users without the role <code>admin</code>.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *     responses:
   *       204:
   *         description: No content.
   *       401:
   *         $ref: '#/components/responses/unauthorizedError'
   */
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.deleteCategory,
  );

router
  .route('/:id/products')
  /**
   * @swagger
   * /categories/{id}/products:
   *   get:
   *     tags: [Products]
   *     summary: Get products for category
   *     description: Get list of products for category. The results can be filtered, sorted, paginated and limited using special query parameters.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: <code>id</code> of a leaf category or a root category to filter by. For root categories, the result will contain a list of products for all it's child (leaf) categories.
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
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Product'
   */
  .get(productController.handleCategoryId, productController.getAllProducts);

module.exports = router;
