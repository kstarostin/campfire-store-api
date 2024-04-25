const express = require('express');

const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

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
   *         description: List of found categories.
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
   *     description: Create a new category.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing category payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Category'
   *     responses:
   *       201:
   *         description: Created category.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Category'
   */
  .post(authController.protect, categoryController.createCategory);

router
  .route('/:id')
  /**
   * @swagger
   * /categories/{id}:
   *   get:
   *     tags: [Categories]
   *     summary: Get category
   *     description: Get an existing category by provided ID.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     responses:
   *       200:
   *         description: Found category, if exists.
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
   *     description: Update an existing category by provided ID.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *       - $ref: '#/parameters/language'
   *       - $ref: '#/parameters/currency'
   *     requestBody:
   *       description: A JSON object containing category payload.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/definitions/Category'
   *     responses:
   *       200:
   *         description: Updated category.
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Category'
   */
  .patch(authController.protect, categoryController.updateCategory)
  /**
   * @swagger
   * /categories/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     tags: [Categories]
   *     summary: Delete category
   *     description: Delete an existing category by provided ID.<br><br>This resource is protected and requires prior authorization.
   *     parameters:
   *       - $ref: '#/parameters/categoryId'
   *     responses:
   *       204:
   *         description: No content.
   */
  .delete(authController.protect, categoryController.deleteCategory);

module.exports = router;
